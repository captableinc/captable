import { invariant } from "@/lib/error";
import type { TPermission } from "@/lib/rbac/schema";
import type { Roles } from "@/prisma/enums";

type DefaultRoles = Exclude<Roles, "CUSTOM">;

export const ACTIONS = ["create", "read", "update", "delete", "*"] as const;
export const SUBJECTS = ["billing", "members", "stakeholder", "roles"] as const;

export type TSubjects = (typeof SUBJECTS)[number];
export type TActions = (typeof ACTIONS)[number];

const generateDefaultId = (name: DefaultRoles) => `default-${name}`;

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

const defaultRoleKeys = Object.keys(humanizedDefaultRoles) as DefaultRoles[];

export const defaultRolesList: RoleList[] = defaultRoleKeys.map((item) => {
  const key = item as keyof typeof humanizedDefaultRoles;
  const name = humanizedDefaultRoles[key];

  return {
    name,
    type: "default",
    id: generateDefaultId(key),
    role: key,
  };
});

export const defaultRolesIdMap = defaultRoleKeys.reduce<
  Record<string, DefaultRoles>
>((prev, curr) => {
  const key = generateDefaultId(curr);
  prev[key] = curr;
  return prev;
}, {});

interface getRoleIdOption {
  role: Roles;
  customRoleId: string | null;
}

export const getRoleId = ({ role, customRoleId }: getRoleIdOption) => {
  if (role !== "CUSTOM") {
    return generateDefaultId(role);
  }

  invariant(customRoleId, "custom role id not found");

  return customRoleId;
};
