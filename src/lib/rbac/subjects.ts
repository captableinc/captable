export const SUBJECTS = [
  "billing",
  "members",
  "stakeholder",
  "roles",
  "audits",
  "documents",
  "company",
  "developer",
  "bank-accounts",
] as const;
export type TSubjects = (typeof SUBJECTS)[number];
