import db from "../../Config/pg.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

/**
 * Helper: Generate unique transaction ID
 * Example: TXN1699123456789X7K2P9
 */
const generateTxnId = () => {
  const timestamp = Date.now();
  const randomSuffix = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `TXN${timestamp}${randomSuffix}`;
};

/**
 * Controller: sendToUser
 * Performs money transfer between sender and receiver in an atomic database transaction.
 */

const sendToUser = async (req, res) => {
  const senderId = req.user?.user_id;
  const {
    receiver_id,
    receiver_email,
    amount,
    currency = "INR",
    note = null,
    mpin,
    idempotency_key,
  } = req.body;

  // 1. Basic validation
  if (!senderId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const parsedAmount = parseFloat(amount);
  if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid amount greater than 0",
    });
  }

  if (!receiver_id && !receiver_email) {
    return res.status(400).json({
      success: false,
      message:
        "Receiver identifier (receiver_id or receiver_email) is required",
    });
  }

  // 2. Check Idempotency (prevent duplicate payment execution)

  if (!idempotency_key) {
    return res.status(400).json({
      success: false,
      message: "Idempotency key is required",
    });
  }

  if (idempotency_key) {
    const existingTxn = await db.query(
      `SELECT * FROM transactions WHERE idempotency_key = $1`,
      [idempotency_key],
    );

    if (existingTxn.rows.length > 0) {
      const existing = existingTxn.rows[0];
      return res.status(200).json({
        success: existing.status === "SUCCESS",
        message: "Transaction already processed",
        data: existing,
      });
    }
  }

  // 3. Verify MPIN (if provided or enforced)

  if (!mpin) {
    return res.status(400).json({
      success: false,
      message: "MPIN is required",
    });
  }

  if (mpin) {
    const userRes = await db.query(`SELECT mpin FROM ren_users WHERE id = $1`, [
      senderId,
    ]);

    if (userRes.rows.length === 0 || !userRes.rows[0].mpin) {
      return res.status(400).json({
        success: false,
        message: "MPIN is not set for your account. Please set it first.",
      });
    }

    const isMatch = await bcrypt.compare(mpin, userRes.rows[0].mpin);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect MPIN",
      });
    }
  }

  // 4. Resolve Receiver ID
  let targetReceiverId = receiver_id;
  if (!targetReceiverId && receiver_email) {
    const receiverRes = await db.query(
      `SELECT id FROM ren_users WHERE LOWER(email) = LOWER($1)`,
      [receiver_email],
    );
    if (receiverRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found with given email",
      });
    }
    targetReceiverId = receiverRes.rows[0].id;
  }

  if (Number(targetReceiverId) === Number(senderId)) {
    return res.status(400).json({
      success: false,
      message: "You cannot transfer money to yourself",
    });
  }

  // 5. Begin Database Transaction for Atomic Transfer
  const client = await db.connect();
  const txnId = generateTxnId();

  try {
    await client.query("BEGIN");

    // Fetch sender account with row-level lock (FOR UPDATE)
    const senderAccQuery = `
      SELECT id, balance, is_frozen, currency 
      FROM accounts 
      WHERE user_id = $1 
      FOR UPDATE
    `;
    const senderAccRes = await client.query(senderAccQuery, [senderId]);

    if (senderAccRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Sender account not found",
      });
    }

    const senderAccount = senderAccRes.rows[0];

    if (senderAccount.is_frozen) {
      await client.query("ROLLBACK");
      return res.status(403).json({
        success: false,
        message: "Your account is frozen. Transactions are disabled.",
      });
    }

    if (parseFloat(senderAccount.balance) < parsedAmount) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Insufficient account balance",
      });
    }

    // Fetch receiver account with row-level lock (FOR UPDATE)
    const receiverAccQuery = `
      SELECT id, balance, is_frozen, currency 
      FROM accounts 
      WHERE user_id = $1 
      FOR UPDATE
    `;
    let receiverAccRes = await client.query(receiverAccQuery, [
      targetReceiverId,
    ]);

    // If receiver account does not exist yet, auto-create it
    if (receiverAccRes.rows.length === 0) {
      const createReceiverAcc = `
        INSERT INTO accounts (user_id, balance, currency, is_frozen)
        VALUES ($1, 0.00, $2, false)
        RETURNING id, balance, is_frozen, currency
      `;
      receiverAccRes = await client.query(createReceiverAcc, [
        targetReceiverId,
        currency,
      ]);
    }

    const receiverAccount = receiverAccRes.rows[0];

    if (receiverAccount.is_frozen) {
      await client.query("ROLLBACK");
      return res.status(403).json({
        success: false,
        message: "Receiver account is frozen. Cannot transfer funds.",
      });
    }

    // Deduct from sender
    await client.query(
      `UPDATE accounts 
       SET balance = balance - $1, updated_at = NOW() 
       WHERE id = $2`,
      [parsedAmount, senderAccount.id],
    );

    // Credit to receiver
    await client.query(
      `UPDATE accounts 
       SET balance = balance + $1, updated_at = NOW() 
       WHERE id = $2`,
      [parsedAmount, receiverAccount.id],
    );

    // Record the transaction
    const insertTxnQuery = `
      INSERT INTO transactions (
        txn_id,
        idempotency_key,
        sender_id,
        receiver_id,
        amount,
        currency,
        status,
        type,
        note,
        failure_reason,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *
    `;

    const txnResult = await client.query(insertTxnQuery, [
      txnId,
      idempotency_key,
      senderId,
      targetReceiverId,
      parsedAmount,
      currency,
      "SUCCESS",
      "TRANSFER",
      note,
      null,
    ]);

    await client.query("COMMIT");

    const createdTxn = txnResult.rows[0];

    return res.status(200).json({
      success: true,
      message: "Payment transferred successfully",
      data: createdTxn,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transfer transaction error:", error);

    // Log failed transaction if possible
    try {
      await db.query(
        `INSERT INTO transactions (
          txn_id, idempotency_key, sender_id, receiver_id, amount, currency, status, type, note, failure_reason
        ) VALUES ($1, $2, $3, $4, $5, $6, 'FAILED', 'TRANSFER', $7, $8)`,
        [
          txnId,
          finalIdempotencyKey,
          senderId,
          targetReceiverId || null,
          parsedAmount,
          currency,
          note,
          error.message || "Internal transfer failure",
        ],
      );
    } catch (logErr) {
      console.error("Failed to log failed transaction:", logErr);
    }

    return res.status(500).json({
      success: false,
      message: "Payment transfer failed. Please try again. ",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

export { sendToUser };
