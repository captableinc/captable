"use client";

import { dayjsExt } from "@/common/dayjs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableBody } from "@/components/ui/data-table/data-table-body";
import { DataTableContent } from "@/components/ui/data-table/data-table-content";
import { DataTableHeader } from "@/components/ui/data-table/data-table-header";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useDataTable } from "@/hooks/use-data-table";
import type { RouterOutputs } from "@/trpc/shared";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import * as React from "react";
import { AuditTableToolbar } from "./audit-table-toolbar";

type Audit = RouterOutputs["audit"]["getAudits"]["data"];

interface AuditTableProps {
  audits: Audit;
}

const columnHelper = createColumnHelper<Audit[number]>();

export const columns = [
  columnHelper.display({
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
  }),

  columnHelper.accessor("action", {
    header: "Action",
    cell: (row) => (
      <div>
        <Badge variant="secondary">{row.getValue()}</Badge>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  }),

  columnHelper.accessor("occurredAt", {
    header: "Time",
    cell: (row) => {
      const date = new Date(row.getValue());
      const formattedDate = dayjsExt(date).format("lll");
      return (
        <time suppressHydrationWarning dateTime={date.toISOString()}>
          {formattedDate}
        </time>
      );
    },
  }),

  columnHelper.accessor("summary", {
    header: "Summary",
    cell: (row) => row.getValue(),
  }),
];

export function AuditTable({ audits }: AuditTableProps) {
  const table = useDataTable({
    data: audits,
    columns: columns,
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
