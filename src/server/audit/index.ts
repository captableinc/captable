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

import type { AuditSchemaType, TEsignAuditSchema } from "@/server/audit/schema";
import type { TPrismaOrTransaction } from "@/server/db";

const create = (data: AuditSchemaType, tx: TPrismaOrTransaction) => {
  return tx.audit.create({
    data,
  });
};

export const Audit = {
  create,
};

const esignAuditCreate = (
  data: TEsignAuditSchema,
  tx: TPrismaOrTransaction,
) => {
  return tx.esignAudit.create({
    data,
  });
};

export const EsignAudit = {
  create: esignAuditCreate,
};
