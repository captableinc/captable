import type { TPermission } from "@/lib/rbac/schema";
import type { Roles } from "@/prisma/enums";

export const ACTIONS = ["create", "read", "update", "delete", "*"] as const;
export const SUBJECTS = ["billing", "members", "stakeholder", "roles"] as const;

export const ADMIN_PERMISSION = SUBJECTS.map((item) => ({
  actions: ["*" as TActions],
  subject: item,
}));

export const ADMIN_ROLE_ID = "default-admin";

export const DEFAULT_PERMISSION = SUBJECTS.map((item) => ({
  actions: [] as TActions[],
  subject: item,
}));

export const DEFAULT_ADMIN_ROLE: RoleList = {
  id: ADMIN_ROLE_ID,
  name: "Admin",
  type: "default",
  role: "ADMIN",
};

export type RoleList = {
  id: string;
  name: string;
} & (
  | {
      role?: never;
      type: "custom";
      permissions: TPermission[];
    }
  | {
      type: "default";
      permissions?: never;
      role: DefaultRoles;
    }
);

export type TSubjects = (typeof SUBJECTS)[number];
export type TActions = (typeof ACTIONS)[number];
type DefaultRoles = Exclude<Roles, "CUSTOM">;
