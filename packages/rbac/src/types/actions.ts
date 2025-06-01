export const ACTIONS = ["create", "read", "update", "delete", "*"] as const;
export type TActions = (typeof ACTIONS)[number];
