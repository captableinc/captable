"use client";

import { type ReactNode, createContext, useContext } from "react";
import type { TActions } from "../types/actions.js";
import type { TSubjects } from "../types/subjects.js";

export interface RolesData {
  permissions: Map<TSubjects, TActions[]>;
  [key: string]: unknown; // Allow for additional data with unknown type
}

const RolesProviderContext = createContext<RolesData | null>(null);

interface RolesProviderProps {
  children: ReactNode;
  data: RolesData;
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

  if (!data) {
    throw new Error("useRoles should be used inside RolesProvider");
  }

  return data;
};
