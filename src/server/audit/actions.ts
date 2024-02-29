export const AUDIT_ACTIONS = {
  user: ["signed-up", "onboarded"],
  company: ["created"],
  member: [
    "invited",
    "re-invited",
    "accepted",
    "updated",
    "removed",
    "revoked-invite",
    "deactivated",
    "activated",
  ],
  shareClass: ["created", "updated", "deleted"],
  equityPlan: ["created", "updated", "deleted"],
  document: ["created", "deleted"],
} as const;
