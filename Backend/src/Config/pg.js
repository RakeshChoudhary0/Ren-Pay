import { Pool } from "pg";
import envConfig from "./env.config.js"; // Note: Add .js extension if using ES Modules

const pool = new Pool({
  connectionString: envConfig.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    return console.error("connecting to online database", err.stack);
  }

  console.log("successfully connected to online PostGres");
  release();
});

// Handle idle connection errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

// FIXED EXPORT: Export an object containing the query function
const db = {
  query: (text, params) => pool.query(text, params),
};

export default db;
