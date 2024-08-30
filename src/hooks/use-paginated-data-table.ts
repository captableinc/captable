import type {
  ColumnFilter,
  ColumnFiltersState,
  PaginationState,
  RowData,
  SortingState,
  TableState,
  Updater,
} from "@tanstack/react-table";
import {
  type UseQueryStatesKeysMap,
  type Values,
  parseAsInteger,
  parseAsStringLiteral,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { useMemo } from "react";
import { type TDataTableOptions, useDataTable } from "./use-data-table";

type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

type TState = MakeRequired<Partial<TableState>, "pagination">;

export function usePaginatedQueryParams() {
  const [{ limit, page }, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
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

  return {
    pagination: { pageIndex, pageSize },
    onPaginationChange,
    limit,
    page,
    setParams,
  };
}

function parseSortingState(sort: string) {
  const [field, direction] = sort.split(".");

  const state: SortingState = [{ id: field ?? "", desc: direction === "desc" }];

  return state;
}

export function useSortQueryParams<
  T extends readonly string[],
  U extends T[number],
  V extends T[number],
>(schema: T, defaultValue: U) {
  const [sort, setSort] = useQueryState<V>(
    "sort",
    //@ts-expect-error
    parseAsStringLiteral(schema).withDefault(defaultValue),
  );

  const sorting = parseSortingState(sort);

  const onSortingChange = (updater: Updater<SortingState>) => {
    if (typeof updater === "function") {
      const updateValue = updater(sorting);

      const sortValue = updateValue[0]
        ? `${updateValue[0]?.id}.${updateValue[0]?.desc ? "desc" : "asc"}`
        : defaultValue;

      setSort(sortValue as V);
    }
  };

  return { onSortingChange, setSort, sort, sorting };
}

function parseFilteringState<T extends UseQueryStatesKeysMap>(
  filter: Values<T>,
) {
  const columnFilters: ColumnFilter[] = [];

  for (const key in filter) {
    if (Object.prototype.hasOwnProperty.call(filter, key)) {
      const value = filter[key];
      if (value) {
        columnFilters.push({ id: key, value });
      }
    }
  }

  return columnFilters;
}

function keyMapInitial<KeyMap extends UseQueryStatesKeysMap>(keyMap: KeyMap) {
  return Object.keys(keyMap).reduce(
    (obj, key) => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const { defaultValue } = keyMap[key]!;

      obj[key as keyof KeyMap] = defaultValue ?? null;
      return obj;
    },
    {} as Values<KeyMap>,
  );
}

function toQueryState<KeyMap extends UseQueryStatesKeysMap>(
  updateValue: ColumnFiltersState,
) {
  return updateValue.reduce<Record<string, unknown>>((prev, current) => {
    prev[current.id] = current.value;
    return prev;
  }, {}) as Values<KeyMap>;
}

export function useFilterQueryParams<KeyMap extends UseQueryStatesKeysMap>(
  keyMap: KeyMap,
) {
  const [state, setState] = useQueryStates(keyMap);

  const columnFilters = parseFilteringState(state);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const defaultValue = useMemo(() => {
    return keyMapInitial(keyMap);
  }, []);

  const onColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    if (typeof updater === "function") {
      const updateValue = updater(columnFilters);

      if (updateValue.length) {
        setState(toQueryState<KeyMap>(updateValue));
      } else {
        setState(defaultValue);
      }
    }
  };
  return { columnFilters, onColumnFiltersChange, state };
}

export function usePaginatedTable<TData extends RowData>(
  options: Omit<TDataTableOptions<TData>, "state"> & { state: TState },
) {
  return useDataTable({
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: options.pageCount ?? -1,
    ...options,
  });
}
