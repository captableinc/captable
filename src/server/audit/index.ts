/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "../db";
import { type AuditActions } from "./types";
import { type AuditActor, type AuditContext, type AuditTarget } from "./types";

interface AuditInterface {
  companyId: string;
  action: AuditActions;
  occurredAt?: Date | string;
  actor: AuditActor;
  target: AuditTarget;
  context: AuditContext;
}

const create = (data: AuditInterface) => {
  return db.audit.create({
    data,
  });
};

export const Audit = {
  create,
};

// --------------- Example usage: ----------------

// import { Audit } from "@/lib/audit";

// Audit.create({
//   action: "user.created",
//   actor: {
//     type: "user",
//     id: input.email,
//   },
//   target: [
//     {
//       type: "user",
//       id: input.email,
//     },
//   ],
//   context: {
//     location: "123.123.123",
//     user_agent: "chrome",
//   },
// });
