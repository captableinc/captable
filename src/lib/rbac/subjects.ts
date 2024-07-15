export const SUBJECTS = [
  "billing",
  "members",
  "stakeholder",
  "roles",
  "audits",
] as const;
export type TSubjects = (typeof SUBJECTS)[number];
