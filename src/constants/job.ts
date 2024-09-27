export const JOB_TYPES = {
  email: [
    "auth-verify",
    "share-update",
    "share-data-room",
    "password-reset",
    "member-invite",
    "esign-confirmation",
    "esign-notification",
    "safe-signing",
  ],
  esign: ["generate-pdf", "complete-pdf"],
} as const;
