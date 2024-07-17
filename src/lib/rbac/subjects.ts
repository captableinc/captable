export const SUBJECTS = [
  "billing",
  "members",
  "stakeholder",
  "roles",
  "api-keys",
] as const;
export type TSubjects = (typeof SUBJECTS)[number];
