import { Pool } from "pg";
import envConfig from "./env.config.js";

const pool = new Pool({
  connectionString: envConfig.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("connecting to online database", err.stack);
  }
  console.log("successfully connected to online PostGres");
  release();
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

const db = {
  query: (text, params) => pool.query(text, params),
};

export default db;
