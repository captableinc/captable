export const JOB_TYPES = {
  email: [
    "auth-verify",
    "share-update",
    "share-data-room",
    "password-reset",
    "member-invite",
    "esign-confirmation",
    "esign-notification",
    "google-connected",
    "google-disconnected",
  ],
  generate: ["esign-pdf"],
} as const;
