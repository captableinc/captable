import type { ReactNode } from "react";
import type { TActions } from "../types/actions.js";
import type { TSubjects } from "../types/subjects.js";
import { useRoles } from "./roles-provider.js";

interface AllowWithProviderProps {
  subject: TSubjects;
  action: TActions;
  children: ReactNode | ((authorized: boolean) => ReactNode);
}

export const AllowWithProvider = ({
  children,
  action,
  subject,
}: AllowWithProviderProps) => {
  const { permissions } = useRoles();

  const hasSubject = permissions.has(subject);
  const hasAction =
    (permissions.get(subject)?.includes(action) ?? false) ||
    (permissions.get(subject)?.includes("*") ?? false);

  const isAllowed = hasSubject && hasAction;

  if (isAllowed) {
    if (typeof children === "function") {
      return children(isAllowed);
    }
    return children;
  }
  return null;
};
