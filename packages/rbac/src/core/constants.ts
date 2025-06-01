import type { TActions } from "../types/actions.js";
import type { TPermission } from "../types/schema.js";
import { SUBJECTS } from "../types/subjects.js";

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

type DefaultRoles = "ADMIN" | "USER" | "VIEWER"; // Generic role types
