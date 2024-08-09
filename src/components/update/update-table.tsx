"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableBody } from "@/components/ui/data-table/data-table-body";
import { SortButton } from "@/components/ui/data-table/data-table-buttons";
import { DataTableContent } from "@/components/ui/data-table/data-table-content";
import { DataTableHeader } from "@/components/ui/data-table/data-table-header";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import type { RouterOutputs } from "@/trpc/shared";
import { RiAddCircleLine } from "@remixicon/react";
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
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { pushModal } from "../modals";
import { ChangeUpdateVisibilityAlertDialog } from "./change-update-visibility-alert-dialog";
import { UpdateTableToolbar } from "./update-table-toolbar";

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

const UpdateActions = (row: { original: Update[number] }) => {
  const [open, setOpen] = useState<boolean>(false);
  const {
    id: updateId,
    publicId: updatePublicId,
    status,
    public: isPublic,
  } = row.original;

  const { data } = useSession();
  const companyPublicId = data?.user.companyPublicId;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="sm">
          <Icon name="add-circle-line" className="h-4 w-4" />
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {status === "DRAFT" && (
          <DropdownMenuItem>
            <Link href={`/${companyPublicId}/updates/${updatePublicId}`}>
              Edit this update
            </Link>
          </DropdownMenuItem>
        )}

        {status !== "DRAFT" && (
          <DropdownMenuItem asChild>
            <ChangeUpdateVisibilityAlertDialog
              dialogProps={{ open, setOpen }}
              updateId={updateId}
              updatePublicId={updatePublicId}
              isPublic={isPublic}
              trigger={
                <p className="relative hover:bg-gray-100 flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  {status === "PUBLIC" ? "Make it private" : "Make it public"}
                </p>
              }
            />
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          asChild
          onClick={() => {
            pushModal("ShareUpdateModal", {
              update: {
                id: updateId,
                publicId: updatePublicId,
              },
            });
          }}
        >
          <div className="relative hover:bg-gray-100 flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            Share this update
          </div>
        </DropdownMenuItem>
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
      return <div>Sharing status</div>;
    },
    cell: ({ row }) => <div>{getUpdateStatus(row.original.status)}</div>,
  },
  {
    accessorKey: "actions",
    header: () => {
      return <div>Actions</div>;
    },
    cell: ({ row }) => <div>{UpdateActions(row)}</div>,
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
