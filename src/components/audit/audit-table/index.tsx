"use client";

import * as React from "react";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFacetedUniqueValues,
  getFacetedRowModel,
} from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { type RouterOutputs } from "@/trpc/shared";

import { DataTableContent } from "@/components/ui/data-table/data-table-content";
import { DataTableHeader } from "@/components/ui/data-table/data-table-header";
import { DataTableBody } from "@/components/ui/data-table/data-table-body";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { AuditTableToolbar } from "./audit-table-toolbar";
import { SortButton } from "@/components/ui/data-table/data-table-buttons";
import { dayjsExt } from "@/common/dayjs";

type Audit = RouterOutputs["audit"]["getAudits"]["data"];

interface AuditTableProps {
  audits: Audit;
}

export const columns: ColumnDef<Audit[number]>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "action",
    accessorKey: "action",
    header: () => {
      return <div>Action</div>;
    },
    cell: ({ row }) => (
      <div>
        <Badge variant="secondary">{row.getValue("action")}</Badge>
      </div>
    ),
    filterFn: (row, id, value: string[]) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value.includes(row.getValue(id));
    },
  },

  {
    id: "occurredAt",
    accessorKey: "occurredAt",
    header: ({ column }) => {
      return (
        <SortButton
          label="Time"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("occurredAt"));
      const formattedDate = dayjsExt(date).format("lll");
      return <time dateTime={date.toISOString()}>{formattedDate}</time>;
    },
  },

  {
    id: "summary",
    accessorKey: "summary",
    header: () => {
      return <div>Summary</div>;
    },
    cell: ({ row }) => {
      return <p>{row.getValue("summary")}</p>;
    },
  },
];

export function AuditTable({ audits }: AuditTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: audits,
    columns: columns,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full p-6">
      <DataTable table={table}>
        <AuditTableToolbar />
        <DataTableContent>
          <DataTableHeader />
          <DataTableBody />
        </DataTableContent>
        <DataTablePagination />
      </DataTable>
    </div>
  );
}
