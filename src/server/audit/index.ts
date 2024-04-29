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

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type AuditSchemaType } from "@/server/audit/schema";
import { type TPrismaOrTransaction } from "@/server/db";

const create = (data: AuditSchemaType, tx: TPrismaOrTransaction) => {
  return tx.audit.create({
    data,
  });
};

export const Audit = {
  create,
};
