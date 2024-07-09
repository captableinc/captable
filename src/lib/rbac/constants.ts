import type { TPermission } from "@/lib/rbac/schema";
import type { Roles } from "@/prisma/enums";
import type { TActions } from "./actions";
import { SUBJECTS } from "./subjects";

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

type DefaultRoles = Exclude<Roles, "CUSTOM">;
