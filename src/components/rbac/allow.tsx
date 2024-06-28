"use client";

import { useAllowed, type useAllowedOptions } from "@/hooks/use-allowed";
import type { ReactNode } from "react";

interface AllowProps extends useAllowedOptions {
  children: ReactNode | ((authorized: boolean) => ReactNode);
}

export const Allow = ({ children, ...rest }: AllowProps) => {
  const { isAllowed } = useAllowed({ ...rest });

  if (isAllowed) {
    if (typeof children === "function") {
      return children(isAllowed);
    }
    return children;
  }

  return null;
};
