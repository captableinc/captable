"use client";

import { type RouterOutputs } from "@/trpc/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { SortButton } from "@/components/ui/data-table/data-table-buttons";
import React from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableContent } from "@/components/ui/data-table/data-table-content";
import { DataTableHeader } from "@/components/ui/data-table/data-table-header";
import { DataTableBody } from "@/components/ui/data-table/data-table-body";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { UpdateTableToolbar } from "./update-table-toolbar";
import { RiAddCircleLine } from "@remixicon/react";
import { dayjsExt } from "@/common/dayjs";

type Update = RouterOutputs["update"]["get"]["data"];

type UpdateTableType = {
  updates: Update;
};

const getUpdateStatus = (status: string) => {
  switch (status) {
    case "DRAFT":
      return <Badge variant="warning">Draft</Badge>;
    case "PUBLIC":
      return <Badge variant="success">Public</Badge>;
    case "PRIVATE":
      return <Badge variant="destructive">Private</Badge>;
  }
};

const updateActions = (status: string) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="sm">
          <RiAddCircleLine className="h-4 w-4" />
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {status === "DRAFT" && (
          <DropdownMenuItem>Edit this update</DropdownMenuItem>
        )}
        <DropdownMenuItem>Share this update</DropdownMenuItem>
        {status !== "DRAFT" && (
          <DropdownMenuItem>
            {status === "PUBLIC" ? "Make it private" : "Make it public"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Update[number]>[] = [
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
    id: "title",
    header: ({ column }) => {
      return (
        <SortButton
          label="Title"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    accessorFn: (row) => row.title,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => {
      return <div>Status</div>;
    },
    cell: ({ row }) => <div>{getUpdateStatus(row.original.status)}</div>,
  },
  {
    accessorKey: "sent",
    header: ({ column }) => {
      return (
        <SortButton
          label="Sent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      if (row.getValue("sentAt")) {
        return <div>{dayjsExt().to(row.original.sentAt)}</div>;
      } else {
        return <div>Pending</div>;
      }
    },
  },
  {
    accessorKey: "actions",
    header: () => {
      return <div>Actions</div>;
    },
    cell: ({ row }) => <div>{updateActions(row.original.status)}</div>,
  },
];

const UpdateTable = ({ updates }: UpdateTableType) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: updates,
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
        <UpdateTableToolbar />
        <DataTableContent>
          <DataTableHeader />
          <DataTableBody />
        </DataTableContent>
        <DataTablePagination />
      </DataTable>
    </div>
  );
};

export default UpdateTable;
