"use client";

import { useAllowed, type useAllowedOptions } from "@/hooks/use-allowed";
import type { ReactNode } from "react";

interface AllowProps extends useAllowedOptions {
  children: ReactNode;
}

export const Allow = ({ children, ...rest }: AllowProps) => {
  const { isAllowed } = useAllowed({ ...rest });

  return isAllowed ? children : null;
};
