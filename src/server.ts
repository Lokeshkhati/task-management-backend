
import app from "./app.js";
import { config } from "./config/index.js";
import logger from "./lib/logger.js";
import { setupGracefulShutdown } from "./utils/shutdown.js";

const server  = app.listen(config.PORT, () => {
  logger.info(
    `${config.SERVICE_NAME} is running on http://localhost:${config.PORT}`,
  );
})

setupGracefulShutdown(server);
