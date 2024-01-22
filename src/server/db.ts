import { PrismaClient } from "@prisma/client";
import {
  type AuditActions as TAuditActions,
  type AuditActor as TAuditActor,
  type AuditContext as TAuditContext,
  type AuditTarget as TAuditTarget,
} from "@/server/audit/types";

import { env } from "@/env";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PrismaJson {
    type AuditAction = TAuditActions;
    type AuditActor = TAuditActor;
    type AuditTarget = TAuditTarget;
    type AuditContext = TAuditContext;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
