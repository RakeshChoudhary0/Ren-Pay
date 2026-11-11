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
      success: true ,
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


export { useGetAccountBalance };
