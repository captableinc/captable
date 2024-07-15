export const JOB_TYPES = {
  email: [
    "auth-verify",
    "share-update",
    "share-data-room",
    "password-reset",
    "member-invite",
    "esign-confirmation",
    "esign-notification",
    "2fa-recovery-codes",
    "2fa-enabled",
    "2fa-disabled",
    "account-blocked",
  ],
  generate: ["esign-pdf"],
} as const;
