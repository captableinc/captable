import { type ReactNode, createContext, useContext } from "react";

import type { Table } from "@tanstack/react-table";

interface DataTableRootProps<TData> {
  children: ReactNode;
  table: Table<TData>;
}

interface TDataTableContext<TData> {
  table: Table<TData>;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const TableStateContext = createContext<TDataTableContext<any> | null>(null);

export const useTable = () => {
  const context = useContext(TableStateContext);

  if (!context) {
    throw new Error("useTable should be called inside DataTable");
  }

  return context;
};

export function DataTable<TData>({
  children,
  table,
}: DataTableRootProps<TData>) {
  return (
    <TableStateContext.Provider value={{ table: table }}>
      {children}
    </TableStateContext.Provider>
  );
}
