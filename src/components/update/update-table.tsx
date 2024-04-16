"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast, useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { RiMoreLine } from "@remixicon/react";
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
import { ClipboardIcon } from "../shared/icons";

import { dayjsExt } from "@/common/dayjs";
import { privateToggleWarning, publicToggleWarning } from "@/lib/constants";
import { type Recipient } from "@/lib/types";
import {
  BadgeColorProvider,
  getShareableUpdateLink,
  onCopyClipboard,
  StatusActionProvider,
} from "@/lib/utils";
import { UpdateStatusEnum } from "@/prisma-enums";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ToggleStatusAlertDialog } from "./toggle-status-alert";
import { UpdateTableToolbar } from "./update-table-toolbar";

type Update = RouterOutputs["update"]["get"]["data"];

type UpdateType = {
  updates: Update;
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
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <SortButton
          label="Title"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => <div className="text-left">{row.getValue("title")}</div>,
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
    cell: ({ row }) => {
      const status = row?.original?.status;
      const companyPublicId = row?.original?.company?.publicId;
      const publicId = row?.original?.publicId;
      const isPublic = status === UpdateStatusEnum.PUBLIC;
      const isDisabled = !isPublic;

      const onCopyLink = async () => {
        if (isPublic) {
          await onCopyClipboard(
            getShareableUpdateLink(companyPublicId, publicId),
          );
          toast({
            title: "Copied to clipboard",
            description: "🎉 Enjoy sharing the links.",
          });
        }
      };
      return (
        <div className="flex items-center space-x-4 text-left">
          <Badge variant={BadgeColorProvider(row.getValue("status"))}>
            {row.getValue("status")}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {row?.original?.status === "PUBLIC" ? (
                  <Button
                    size={"sm"}
                    disabled={isDisabled}
                    variant={"outline"}
                    onClick={onCopyLink}
                    className="flex justify-between px-2"
                  >
                    Copy link
                    <ClipboardIcon className="h-3 w-3" />
                  </Button>
                ) : null}
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to copy</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    id: "Recipients",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <SortButton
          label="Recipients"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const recipients: Recipient[] = row?.original?.recipients;
      return (
        <DropdownMenu>
          <div className="items-start justify-start text-left">
            <DropdownMenuTrigger
              disabled={!recipients?.length}
              className="outline-none"
              asChild
            >
              <Button
                className="flex items-start space-x-2 border-none outline-none"
                size={"sm"}
                variant={"outline"}
              >
                <Avatar>
                  <AvatarImage
                    src="https://media.istockphoto.com/id/1300512215/photo/headshot-portrait-of-smiling-ethnic-businessman-in-office.webp?b=1&s=170667a&w=0&k=20&c=TXCiY7rYEvIBd6ibj2bE-VbJu0rRGy3MlHwxt2LHt9w="
                    className="object-fit mx-3 h-7 w-7 cursor-pointer rounded-full text-muted-foreground hover:text-primary/80"
                  />
                </Avatar>
                <p className="pt-1">{recipients?.length} investor(s)</p>
              </Button>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Recipients</DropdownMenuLabel>
            {recipients?.map((recp: Recipient) => (
              <>
                <DropdownMenuItem className="flex items-start space-x-2 hover:cursor-pointer">
                  <Avatar>
                    <AvatarImage
                      src="/avatar.svg"
                      className="mx-3 h-7 w-7 cursor-pointer rounded-full text-muted-foreground hover:text-primary/80"
                    />
                  </Avatar>
                  <p>{recp.stakeholder.name}</p>
                </DropdownMenuItem>
              </>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "updated",
    header: ({ column }) => {
      return (
        <SortButton
          label="Updated"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const updatedAt = row?.original?.updatedAt;
      return (
        <div className="text-left">
          {updatedAt && dayjsExt().to(new Date(updatedAt).toLocaleString())}
        </div>
      );
    },
  },
  {
    accessorKey: "sent",
    header: ({ column }) => {
      return (
        <SortButton
          label="Sent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const sentAt = row?.original?.sentAt;
      return (
        <div className="text-left">
          {sentAt && dayjsExt().to(new Date(sentAt).toLocaleString())}
        </div>
      );
    },
  },
  {
    id: "Actions",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <SortButton
          label="Actions"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { toast } = useToast();

      const updateId = row?.original?.id;
      const publicId = row?.original?.publicId;
      const status = row?.original?.status;
      const isTogglingAllowed = status && status !== UpdateStatusEnum.DRAFT;
      const isDisabled = !!row?.original?.sentAt || !!row?.original?.recipients;

      const deleteAction = "Delete update";
      const editAction = "Edit update";

      //eslint-disable-next-line @typescript-eslint/no-floating-promises
      const statusMutation = api.update.toggleStatus.useMutation({
        onSuccess: async ({ success, message, updatedStatus }) => {
          if (!success || !message || !updatedStatus) return;
          toast({
            variant: "default",
            title: "🎉 Success",
            description: message,
          });
          if (
            updatedStatus === UpdateStatusEnum.PUBLIC ||
            updatedStatus === UpdateStatusEnum.PRIVATE
          ) {
            router.refresh();
          }
        },
        onError: async () => {
          toast({
            variant: "destructive",
            title: "Toggle failed.",
            description: "Uh oh! Something went wrong.",
          });
        },
      });

      const deleteUpdateMutation = api.update.delete.useMutation({
        onSuccess: () => {
          toast({
            variant: "default",
            title: "🎉 Successfully deleted",
            description: "Stock option for stakeholder deleted",
          });
          router.refresh();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Failed deletion",
            description: "Stock option for stakeholder could not be deleted",
          });
        },
      });

      const handleDeleteUpdate = async () => {
        await deleteUpdateMutation.mutateAsync({ updateId, publicId });
      };

      async function makeStatusPublic(publicId: string) {
        await statusMutation.mutateAsync({
          currentStatus: UpdateStatusEnum.PRIVATE,
          desireStatus: UpdateStatusEnum.PUBLIC,
          publicId,
        });
      }

      async function makeStatusPrivate(publicId: string) {
        await statusMutation.mutateAsync({
          currentStatus: UpdateStatusEnum.PUBLIC,
          desireStatus: UpdateStatusEnum.PRIVATE,
          publicId,
        });
      }

      const onContinue = async () => {
        if (publicId) {
          const currentStatus = status;
          currentStatus === UpdateStatusEnum.PUBLIC
            ? await makeStatusPrivate(publicId)
            : await makeStatusPublic(publicId);
        }
      };

      const updatePageLink = getShareableUpdateLink(
        row?.original?.company?.publicId,
        row?.original?.publicId,
      );

      return (
        <DropdownMenu>
          <div className="items-end justify-start text-center">
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
              onSelect={handleDeleteUpdate}
              className="text-red-500"
            >
              {deleteAction}
            </DropdownMenuItem>
            <DropdownMenuItem disabled={isDisabled}>
              <Link href={updatePageLink}>{editAction}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={updatePageLink}>View Details</Link>
            </DropdownMenuItem>
            <ToggleStatusAlertDialog
              status={status}
              privateToggleWarning={privateToggleWarning}
              publicToggleWarning={publicToggleWarning}
              onContinue={onContinue}
              trigger={
                <p
                  className={`px-2 text-[14px] hover:cursor-pointer hover:bg-slate-50 ${isTogglingAllowed ? null : "invisible"}`}
                >
                  {StatusActionProvider(status)}
                </p>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const UpdateTable = ({ updates }: UpdateType) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: updates ?? [],
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
