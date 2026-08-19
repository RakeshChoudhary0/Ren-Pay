import db from "../../Config/pg.js";
import jwt from "jsonwebtoken";
import GenerateJWT from "../../Helpers/GenerateJWT.js";
import { OAuth2Client } from "google-auth-library";
import envConfig from "../../Config/env.config.js";
import bcrypt from "bcryptjs";

const client = new OAuth2Client(envConfig.GOOGLE_CLIENT_ID);

const useGoogleSignin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "token is required",
      });
    }

    // Filter out undefined client IDs so Google's library doesn't throw an error
    const validAudiences = [
      envConfig.GOOGLE_CLIENT_ID,
      envConfig.GOOGLE_ANDROID_CLIENT_ID,
      envConfig.GOOGLE_IOS_CLIENT_ID,
    ].filter(Boolean);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: validAudiences,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ message: "Invalid Google Token" });
    }

    const googleId = payload.sub; // Unique Google ID
    const email = payload.email ? payload.email.toLowerCase() : null;
    const name = payload.name || "Google User";
    const avatar = payload.picture || null;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email not provided by Google account" });
    }

    // 1. Find by Google ID
    let query = `SELECT id, email, name, avatar , mpin FROM ren_users WHERE google_id = $1`;
    let result = await db.query(query, [googleId]);
    let user;

    if (result.rows.length > 0) {
      user = result.rows[0];

      if (avatar && user.avatar !== avatar) {
        await db.query(
          `UPDATE ren_users SET avatar = $1, updated_at = NOW() WHERE id = $2`,
          [avatar, user.id],
        );
        user.avatar = avatar;
      }
    } else {
      // 2. Find by Email (Account Linking)
      query = `SELECT id, email, name, avatar , mpin FROM ren_users WHERE email = $1`;
      result = await db.query(query, [email]);

      if (result.rows.length > 0) {
        user = result.rows[0];
        await db.query(
          `UPDATE ren_users SET google_id = $1, avatar = COALESCE(avatar, $2), updated_at = NOW() WHERE id = $3`,
          [googleId, avatar, user.id],
        );
        user.avatar = user.avatar || avatar;
      } else {
        // 3. Register Brand New User
        const newUserQuery = `
          INSERT INTO ren_users (email, name, google_id, avatar)
          VALUES ($1, $2, $3, $4)
          RETURNING id, email, name, avatar , mpin
        `;
        const newUserResult = await db.query(newUserQuery, [
          email,
          name,
          googleId,
          avatar,
        ]);

        user = newUserResult.rows[0];
      }
    }

    const jwtPayload = {
      user_id: user.id,
      email: user.email,
      avatar: user.avatar,
    };

    const accessToken = GenerateJWT(jwtPayload, "15m");
    const refreshToken = GenerateJWT(jwtPayload, "30d");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await db.query(
      `INSERT INTO user_refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
      [user.id, refreshToken, expiresAt],
    );

    return res.status(200).json({
      message: "Authentication successful",
      access_token: accessToken,
      refresh_token: refreshToken,
      data: user,
    });
  } catch (error) {
    console.error("Google Login Verification Error:", error);
    return res.status(401).json({ message: "Google authentication failed" });
  }
};

const useGetMe = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await db.query(
      `SELECT id, email, name, avatar , mpin FROM ren_users WHERE id = $1`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    return res.status(200).json({
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const useRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(refreshToken, envConfig.JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const tokenQuery = `SELECT * FROM user_refresh_tokens WHERE token = $1 AND user_id = $2`;
    const tokenResult = await db.query(tokenQuery, [
      refreshToken,
      decodedToken.user_id,
    ]);

    if (tokenResult.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Refresh token revoked or non-existent" });
    }

    const payload = {
      user_id: decodedToken.user_id,
      email: decodedToken.email,
      avatar: decodedToken.avatar,
    };
    const newAccessToken = GenerateJWT(payload, "15m");

    return res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const useLogOutController = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await db.query(`DELETE FROM user_refresh_tokens WHERE token = $1`, [
        refreshToken,
      ]);
    }

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const useSetMpin = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { mpin } = req.body;

    if (!mpin) {
      return res.status(400).json({ message: "MPIN is required" });
    }

    const hashed_mpin = await bcrypt.hash(mpin, 10);

    const result = await db.query(
      `UPDATE ren_users SET mpin = $1, updated_at = NOW() WHERE id = $2`,
      [hashed_mpin, userId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "MPIN set successfully" });
  } catch (error) {
    console.error("Set MPIN error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  useLogOutController,
  useGetMe,
  useRefreshToken,
  useGoogleSignin,
  useSetMpin,
};
