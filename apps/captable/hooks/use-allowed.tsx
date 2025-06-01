import { useRoles } from "@/providers/roles-provider";
import { useAllowed as useBaseAllowed } from "@captable/rbac/client";
import type { TActions, TSubjects } from "@captable/rbac/types";

export interface useAllowedOptions {
  subject: TSubjects;
  action: TActions;
}

export function useAllowed({ action, subject }: useAllowedOptions) {
  const rolesData = useRoles();

  return useBaseAllowed(
    { action, subject },
    { permissions: rolesData?.permissions },
  );
}
