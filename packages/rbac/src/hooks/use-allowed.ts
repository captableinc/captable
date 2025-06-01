import type { TActions } from "../types/actions.js";
import type { TSubjects } from "../types/subjects.js";

export interface useAllowedOptions {
  subject: TSubjects;
  action: TActions;
}

export interface PermissionsContext {
  permissions?: Map<TSubjects, TActions[]>;
}

export function useAllowed(
  { action, subject }: useAllowedOptions,
  permissionsContext: PermissionsContext,
) {
  const permissions =
    permissionsContext?.permissions ?? new Map<TSubjects, TActions[]>();

  const hasSubject = permissions.has(subject);
  const hasAction =
    (permissions.get(subject)?.includes(action) ?? false) ||
    (permissions.get(subject)?.includes("*") ?? false);

  const isAllowed = hasSubject && hasAction;

  return { isAllowed };
}
