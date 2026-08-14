import envConfig from "../Config/env.config.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = envConfig.JWT_SECRET;

const GenerateJWT = (payload, expiresIn) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn });
};

export default GenerateJWT;
