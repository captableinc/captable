import type { TActions } from "@/lib/rbac/actions";
import type { TSubjects } from "@/lib/rbac/subjects";
import { useRoles } from "@/providers/roles-provider";

export interface useAllowedOptions {
  subject: TSubjects;
  action: TActions;
}

export function useAllowed({ action, subject }: useAllowedOptions) {
  const data = useRoles();

  const permissions = data?.permissions ?? new Map<TSubjects, TActions[]>();

  const hasSubject = permissions.has(subject);
  const hasAction =
    (permissions.get(subject)?.includes(action) ?? false) ||
    (permissions.get(subject)?.includes("*") ?? false);

  const isAllowed = hasSubject && hasAction;

  return { isAllowed };
}
