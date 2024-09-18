"use client";

import { createColumnHelper } from "@tanstack/react-table";
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

import { api } from "@/trpc/react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableBody } from "@/components/ui/data-table/data-table-body";
import { DataTableContent } from "@/components/ui/data-table/data-table-content";
import { DataTableHeader } from "@/components/ui/data-table/data-table-header";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { useDataTable } from "@/hooks/use-data-table";
import { getPresignedGetUrl } from "@/server/file-uploads";
import type { RouterOutputs } from "@/trpc/shared";
import { RiFileDownloadLine, RiMore2Fill } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SafeTableToolbar } from "./safe-table-toolbar";

type Safe = RouterOutputs["safe"]["getSafes"]["data"];

type SafesType = {
  safes: Safe;
};

const columnHelper = createColumnHelper<Safe[number]>();

export const columns = [
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
        <Avatar className="h-10 w-10 rounded-full">
          <AvatarImage src={"/avatar.svg"} />
        </Avatar>
        <div className=" ml-2 pt-2">
          <p>{row.getValue()}</p>
        </div>
      </div>
    ),
  }),

  columnHelper.accessor("capital", {
    header: "Capital",
    cell: (row) => <div className="text-left">{row.getValue()}</div>,
  }),

  columnHelper.accessor("valuationCap", {
    header: "Valuation Cap",
    cell: (row) => <div className="text-left">{row.getValue()}</div>,
  }),

  columnHelper.accessor("type", {
    header: "Type",
    cell: (row) => <div className="text-left">{row.getValue()}</div>,
  }),

  columnHelper.accessor("status", {
    header: "Status",
    cell: (row) => <div className="text-left">{row.getValue()}</div>,
  }),

  columnHelper.accessor("discountRate", {
    header: "Discount Rate",
    cell: (row) => <div className="text-left">{row.getValue()}</div>,
  }),
  columnHelper.accessor("issueDate", {
    header: "Issue Date",
    cell: (row) => (
      <div className="text-left" suppressHydrationWarning>
        {new Date(row.getValue()).toLocaleDateString()}
      </div>
    ),
  }),
  columnHelper.display({
    id: "Documents",
    enableSorting: false,
    enableHiding: false,
    header: "Documents",
    cell: ({ row }) => {
      const openFileOnTab = async (key: string) => {
        const fileUrl = await getPresignedGetUrl(key);
        window.open(fileUrl.url, "_blank");
      };

      const documents = row?.original?.documents;

      return (
        <DropdownMenu>
          <div className="items-end justify-end text-right">
            <DropdownMenuTrigger className="outline-none" asChild>
              <Button variant={"outline"} className="h-7 w-12 px-2">
                View
              </Button>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Documents</DropdownMenuLabel>
            {documents?.length ? (
              documents.map((doc) => (
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
                    {doc?.uploader?.user.name}
                  </p>
                </DropdownMenuItem>
              ))
            ) : (
              <p className="mx-2 rounded-full py-2 text-xs text-slate-500">
                No documents found.
              </p>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const router = useRouter();
      const safe = row.original;

      const deleteSafeMutation = api.safe.deleteSafe.useMutation({
        onSuccess: () => {
          toast.success("🎉 SAFE agreement successfully deleted");
          router.refresh();
        },
        onError: () => {
          toast.error("SAFEs agreement could not be deleted");
        },
      });

      const deleteAction = "Delete SAFE";

      const handleDeleteSafe = async () => {
        await deleteSafeMutation.mutateAsync({ safeId: safe.id });
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

            <DropdownMenuItem
              onSelect={handleDeleteSafe}
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

export const SafeTable = ({ safes }: SafesType) => {
  const table = useDataTable({
    data: safes ?? [],
    columns: columns,
  });

  return (
    <div className="w-full p-6">
      <DataTable table={table}>
        <SafeTableToolbar />
        <DataTableContent>
          <DataTableHeader />
          <DataTableBody />
        </DataTableContent>
        <DataTablePagination />
      </DataTable>
    </div>
  );
};
