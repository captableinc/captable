import type { TPermission } from "@/lib/rbac/schema";
import type { Roles } from "@/prisma/enums";

type DefaultRoles = Exclude<Roles, "CUSTOM">;

export const ACTIONS = ["create", "read", "update", "delete", "*"] as const;
export const SUBJECTS = ["billing", "members", "stakeholder", "roles"] as const;

export type TSubjects = (typeof SUBJECTS)[number];
export type TActions = (typeof ACTIONS)[number];

export interface RoleList {
  id: string;
  type: "default" | "custom";
  name: string;
}

const SUPER_USER = SUBJECTS.map((item) => ({
  actions: ["*" as TActions],
  subject: item,
}));

export const defaultPermissions: Record<DefaultRoles, TPermission[]> = {
  BILLING: [{ actions: ["*"], subject: "billing" }],
  EMPLOYEE: [{ actions: ["*"], subject: "members" }],
  INVESTOR: [],
  SUPER_USER,
};

const humanizedDefaultRoles: Record<Exclude<Roles, "CUSTOM">, string> = {
  BILLING: "Billing",
  EMPLOYEE: "Employee",
  INVESTOR: "Investor",
  SUPER_USER: "Super User",
};

const defaultRoleNames = Object.values(humanizedDefaultRoles);
export const defaultRolesList: RoleList[] = defaultRoleNames.map((name) => ({
  name,
  type: "default",
  id: `default-${name}`,
}));
