"use client";

import { invariant } from "@/lib/error";
import type { RouterOutputs } from "@/trpc/shared";
import { type ReactNode, createContext, useContext } from "react";

type initialData = RouterOutputs["rbac"]["getPermissions"];

const RolesProviderContext = createContext<initialData | null>(null);

interface RolesProviderProps {
  children: ReactNode;
  data: initialData;
}

export const RolesProvider = ({ children, data }: RolesProviderProps) => {
  return (
    <RolesProviderContext.Provider value={data}>
      {children}
    </RolesProviderContext.Provider>
  );
};

export const useRoles = () => {
  const data = useContext(RolesProviderContext);

  invariant(data, "useRoles should be used inside RolesProvider");

  return data;
};
