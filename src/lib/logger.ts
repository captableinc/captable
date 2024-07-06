import { env } from "@/env";
import pino, { type Logger } from "pino";

export const logger: Logger = pino({
  ...(env.NODE_ENV === "development"
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
        level: "debug",
      }
    : {
        level: "info",
      }),
});
