import pino, { type Logger } from "pino";

const createLogger = (): Logger => {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isDevelopment) {
    try {
      return pino({
        level: "debug",
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "yyyy-mm-dd HH:MM:ss",
          },
        },
      });
    } catch (_error) {
      // Fallback to basic logger if pino-pretty is not available
      return pino({
        level: "debug",
      });
    }
  }

  return pino({
    level: "info",
  });
};

export const logger: Logger = createLogger();
