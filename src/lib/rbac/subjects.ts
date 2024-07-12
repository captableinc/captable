export const SUBJECTS = [
  "billing",
  "members",
  "stakeholder",
  "roles",
  "documents",
] as const;
export type TSubjects = (typeof SUBJECTS)[number];
