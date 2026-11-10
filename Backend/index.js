import app from "./src/app.js";
import envConfig from "./src/Config/env.config.js";
import "./src/Config/pg.js";

import { initTokenCleanupCron } from "./src/corn/tokenCleanup.cron.js";
initTokenCleanupCron();

app.listen(envConfig.PORT, () => {
  console.log("Server is running on port", envConfig.PORT);
});
