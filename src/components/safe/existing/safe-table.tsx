"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFacetedUniqueValues,
  getFacetedRowModel,
} from "@tanstack/react-table";

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
import { useRouter } from "next/navigation";
import { type RouterOutputs } from "@/trpc/shared";
import { RiFileDownloadLine, RiMoreLine } from "@remixicon/react";
import { DataTableHeader } from "@/components/ui/data-table/data-table-header";
import { DataTableBody } from "@/components/ui/data-table/data-table-body";
import { DataTableContent } from "@/components/ui/data-table/data-table-content";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { SortButton } from "@/components/ui/data-table/data-table-buttons";
import { getPresignedGetUrl } from "@/server/file-uploads";
import { useToast } from "@/components/ui/use-toast";
import { SafeTableToolbar } from "./safe-table-toolbar";

type Safe = RouterOutputs["safe"]["getSafes"]["data"];

type SafesType = {
  safes: Safe;
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

export const columns: ColumnDef<Safe[number]>[] = [
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
        <Avatar className="h-10 w-10 rounded-full">
          <AvatarImage src={"/avatar.svg"} />
        </Avatar>
        <div className=" ml-2 pt-2">
          <p>{row?.original?.stakeholder?.name}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "capital",
    header: ({ column }) => {
      return (
        <SortButton
          label="Capital"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("capital")}</div>
    ),
  },
  {
    accessorKey: "valuationCap",
    header: ({ column }) => {
      return (
        <SortButton
          label="ValuationCap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("valuationCap")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <SortButton
          label="Type"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => <div className="text-left">{row.getValue("type")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <SortButton
          label="Status"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "discountRate",
    header: ({ column }) => {
      return (
        <SortButton
          label="Discount Rate"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("discountRate")}</div>
    ),
  },
  {
    accessorKey: "issueDate",
    header: ({ column }) => {
      return (
        <SortButton
          label="Issue Date"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="text-left">
        {new Date().toLocaleDateString(row.getValue("issueDate"))}
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
              documents.map((doc: Document) => (
                <>
                  <DropdownMenuItem
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
                      ({doc.uploader.user.name})
                    </p>
                  </DropdownMenuItem>
                </>
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
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const safe = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { toast } = useToast();

      const deleteSafeMutation = api.safe.deleteSafe.useMutation({
        onSuccess: () => {
          toast({
            variant: "default",
            title: "🎉 Successfully deleted",
            description: "SAFEs agreement deleted",
          });
          router.refresh();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Failed deletion",
            description: "SAFEs agreement could not be deleted",
          });
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
                  <RiMoreLine aria-hidden className="h-4 w-4" />
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
  },
];

const SafeTable = ({ safes }: SafesType) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: safes ?? [],
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

export default SafeTable;
