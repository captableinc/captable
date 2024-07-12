export const SUBJECTS = [
  "billing",
  "members",
  "stakeholder",
  "roles",
  "company",
] as const;
export type TSubjects = (typeof SUBJECTS)[number];
