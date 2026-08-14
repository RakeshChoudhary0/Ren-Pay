import jwt from "jsonwebtoken";
import envConfig from "../Config/env.config.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        message: "Access Denied",
        code: "NO_TOKEN_OR_NOT_STARTING WITH_BEARER",
      });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, envConfig.JWT_SECRET);

    req.user = decodedToken;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired", code: "TOKEN_EXPIRED" });
    }

    console.log("Auth Error:", error.message);
    return res.status(401).json({ message: "Invalid Token" });
  }
};
