import pino, { type Logger } from "pino";

export const logger: Logger =
  process.env.NODE_ENV === "production"
    ? // JSON in production
      pino({ level: "WARN" })
    : // Pretty print in development
      pino({
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
        level: "debug",
      });
