import winston from "winston";

const ipFormat = winston.format.printf((info) => {
  return `${info.timestamp} ${info.meta.ip} ${info.meta.status} ${info.meta.country} ${info.meta.city} ${info.meta.isp} ${info.meta.hostname}`;
});

export const IP_LOGGER = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), ipFormat),
  transports: [
    new winston.transports.File({
      dirname: process.env.LOG_DIR,
      filename: "ips.log",
    }),
  ],
});

const LOGGER = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      dirname: process.env.LOG_DIR,
      filename: "combined.log",
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

export default LOGGER;
