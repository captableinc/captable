"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableBody } from "@/components/ui/data-table/data-table-body";
import { DataTableContent } from "@/components/ui/data-table/data-table-content";
import { DataTableHeader } from "@/components/ui/data-table/data-table-header";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/use-data-table";
import type { UpdateStatusEnum } from "@/prisma/enums";
import type { RouterOutputs } from "@/trpc/shared";
import { RiAddCircleLine } from "@remixicon/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { type ReactElement, useState } from "react";
import { pushModal } from "../modals";
import { ChangeUpdateVisibilityAlertDialog } from "./change-update-visibility-alert-dialog";
import { UpdateTableToolbar } from "./update-table-toolbar";

type Update = RouterOutputs["update"]["get"]["data"];

type UpdateTableType = {
  updates: Update;
};

const UpdateStatus: Record<UpdateStatusEnum, ReactElement> = {
  DRAFT: <Badge variant="warning">Draft</Badge>,
  PUBLIC: <Badge variant="success">Public</Badge>,
  PRIVATE: <Badge variant="destructive">Private</Badge>,
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
          <RiAddCircleLine className="h-4 w-4" />
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

const columnHelper = createColumnHelper<Update[number]>();

const columns = [
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

  columnHelper.accessor("title", {
    header: "Title",
    cell: (row) => <div className="font-medium">{row.getValue()}</div>,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (row) => <div>{UpdateStatus[row.getValue()]}</div>,
  }),
  columnHelper.display({
    id: "actions",
    header: "Title",
    cell: ({ row }) => UpdateActions(row),
    enableSorting: false,
    enableHiding: false,
  }),
];

const UpdateTable = ({ updates }: UpdateTableType) => {
  const table = useDataTable({ data: updates, columns: columns });

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
