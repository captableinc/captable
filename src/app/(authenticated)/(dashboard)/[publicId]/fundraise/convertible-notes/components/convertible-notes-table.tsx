"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableBody } from "@/components/ui/data-table/data-table-body";
import { SortButton } from "@/components/ui/data-table/data-table-buttons";
import { DataTableContent } from "@/components/ui/data-table/data-table-content";
import { DataTableHeader } from "@/components/ui/data-table/data-table-header";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import type { TGetManyConvertibleNoteRes } from "@/server/api/client-handlers/convertible-note";
import { RiMore2Fill } from "@remixicon/react";

type ConvertibleNote = TGetManyConvertibleNoteRes["data"];

type Props = {
  notes: ConvertibleNote;
};

export const columns: ColumnDef<ConvertibleNote[number]>[] = [
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
    id: "stakeholderName",
    header: ({ column }) => {
      return (
        <SortButton
          label="Stakeholder"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    accessorFn: (row) => row?.stakeholder?.name,
    cell: ({ row }) => (
      <div className="flex">
        <Avatar className="h-10 w-10 rounded-full">
          <AvatarImage src={"/avatar.svg"} />
        </Avatar>
        <div className=" ml-2 pt-2">
          <p>{row?.original?.stakeholder?.name}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "capital",
    header: ({ column }) => {
      return (
        <SortButton
          label="Capital"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("capital")}</div>
    ),
  },
  {
    accessorKey: "valuationCap",
    header: ({ column }) => {
      return (
        <SortButton
          label="ValuationCap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("valuationCap")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <SortButton
          label="Type"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => <div className="text-left">{row.getValue("type")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <SortButton
          label="Status"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "discountRate",
    header: ({ column }) => {
      return (
        <SortButton
          label="Discount Rate"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("discountRate")}</div>
    ),
  },
  {
    accessorKey: "issueDate",
    header: ({ column }) => {
      return (
        <SortButton
          label="Issue Date"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="text-left">
        {new Date(row.getValue("issueDate")).toLocaleDateString()}
      </div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <div className="items-end justify-end text-right">
            <DropdownMenuTrigger
              className="border-0 border-white outline-none focus:outline-none"
              asChild
            >
              <Button variant="ghost" className="h-8 w-8 p-0">
                <>
                  <span className="sr-only">Open menu</span>
                  <RiMore2Fill aria-hidden className="h-4 w-4" />
                </>
              </Button>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={() => {}} className="text-red-500">
              Delete Note
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const ConvertibleNotesTable = ({ notes }: Props) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: notes ?? [],
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
        <DataTableContent>
          <DataTableHeader />
          <DataTableBody />
        </DataTableContent>
        <DataTablePagination />
      </DataTable>
    </div>
  );
};
