"use client";
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { api } from "@/trpc/react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { type RouterOutputs } from "@/trpc/shared";
// import { ShareTableToolbar } from "./share-table-toolbar";
import { RiFileDownloadLine, RiMoreLine } from "@remixicon/react";
import { DataTableHeader } from "@/components/ui/data-table/data-table-header";
import { DataTableBody } from "@/components/ui/data-table/data-table-body";
import { DataTableContent } from "@/components/ui/data-table/data-table-content";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { SortButton } from "@/components/ui/data-table/data-table-buttons";
import { getPresignedGetUrl } from "@/server/file-uploads";
import { useToast } from "@/components/ui/use-toast";
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

type Share = RouterOutputs["securities"]["getShares"]["data"];

type SharesType = {
  shares: Share;
};

type Document = {
  bucket: {
    key: string;
    mimeType: string;
    size: number;
  };
  name: string;
  uploader: {
    user: {
      name: string | null;
      image: string | null;
    };
  };
};

export const columns: ColumnDef<Share[number]>[] = [
  // Replace this with the column definitions for your Shares data
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
        <Avatar className="">
          <AvatarImage src={"/avatar.svg"} />
        </Avatar>
        <div className=" ml-2 pt-2">
          <p>{row?.original?.stakeholder?.name}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <SortButton
          label="Quantity"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("quantity")}</div>
    ),
  },
  {
    accessorKey: "certificateld",
    header: ({ column }) => {
      return (
        <SortButton
          label="Certificate ID"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("certificateld")}</div>
    ),
  },
  // Add more columns as needed
];

const ShareTable = ({ shares }: SharesType) => {
  console.log({ shares }, "shares");

  // Similar to OptionTable, but replace options with shares
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
        {/* <ShareTableToolbar /> */}
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
