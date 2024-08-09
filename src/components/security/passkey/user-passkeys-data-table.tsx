"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableBody } from "@/components/ui/data-table/data-table-body";
import { SortButton } from "@/components/ui/data-table/data-table-buttons";
import { DataTableContent } from "@/components/ui/data-table/data-table-content";
import { DataTableHeader } from "@/components/ui/data-table/data-table-header";
import type { RouterOutputs } from "@/trpc/shared";
import * as React from "react";

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

import { dayjsExt } from "@/common/dayjs";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { Icon } from "@/components/ui/icon";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { PasskeyTableToolbar } from "./passkey-table-toolbar";
import UpdatePasskeyNameModal from "./update-passkey-name-modal";

type Passkey = RouterOutputs["passkey"]["find"]["data"];

type PasskeyType = {
  passkey: Passkey;
};

const humanizeDeviceType = (type: string) => {
  switch (type) {
    case "SINGLE_DEVICE":
      return "Single device";

    case "MULTI_DEVICE":
      return "Multi device";

    default:
      return "";
  }
};

export const columns: ColumnDef<Passkey[number]>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <SortButton
          label="Device Name"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => <div className="text-left">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "credentialDeviceType",
    header: ({ column }) => {
      return (
        <SortButton
          label="Device type"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="text-left">
        {humanizeDeviceType(row.getValue("credentialDeviceType"))}
      </div>
    ),
  },
  {
    accessorKey: "credentialBackedUp",
    header: ({ column }) => {
      return (
        <SortButton
          label="Backup"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="text-left">
        <Badge
          variant={row.getValue("credentialBackedUp") ? "success" : "warning"}
          className="h-7 align-middle"
        >
          {row.getValue("credentialBackedUp") ? "Done" : "Pending"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <SortButton
          label="Created"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="text-left">
        {dayjsExt(row.getValue("createdAt")).fromNow()}
      </div>
    ),
  },

  {
    accessorKey: "lastUsedAt",
    header: ({ column }) => {
      return (
        <SortButton
          label="Used"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="text-left">
        {row.getValue("lastUsedAt")
          ? dayjsExt(row.getValue("lastUsedAt")).fromNow()
          : "Not yet"}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [open, setOpen] = React.useState<boolean>(false);
      const router = useRouter();

      const passkey = row.original;
      const DELETE__ACTION = "Delete passkey";
      const UPDATE__ACTION = "Update passkey";

      const { mutateAsync: deletePasskeyMutation } =
        api.passkey.delete.useMutation({
          onSuccess: () => {
            toast.success("🎉 Successfully deleted the passkey");
            router.refresh();
          },
          onError: () => {
            toast.error("Error while deleting the passkey. Please try again.");
          },
        });

      const handleDeletePasskey = async () => {
        await deletePasskeyMutation({ passkeyId: passkey.id });
      };

      const onOpenModal = () => setOpen(true);
      return (
        <>
          <DropdownMenu>
            <div className="items-end justify-end text-right">
              <DropdownMenuTrigger
                className="border-0 border-white outline-none focus:outline-none"
                asChild
              >
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Icon name="more-2-fill" aria-hidden className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={onOpenModal}>
                {UPDATE__ACTION}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleDeletePasskey}
                className="text-red-500"
              >
                {DELETE__ACTION}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {open && (
            <UpdatePasskeyNameModal
              title="Update passkey name"
              subtitle="Please provide some relevant subtitle"
              trigger={<p />}
              passkeyId={passkey.id}
              prevPasskeyName={passkey.name}
              dialogProps={{ open, setOpen }}
            />
          )}
        </>
      );
    },
  },
];

const PasskeyTable = ({ passkey }: PasskeyType) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: passkey ?? [],
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
        <PasskeyTableToolbar />
        <DataTableContent>
          <DataTableHeader />
          <DataTableBody />
        </DataTableContent>
        <DataTablePagination />
      </DataTable>
    </div>
  );
};

export default PasskeyTable;
