import app from "./src/app.js";
import envConfig from "./src/Config/env.config.js";
import "./src/Config/pg.js";

app.listen(envConfig.PORT, () => {
  console.log("Server is running on port", envConfig.PORT);
});
