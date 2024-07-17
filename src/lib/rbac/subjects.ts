export const SUBJECTS = [
  "billing",
  "members",
  "stakeholder",
  "roles",
  "company",
  "api-keys",
] as const;
export type TSubjects = (typeof SUBJECTS)[number];
