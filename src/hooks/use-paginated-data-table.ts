import type { RowData, TableState } from "@tanstack/react-table";
import { type TDataTableOptions, useDataTable } from "./use-data-table";

type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

type TState = MakeRequired<Partial<TableState>, "pagination">;

export function usePaginatedTable<TData extends RowData>(
  options: Omit<TDataTableOptions<TData>, "state"> & { state: TState },
) {
  return useDataTable({
    ...options,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: options.pageCount ?? -1,
  });
}
