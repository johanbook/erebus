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

export const ACCESS_LOGGER = winston.createLogger({
  level: "info",
  // Info message may contain newlines which we want to get rid of
  format: winston.format.printf((info) => info.message.replace("\n","")),
  transports: [
    new winston.transports.File({
      dirname: process.env.LOG_DIR,
      filename: "app.access.log",
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

export const ACCESS_LOGGER_STREAM = {
  write: (message: string) => ACCESS_LOGGER.info(message),
};
