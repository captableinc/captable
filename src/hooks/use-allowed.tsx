import type { TActions, TSubjects } from "@/constants/rbac";
import { api } from "@/trpc/react";

export interface useAllowedOptions {
  subject: TSubjects;
  action: TActions;
}

export function useAllowed({ action, subject }: useAllowedOptions) {
  const { data } = api.rbac.getRoles.useQuery();

  const roles = data?.roles ?? new Map<TSubjects, TActions[]>();

  const hasSubject = roles.has(subject);
  const hasAction = roles.get(subject)?.includes(action) ?? false;

  const isAllowed = hasSubject && hasAction;

  return { isAllowed };
}
