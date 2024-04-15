"use client";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";

import { dayjsExt } from "@/common/dayjs";
import { formatNumber } from "@/common/formatNumber";
import { Money } from "@/components/shared/money";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableBody } from "@/components/ui/data-table/data-table-body";
import {
  SortButton,
  SortButtonBefore,
} from "@/components/ui/data-table/data-table-buttons";
import { DataTableContent } from "@/components/ui/data-table/data-table-content";
import { DataTableHeader } from "@/components/ui/data-table/data-table-header";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { type RouterOutputs } from "@/trpc/shared";
import ActionCell from "./share-actions";
import { ShareTableToolbar } from "./shares-table-toolbar";

type Share = RouterOutputs["securities"]["getShares"]["data"];

type SharesType = {
  shares: Share;
};

export const columns: ColumnDef<Share[number]>[] = [
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
    accessorKey: "stakeholder.name",
    header: ({ column }) => {
      return (
        <SortButton
          label="Stakeholder"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="flex">
        <Avatar className="rounded-full">
          <AvatarImage src={"/placeholders/user.svg"} />
        </Avatar>
        <div className="ml-2 pt-2">
          <p>{row?.original?.stakeholder?.name}</p>
        </div>
      </div>
    ),
  },
  {
    id: "shareClass",
    accessorKey: "shareClass.classType",
    header: ({ column }) => (
      <SortButton
        label="Share class"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <div className="text-left">{row.original.shareClass.classType}</div>
    ),
  },
  {
    id: "issueDate",
    accessorKey: "issueDate",
    header: ({ column }) => (
      <SortButton
        label="Issue date"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <div className="text-left">
        {dayjsExt(row.original.issueDate).format("DD/MM/YYYY")}
      </div>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <SortButton
        label="Status"
        onClick={() => column.toggleSorting(column?.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => <div className="text-left">{row.original.status}</div>,
  },
  {
    id: "quantity",
    accessorKey: "quantity",
    header: ({ column }) => (
      <div className="flex justify-end">
        <SortButtonBefore
          label="Quantity"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right">{formatNumber(row.original.quantity)}</div>
    ),
  },
  {
    id: "pricePerShare",
    accessorKey: "pricePerShare",
    header: ({ column }) => (
      <div className="flex justify-end">
        <SortButtonBefore
          label="Price per share"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right">
        <Money value={row.original.pricePerShare!} />
      </div>
    ),
  },
  {
    id: "capitalContribution",
    accessorKey: "capitalContribution",
    header: ({ column }) => (
      <div className="flex justify-end">
        <SortButtonBefore
          label="Investment Amount"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right">
        <Money value={row.original.capitalContribution!} />
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionCell share={row.original} />,
  },
];

const ShareTable = ({ shares }: SharesType) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: shares ?? [],
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
        <ShareTableToolbar />
        <DataTableContent>
          <DataTableHeader />
          <DataTableBody />
        </DataTableContent>
        <DataTablePagination />
      </DataTable>
    </div>
  );
};

export default ShareTable;
