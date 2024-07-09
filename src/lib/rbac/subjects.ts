export const SUBJECTS = ["billing", "members", "stakeholder", "roles"] as const;
export type TSubjects = (typeof SUBJECTS)[number];
