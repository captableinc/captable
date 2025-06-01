import type { ReactNode } from "react";
import {
  type PermissionsContext,
  useAllowed,
  type useAllowedOptions,
} from "../hooks/use-allowed.js";

interface AllowProps extends useAllowedOptions {
  children: ReactNode | ((authorized: boolean) => ReactNode);
  permissionsContext: PermissionsContext;
}

export const Allow = ({
  children,
  permissionsContext,
  ...rest
}: AllowProps) => {
  const { isAllowed } = useAllowed(rest, permissionsContext);

  if (isAllowed) {
    if (typeof children === "function") {
      return children(isAllowed);
    }
    return children;
  }
  return null;
};
