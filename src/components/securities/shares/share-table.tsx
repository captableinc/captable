"use client";

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
import { SortButton } from "@/components/ui/data-table/data-table-buttons";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { formatCurrency, formatNumber } from "@/lib/utils";
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

const humanizeShareStatus = (type: string) => {
  switch (type) {
    case "ACTIVE":
      return "Active";
    case "DRAFT":
      return "Draft";
    case "SIGNED":
      return "Signed";
    case "PENDING":
      return "Pending";
    default:
      return "";
  }
};

const StatusColorProvider = (type: string) => {
  switch (type) {
    case "ACTIVE":
      return "bg-green-50 text-green-600 ring-green-600/20";
    case "DRAFT":
      return "bg-yellow-50 text-yellow-600 ring-yellow-600/20";
    case "SIGNED":
      return "bg-blue-50 text-blue-600 ring-blue-600/20";
    case "PENDING":
      return "bg-gray-50 text-gray-600 ring-gray-600/20";
    default:
      return "";
  }
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
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <SortButton
        label="Status"
        onClick={() => column.toggleSorting(column?.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => {
      const status = row.original?.status;
      return (
        <span
          className={`inline-flex items-center rounded-md ${StatusColorProvider(
            status,
          )} px-2 py-1 text-xs text-center font-medium ring-1 ring-inset `}
        >
          {humanizeShareStatus(status)}
        </span>
      );
    },
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
      <div className="text-center">{row.original.shareClass.classType}</div>
    ),
  },
  {
    id: "quantity",
    accessorKey: "quantity",
    header: ({ column }) => (
      <div className="flex justify-end">
        <SortButton
          label="Quantity"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      </div>
    ),
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      return (
        <div className="text-center">
          {quantity ? formatNumber(quantity) : null}
        </div>
      );
    },
  },
  {
    id: "pricePerShare",
    accessorKey: "pricePerShare",
    header: ({ column }) => (
      <div className="flex justify-end">
        <SortButton
          label="Unit price"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      </div>
    ),
    cell: ({ row }) => {
      const price = row.original.pricePerShare;
      return (
        <div className="text-center">
          {price ? formatCurrency(price, "USD") : null}
        </div>
      );
    },
  },
  {
    id: "issueDate",
    accessorKey: "issueDate",
    header: ({ column }) => (
      <SortButton
        label="Issued"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {dayjsExt(row.original.issueDate).format("DD/MM/YYYY")}
      </div>
    ),
  },
  {
    id: "boardApprovalDate",
    accessorKey: "boardApprovalDate",
    header: ({ column }) => (
      <div className="flex justify-end">
        <SortButton
          label="Board Approved"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {dayjsExt(row.original.boardApprovalDate).format("DD/MM/YYYY")}
      </div>
    ),
  },
  {
    id: "Documents",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <SortButton
          label="Documents"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
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
                <Icon
                  name="file-download-line"
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
  },
  {
    id: "actions",
    enableHiding: false,
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
