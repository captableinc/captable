export const SUBJECTS = [
  "billing",
  "members",
  "stakeholder",
  "roles",
  "documents",
  "api-keys",
] as const;
export type TSubjects = (typeof SUBJECTS)[number];
