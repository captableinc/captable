"use client";

import { dayjsExt } from "@/common/dayjs";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableBody } from "@/components/ui/data-table/data-table-body";
import { DataTableContent } from "@/components/ui/data-table/data-table-content";
import { DataTableHeader } from "@/components/ui/data-table/data-table-header";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useDataTable } from "@/hooks/use-data-table";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";
import { RiMore2Fill } from "@remixicon/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import * as React from "react";
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

const columnHelper = createColumnHelper<Passkey[number]>();

const columns = [
  columnHelper.accessor("name", {
    header: "Device Name",
    cell: (row) => <div className="text-left">{row.getValue()}</div>,
  }),
  columnHelper.accessor("credentialDeviceType", {
    header: "Device type",
    cell: (row) => (
      <div className="text-left">{humanizeDeviceType(row.getValue())}</div>
    ),
  }),
  columnHelper.accessor("credentialBackedUp", {
    header: "Backup",
    cell: (row) => (
      <div className="text-left">
        <Badge
          variant={row.getValue() ? "success" : "warning"}
          className="h-7 align-middle"
        >
          {row.getValue() ? "Done" : "Pending"}
        </Badge>
      </div>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "Created",
    cell: (row) => (
      <div className="text-left" suppressHydrationWarning>
        {dayjsExt(row.getValue()).fromNow()}
      </div>
    ),
  }),
  columnHelper.accessor("lastUsedAt", {
    header: "Used",
    cell: (row) => (
      <div className="text-left" suppressHydrationWarning>
        {row.getValue() ? dayjsExt(row.getValue()).fromNow() : "Not yet"}
      </div>
    ),
  }),
  columnHelper.display({
    id: "actions",
    enableHiding: false,
    enableSorting: false,
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
                  <RiMore2Fill aria-hidden className="h-4 w-4" />
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
  }),
];

const PasskeyTable = ({ passkey }: PasskeyType) => {
  const table = useDataTable({
    data: passkey ?? [],
    columns: columns,
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
