import { type ReactNode, createContext, useContext } from 'react'

import { type Table } from '@tanstack/react-table'

interface DataTableRootProps<TData> {
  children: ReactNode
  table: Table<TData>
}

interface TDataTableContext<TData> {
  table: Table<TData>
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const dataTableContext = createContext<TDataTableContext<any> | null>(null)

export const useDataTable = () => {
  const context = useContext(dataTableContext)

  if (!context) {
    throw new Error('useDataTable should be called inside DataTable')
  }

  return context
}

export function DataTable<TData>({
  children,
  table,
}: DataTableRootProps<TData>) {
  return (
    <dataTableContext.Provider value={{ table: table }}>
      {children}
    </dataTableContext.Provider>
  )
}
