import cron from "node-cron";
import db from "../Config/pg.js";
export const initTokenCleanupCron = () => {
  cron.schedule("* * * * *", async () => {
    try {
      console.log("Cron Job Started");
      const result = await db.query(
        `DELETE FROM user_refresh_tokens WHERE expires_at < NOW()`,
      );
      console.log(
        `[CRON] Cleaned up ${result.rowCount} expired refresh token(s).`,
      );
    } catch (error) {
      console.error("[CRON] Error cleaning up expired refresh tokens:", error);
    }
  });
};
