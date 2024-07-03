"use client";

import { type initialData, usePermission } from "@/hooks/use-allowed";
import type { ReactNode } from "react";

interface RolesProviderProps {
  children: ReactNode;
  initialData: initialData;
}

export const RolesProvider = ({
  children,
  initialData,
}: RolesProviderProps) => {
  usePermission(initialData);

  return children;
};
