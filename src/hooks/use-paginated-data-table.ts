import type {
  PaginationState,
  RowData,
  TableState,
  Updater,
} from "@tanstack/react-table";
import { parseAsInteger, useQueryState, useQueryStates } from "nuqs";
import { type TDataTableOptions, useDataTable } from "./use-data-table";

type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

type TState = MakeRequired<Partial<TableState>, "pagination">;

export function usePaginatedQueryParams() {
  const [{ limit, page }, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(2),
  });

  const pageIndex = page - 1;
  const pageSize = limit;

  const onPaginationChange = (updater: Updater<PaginationState>) => {
    if (typeof updater === "function") {
      const updateValue = updater({ pageIndex, pageSize });

      setParams({
        limit: updateValue.pageSize,
        page: updateValue.pageIndex + 1,
      });
    }
  };

  return { pageIndex, pageSize, onPaginationChange, limit, page, setParams };
}

export function useSortQueryParams() {
  return useQueryState("sort");
}

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
