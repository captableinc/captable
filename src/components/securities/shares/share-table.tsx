"use client";

import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import * as React from "react";

import { dayjsExt } from "@/common/dayjs";
import { Checkbox } from "@/components/ui/checkbox";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableBody } from "@/components/ui/data-table/data-table-body";
import { DataTableContent } from "@/components/ui/data-table/data-table-content";
import { DataTableHeader } from "@/components/ui/data-table/data-table-header";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import type { RouterOutputs } from "@/trpc/shared";

import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/use-data-table";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import type { SecuritiesStatusEnum } from "@/prisma/enums";
import { getPresignedGetUrl } from "@/server/file-uploads";
import { api } from "@/trpc/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { RiFileDownloadLine, RiMore2Fill } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShareTableToolbar } from "./share-table-toolbar";

type Share = RouterOutputs["securities"]["getShares"]["data"];

type SharesType = {
  shares: Share;
};

const statusHumanizeMap: Record<SecuritiesStatusEnum, string> = {
  ACTIVE: "Active",
  DRAFT: "Draft",
  SIGNED: "Signed",
  PENDING: "Pending",
};

const statusColorMap: Record<SecuritiesStatusEnum, string> = {
  ACTIVE: "bg-green-50 text-green-600 ring-green-600/20",
  DRAFT: "bg-yellow-50 text-yellow-600 ring-yellow-600/20",
  SIGNED: "bg-blue-50 text-blue-600 ring-blue-600/20",
  PENDING: "bg-gray-50 text-gray-600 ring-gray-600/20",
};

const columnHelper = createColumnHelper<Share[number]>();

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
  columnHelper.accessor("stakeholder.name", {
    header: "Stakeholder",
    cell: (row) => (
      <div className="flex">
        <Avatar className="rounded-full">
          <AvatarImage src={"/placeholders/user.svg"} />
        </Avatar>
        <div className="ml-2 pt-2">
          <p>{row.getValue()}</p>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (row) => {
      const status = row.getValue();
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-md",
            statusColorMap[status],
            "px-2 py-1 text-xs text-center font-medium ring-1 ring-inset",
          )}
        >
          {statusHumanizeMap[status]}
        </span>
      );
    },
  }),
  columnHelper.accessor("shareClass.classType", {
    header: "Share class",
    cell: (row) => <div className="text-center">{row.getValue()}</div>,
  }),
  columnHelper.accessor("quantity", {
    header: "Quantity",
    cell: (row) => {
      const quantity = row.getValue();
      return (
        <div className="text-center">
          {quantity ? formatNumber(quantity) : null}
        </div>
      );
    },
  }),
  columnHelper.accessor("pricePerShare", {
    header: "Unit price",
    cell: (row) => {
      const price = row.getValue();
      return (
        <div className="text-center">
          {price ? formatCurrency(price, "USD") : null}
        </div>
      );
    },
  }),
  columnHelper.accessor("issueDate", {
    header: "Issued",
    cell: (row) => (
      <div className="text-center" suppressHydrationWarning>
        {dayjsExt(row.getValue()).format("DD/MM/YYYY")}
      </div>
    ),
  }),
  columnHelper.accessor("boardApprovalDate", {
    header: "Board Approved",
    cell: (row) => (
      <div className="text-center" suppressHydrationWarning>
        {dayjsExt(row.getValue()).format("DD/MM/YYYY")}
      </div>
    ),
  }),
  columnHelper.display({
    id: "Documents",
    enableHiding: false,
    enableSorting: false,
    header: "Board Approved",
    cell: ({ row }) => {
      const documents = row?.original?.documents;

      const openFileOnTab = async (key: string) => {
        const fileUrl = await getPresignedGetUrl(key);
        window.open(fileUrl.url, "_blank");
      };

      return (
        <DropdownMenu>
          <div className="items-end justify-end text-center">
            <DropdownMenuTrigger className="outline-none" asChild>
              <Button variant={"outline"} className="h-7 w-12 px-2">
                View
              </Button>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Documents</DropdownMenuLabel>
            {documents?.map((doc) => (
              <DropdownMenuItem
                key={doc.id}
                className="hover:cursor-pointer"
                onClick={async () => {
                  await openFileOnTab(doc.bucket.key);
                }}
              >
                <RiFileDownloadLine
                  type={doc.bucket.mimeType}
                  className="mx-3 cursor-pointer text-muted-foreground hover:text-primary/80"
                />
                {doc.name.slice(0, 12)}
                <p className="mx-4 rounded-full bg-slate-100 text-xs text-slate-500">
                  {doc?.uploader?.user?.name}
                </p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),

  columnHelper.display({
    id: "actions",
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const share = row.original;

      const deleteShareMutation = api.securities.deleteShare.useMutation({
        onSuccess: () => {
          toast.success("🎉 Successfully deleted the stakeholder");
          router.refresh();
        },
        onError: () => {
          toast.error("Failed deleting the share");
        },
      });

      const updateAction = "Update Share";
      const deleteAction = "Delete Share";

      const handleDeleteShare = async () => {
        await deleteShareMutation.mutateAsync({ shareId: share.id });
      };

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
            <DropdownMenuItem>{updateAction}</DropdownMenuItem>
            <DropdownMenuItem
              onSelect={handleDeleteShare}
              className="text-red-500"
            >
              {deleteAction}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

const ShareTable = ({ shares }: SharesType) => {
  const table = useDataTable({
    data: shares ?? [],
    columns: columns,
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
