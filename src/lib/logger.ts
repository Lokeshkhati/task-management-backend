import winston from "winston";
import { config } from "../config/index.js";

export const getLogger = (service: string, level = "debug") => {
  return winston.createLogger({
    level: level,
    defaultMeta: { service },
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ level, message, timestamp, service }) => {
        return `[${timestamp}] [${level}] [${service}]: ${message}`;
      })
    ),
    transports: [new winston.transports.Console()],
  });
};

const logger = getLogger(config.SERVICE_NAME, config.LOG_LEVEL);

export default logger;