import { config } from "dotenv";

config();

const PORT = process.env.PORT;
const GMAIL_ID = process.env.GMAIL_ID;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const DATABASE_URL = process.env.DATABASE_URL;

if (
  !PORT ||
  !GMAIL_ID ||
  !REFRESH_TOKEN ||
  !GOOGLE_CLIENT_ID ||
  !GOOGLE_CLIENT_SECRET ||
  !DATABASE_URL
) {
  throw Error("Something is not defined in environment variables");
}

const envConfig = {
  PORT: PORT,
  GMAIL_ID: GMAIL_ID,
  REFRESH_TOKEN: REFRESH_TOKEN,
  GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: GOOGLE_CLIENT_SECRET,
  DATABASE_URL: DATABASE_URL,
};

export default envConfig;
