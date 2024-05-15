"use client";

import { DataTableBody } from "@/components/ui/data-table/data-table-body";
import { SortButton } from "@/components/ui/data-table/data-table-buttons";
import { DataTableContent } from "@/components/ui/data-table/data-table-content";
import { DataTableHeader } from "@/components/ui/data-table/data-table-header";
import { type RouterOutputs } from "@/trpc/shared";
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
import { api } from "@/trpc/react";
import { RiMoreLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useToast } from "../ui/use-toast";
import { PasskeyTableToolbar } from "./passkey-table-toolbar";
import UpdatePasskeyNameModal from "./update-passkey-name-modal";

type Passkey = RouterOutputs["passkey"]["find"]["data"];

type PasskeyType = {
  passkey: Passkey;
};

const humanizeBackupStatus = (status: boolean) => {
  if (status) {
    return (
      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
        Done
      </span>
    );
  } else {
    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
      Pending
    </span>;
  }
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
        {humanizeBackupStatus(!!row.getValue("credentialBackedUp"))}
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
  // {
  //   accessorKey: "updatedAt",
  //   header: ({ column }) => {
  //     return (
  //       <SortButton
  //         label="Updated at"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       />
  //     );
  //   },
  //   cell: ({ row }) => (
  //     <div className="text-left">
  //       {dayjsExt(row.getValue("createdAt")).fromNow()}
  //     </div>
  //   ),
  // },
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
      //eslint-disable-next-line react-hooks/rules-of-hooks
      const [open, setOpen] = React.useState<boolean>(false);
      //eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      //eslint-disable-next-line react-hooks/rules-of-hooks
      const { toast } = useToast();

      const passkey = row.original;
      const DELETE__ACTION = "Delete passkey";
      const UPDATE__ACTION = "Update passkey";

      const { mutateAsync: deletePasskeyMutation } =
        api.passkey.delete.useMutation({
          onSuccess: () => {
            toast({
              variant: "default",
              title: "🎉 Successfully deleted the passkey",
              description: " Provide description more on it.",
            });
            router.refresh();
          },
          onError: () => {
            toast({
              variant: "destructive",
              title: "Failed deletion",
              description: "Cannot delete the required passkey",
            });
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
                  <RiMoreLine aria-hidden className="h-4 w-4" />
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
              trigger={<></>}
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
