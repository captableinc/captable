export const SUBJECTS = [
  "billing",
  "members",
  "stakeholder",
  "roles",
  "audits",
  "documents",
  "company",
  "api-keys",
] as const;
export type TSubjects = (typeof SUBJECTS)[number];
