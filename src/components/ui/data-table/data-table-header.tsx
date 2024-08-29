import { type Header, flexRender } from "@tanstack/react-table";
import { TableHead, TableHeader, TableRow } from "../table";

import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiExpandUpDownLine,
} from "@remixicon/react";
import { useTable } from "./data-table";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function HeaderItem({ header }: { header: Header<any, any> }) {
  const canSort = header.column.getCanSort();
  const Element = canSort ? "button" : "div";

  const label = canSort
    ? header.column.getNextSortingOrder() === "asc"
      ? "Sort ascending"
      : header.column.getNextSortingOrder() === "desc"
        ? "Sort descending"
        : "Clear sort"
    : undefined;
  return (
    <Element
      className={canSort ? "cursor-pointer select-none flex items-center" : ""}
      onClick={header.column.getToggleSortingHandler()}
      aria-label={label}
      title={label}
    >
      {flexRender(header.column.columnDef.header, header.getContext())}
      {{
        asc: <RiArrowUpSLine aria-hidden className="ml-2 h-4 w-4" />,
        desc: <RiArrowDownSLine aria-hidden className="ml-2 h-4 w-4" />,
      }[header.column.getIsSorted() as string] ?? null}

      {canSort && !header.column.getIsSorted() ? (
        <RiExpandUpDownLine aria-hidden className="ml-2 h-4 w-4" />
      ) : null}
    </Element>
  );
}

export function DataTableHeader() {
  const { table } = useTable();
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder ? null : <HeaderItem header={header} />}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
