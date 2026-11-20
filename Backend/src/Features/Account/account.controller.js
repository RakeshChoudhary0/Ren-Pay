import db from "../../Config/pg.js";

/**
 * @function ensureUserAccountExists
 * @param(userId)
 * This Ensures the Account Exists and return The Account Detail
 */

const ensureUserAccountExists = async (userId) => {
  try {
    const query = `Select id , balance , currency , is_frozen FROM accounts WHERE user_id = $1`;
    const result = await db.query(query, [userId]);

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    const createUserAccount = `INSERT INTO accounts (user_id, balance, currency, is_frozen)
    VALUES ($1, 10000.00, 'INR', false)
    RETURNING id, balance, currency, is_frozen`;

    const newAccount = await db.query(createUserAccount, [userId]);
    return newAccount.rows[0];
  } catch (error) {}
};

/**
 * @API
 * @useGetAccountBalance
 * This is to Get the User Details
 */

const useGetAccountBalance = async (req, res) => {
  try {
    const userId = req.user?.user_id;
    console.log(userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UnAuthorised",
      });
    }

    const account = await ensureUserAccountExists(userId);

    if (account.is_frozen) {
      return res.status(403).json({
        success: false,
        message: "Account is Forzen due to Security policies",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account Balance Fetched Successfully",
      data: {
        balance: account.balance,
        currency: account.currency,
        is_frozen: account.is_frozen,
      },
    });
  } catch (error) {
    console.error("Get Account Balance Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


/**
 * @API
 * @useFindUserAccount
 * Search other users by email to send money
 */
const useFindUserAccount = async (req, res) => {
  const currentUserId = req.user?.user_id;
  const { email, limit = 10 } = req.query;

  if (!currentUserId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (!email || email.trim().length < 2) {

    return res.status(401).json({
      success: false,
      message: "Please provide at least 2 characters to search by email",
    });
  }

  const searchTerm = `%${email.trim().toLowerCase()}%`;
  const parsedLimit = Math.min(parseInt(limit, 10) || 10, 20);

  try {
    const searchQuery = `
      SELECT id, name, email , avatar
      FROM ren_users
      WHERE id != $1
        AND LOWER(email) LIKE $2
      LIMIT $3
    `;

    const result = await db.query(searchQuery, [
      currentUserId,
      searchTerm,
      parsedLimit,
    ]);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Email search error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while searching users",
    });
  }
};

/**
 * @API
 * @getRecentTrasaction
 * Query: ?filter=pastWeek | all (defaults to "pastWeek")
 * The API uses JOINS for ren_users and Transactions table
*/

const getRecentTrasaction = async (req, res) => {
  try {
    const currentUserId = req.user?.user_id;
    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const account = await ensureUserAccountExists(currentUserId);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    const { filter = "pastWeek" } = req.query;

    const dateFilter =
      filter === "pastWeek"
        ? `AND t.created_at >= NOW() - INTERVAL '7 days'`
        : "";

    const query = `
      SELECT
        t.*,
        sender.name AS sender_name,
        receiver.name AS receiver_name
      FROM transactions t
      LEFT JOIN ren_users sender ON t.sender_id = sender.id
      LEFT JOIN ren_users receiver ON t.receiver_id = receiver.id
      WHERE (t.sender_id = $1 OR t.receiver_id = $1)
      ${dateFilter}
      ORDER BY t.created_at DESC
    `;

    const result = await db.query(query, [currentUserId]);

    return res.status(200).json({
      success: true,
      message: result.rows.length ? "Transactions fetched" : "No transactions found",
      data: result.rows,
    });
  } catch (error) {
    console.error("Get Transactions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { useGetAccountBalance, useFindUserAccount ,getRecentTrasaction };
