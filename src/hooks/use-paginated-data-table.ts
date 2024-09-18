"use client";

import type {
  ColumnFiltersState,
  RowData,
  SortingState,
  Updater,
} from "@tanstack/react-table";

import { useRouter } from "next/navigation";
import { type TDataTableOptions, useDataTable } from "./use-data-table";
import { useUpdateSearchParams } from "./use-update-search-params";

function parseSortingState(sort: string) {
  const [field, direction] = sort.split(".");

  const state: SortingState = [{ id: field ?? "", desc: direction === "desc" }];

  return state;
}

function parseFilteringState(
  filterFields?: { id: string; value: string | undefined }[],
) {
  const columnFilters: ColumnFiltersState = [];

  if (filterFields) {
    for (const filter of filterFields) {
      if (filter.value) {
        columnFilters.push({ id: filter.id, value: [filter.value] });
      }
    }
  }

  return columnFilters;
}

export function usePaginatedTable<TData extends RowData>({
  page,
  limit,
  sort,
  filterFields = [],
  ...options
}: TDataTableOptions<TData> & {
  page: number;
  limit: number;
  sort: string;
  filterFields?: { id: string; value: string | undefined }[];
}) {
  const router = useRouter();

  const updateSearchParams = useUpdateSearchParams();

  const pageIndex = page - 1;
  const pageSize = limit;
  const sorting = parseSortingState(sort);

  const columnFilters = parseFilteringState(filterFields);

  return useDataTable({
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: options.pageCount ?? -1,
    state: {
      pagination: {
        pageIndex,
        pageSize,
        ...(options?.state?.pagination && { ...options.state.pagination }),
      },
      sorting,
      columnFilters,
      ...(options?.state && { ...options.state }),
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const updateValue = updater({ pageIndex, pageSize });
        updateSearchParams({
          limit: updateValue.pageSize,
          page: updateValue.pageIndex + 1,
        });
      }
    },

    onSortingChange: (updater: Updater<SortingState>) => {
      if (typeof updater === "function") {
        const updateValue = updater(sorting);

        const sortValue = updateValue[0]
          ? `${updateValue[0]?.id}.${updateValue[0]?.desc ? "desc" : "asc"}`
          : undefined;

        updateSearchParams({ sort: sortValue });
      }
    },

    onColumnFiltersChange: (updater: Updater<ColumnFiltersState>) => {
      if (typeof updater === "function") {
        const updateValue = updater(columnFilters);
        if (updateValue.length) {
          const state = updateValue.reduce<Record<string, unknown>>(
            (prev, curr) => {
              prev[curr.id] = curr.value;

              return prev;
            },
            {},
          );

          //@ts-expect-error
          updateSearchParams({ ...state });
        } else {
          const path = window.location.pathname;
          router.push(path);
        }
      }
    },

    ...options,
  });
}
