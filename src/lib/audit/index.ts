import { db } from "@/server/db";

interface AuditInterface {
  action: string;
  occurred_at?: Date;
  actor: {
    // add more types here
    type: "user" | "company";
    id: string;
  };
  target: {
    // add more types here
    type: "user" | "company";
    id: string;
  }[];
  context: {
    location: string;
    user_agent: string;
  };
}

const create = async ({
  action,
  occurred_at,
  actor,
  target,
  context,
}: AuditInterface) => {
  const audit = await db.audit.create({
    data: {
      action,
      occurredAt: occurred_at,
      actor,
      target,
      context,
    },
  });

  return audit;
};

const Audit = {
  create,
};

export default Audit;

// --------------- Example usage: ----------------

// import Audit from "@/lib/audit";
// import { USER_WAITLISTED } from "@/lib/audit/actions";

// Audit.create({
//   action: USER_WAITLISTED,
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
