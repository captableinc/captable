import { ADMIN_ROLE_ID } from "@/lib/rbac/constants";
import type { Roles } from "@/prisma/enums";
import { invariant } from "../error";

interface getRoleIdOption {
  role: Roles | null;
  customRoleId: string | null;
}

export const getRoleId = ({ role, customRoleId }: getRoleIdOption) => {
  if (role === "ADMIN") {
    return ADMIN_ROLE_ID;
  }

  if (!role) {
    return undefined;
  }

  invariant(customRoleId, "custom role id not found");

  return customRoleId;
};
