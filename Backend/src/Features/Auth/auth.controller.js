import db from "../../Config/pg.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userLoginController = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim().toLowerCase();

    const query = `SELECT id,email,password_hash FROM ren_users WHERE email = $1`;
    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const payload = {
      user_id: user.id,
      email: user.email,
    };

    const AccessToken = jwt.sign(payload, envConfig.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.status(200).json({
      message: "User logged in successfully",
      user,
      AccessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const useGetMe = (req, res) => {
  console.log("use get me");
};

const useSignUpController = async (req, res) => {};
const useLogOutController = async (req, res) => {};

export { userLoginController, useLogOutController, useSignUpController };
