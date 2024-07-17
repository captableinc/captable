export const SUBJECTS = [
  "billing",
  "members",
  "stakeholder",
  "roles",
  "audits",
  "api-keys",
] as const;
export type TSubjects = (typeof SUBJECTS)[number];
