"use client";

import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
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
import { OptionTableToolbar } from "./option-table-toolbar";

type Option = RouterOutputs["securities"]["getOptions"]["data"];

type OptionsType = {
  options: Option;
};

const columnHelper = createColumnHelper<Option[number]>();

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
        <Avatar className="rounded-full">
          <AvatarImage src={"/placeholders/user.svg"} />
        </Avatar>
        <div className=" ml-2 pt-2">
          <p>{row.getValue()}</p>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor("quantity", {
    header: "Quantity",
    cell: (row) => <div className="text-left">{row.getValue()}</div>,
  }),
  columnHelper.accessor("grantId", {
    header: "GrantId",
    cell: (row) => <div className="text-left">{row.getValue()}</div>,
  }),
  columnHelper.accessor("exercisePrice", {
    header: "Exercise Price",
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
    enableHiding: false,
    enableSorting: false,
    header: "Documents",
    cell: ({ row }) => {
      const openFileOnTab = async (key: string) => {
        const fileUrl = await getPresignedGetUrl(key);
        window.open(fileUrl.url, "_blank");
      };

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
            {row?.original?.documents?.map((doc) => (
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
      const router = useRouter();
      const option = row.original;

      const deleteOptionMutation = api.securities.deleteOption.useMutation({
        onSuccess: () => {
          toast.success("Successfully deleted stock option for stakeholder");
          router.refresh();
        },
        onError: () => {
          toast.error("Stock option for stakeholder could not be deleted");
        },
      });

      const deleteAction = "Delete Option";

      const handleDeleteOption = async () => {
        await deleteOptionMutation.mutateAsync({ optionId: option.id });
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
              onSelect={handleDeleteOption}
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

const OptionTable = ({ options }: OptionsType) => {
  const table = useDataTable({
    data: options ?? [],
    columns: columns,
  });

  return (
    <div className="w-full p-6">
      <DataTable table={table}>
        <OptionTableToolbar />
        <DataTableContent>
          <DataTableHeader />
          <DataTableBody />
        </DataTableContent>
        <DataTablePagination />
      </DataTable>
    </div>
  );
};

export default OptionTable;
