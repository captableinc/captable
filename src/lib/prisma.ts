/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;
