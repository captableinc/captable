export const AUDIT_ACTIONS = {
  user: ["signup"],
  company: ["create"],
  stakeholder: [
    "invite",
    "re-invite",
    "accept",
    "update",
    "remove",
    "revoke-invite",
    "deactivate",
    "activate",
  ],
} as const;
