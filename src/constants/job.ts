export const JOB_TYPES = {
  email: [
    "auth-verify",
    "share-update",
    "share-data-room",
    "password-reset",
    "esign-confirmation",
    "esign-notification",
  ],
  generate: ["esign-pdf"],
} as const;
