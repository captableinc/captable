import type { TActions, TSubjects } from "@/constants/rbac";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";

export interface useAllowedOptions {
  subject: TSubjects;
  action: TActions;
}

export type initialData = RouterOutputs["rbac"]["getPermissions"];

export const usePermission = (initialData?: initialData) => {
  return api.rbac.getPermissions.useQuery(undefined, {
    refetchOnWindowFocus: false,
    initialData,
  });
};

export function useAllowed({ action, subject }: useAllowedOptions) {
  const { data } = usePermission();

  const permissions = data?.permissions ?? new Map<TSubjects, TActions[]>();

  const hasSubject = permissions.has(subject);
  const hasAction =
    (permissions.get(subject)?.includes(action) ?? false) ||
    (permissions.get(subject)?.includes("*") ?? false);

  const isAllowed = hasSubject && hasAction;

  return { isAllowed };
}
