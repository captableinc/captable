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
import MemberModal from "@/components/stakeholder/member-modal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type RouterOutputs } from "@/trpc/shared";
import { MemberTableToolbar } from "./member-table-toolbar";
import { RiExpandUpDownLine, RiMoreLine } from "@remixicon/react";
import { DataTableHeader } from "../ui/data-table/data-table-header";
import { DataTableBody } from "../ui/data-table/data-table-body";
import { DataTableContent } from "../ui/data-table/data-table-content";
import { DataTable } from "../ui/data-table/data-table";
import { DataTablePagination } from "../ui/data-table/data-table-pagination";

type Member = RouterOutputs["stakeholder"]["getMembers"]["data"];

type MembersType = {
  members: Member;
};

const humanizeStatus = (status: string, active: boolean) => {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
        Pending
      </span>
    );
  }
  if (status === "accepted" && active) {
    return (
      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
        Active
      </span>
    );
  }
  if (status === "accepted" && !active) {
    return (
      <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
        Inactive
      </span>
    );
  }
  return "Unknown";
};

export const columns: ColumnDef<Member[number]>[] = [
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
    id: "name",
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <RiExpandUpDownLine aria-hidden className="ml-2 h-4 w-4" />
        </div>
      );
    },
    accessorFn: (row) => row.user?.name,
    cell: ({ row }) => (
      <div className="flex">
        <Avatar className="">
          <AvatarImage
            src={
              row.original?.user?.image ??
              `https://api.dicebear.com/7.x/initials/svg?seed=${
                row.original?.user?.name ?? row.original?.user?.email
              }`
            }
          />
        </Avatar>

        <div className=" ml-2">
          <p>{row.original?.user?.name}</p>
          <p>{row.original?.user?.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <RiExpandUpDownLine aria-hidden className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-left capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <RiExpandUpDownLine aria-hidden className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div>{humanizeStatus(row.original.status, row.original.active)}</div>
    ),
    filterFn: (row, id, value: string[]) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "access",
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Access
          <RiExpandUpDownLine aria-hidden className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("access")}</div>
    ),
    filterFn: (row, id, value: string[]) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { data } = useSession();
      const member = row.original;
      const removeMember = api.stakeholder.removeMember.useMutation();
      const revokeInvite = api.stakeholder.revokeInvite.useMutation();
      const revInvite = api.stakeholder.reInvite.useMutation();
      const deactivateUser = api.stakeholder.deactivateUser.useMutation({
        onSuccess: () => {
          router.refresh();
        },
      });

      const isAdmin = data?.user?.access === "admin";
      const status = member.status;
      const membershipId = member.id;
      const email = member.user?.email;
      const deleteAction =
        status === "pending" ? "Revoke invite" : "Remove member";

      const isAdminActionable = isAdmin && member.userId !== data?.user.id;

      const userStatus = member.active;

      const handleDeactivateStakeholder = async () => {
        try {
          await removeMember.mutateAsync({ membershipId });
          if (status === "pending" && email) {
            await revokeInvite.mutateAsync({ email, membershipId });
          }

          router.refresh();
        } catch (error) {}
      };

      const handleDeactivate = async () => {
        try {
          await deactivateUser.mutateAsync({
            membershipId,
            status: !userStatus,
          });
        } catch (error) {}
      };

      const handleReinvite = () => {
        revInvite.mutate({ membershipId: member.id });
      };

      return (
        <DropdownMenu>
          <div className="items-end justify-end text-right">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <RiMoreLine aria-hidden className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {isAdminActionable && status === "pending" && (
              <DropdownMenuItem onSelect={handleReinvite}>
                ReInvite
              </DropdownMenuItem>
            )}

            {isAdmin && status === "accepted" && (
              <MemberModal
                isEditMode
                membershipId={member.id}
                title="Update stakeholder"
                subtitle="Update stakeholder's account information."
                member={{
                  name: member.user?.name ?? "",
                  email: email ?? "",
                  title: member.title ?? "",
                  access: member.access ?? "stakeholder",
                }}
              >
                <span className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  Update
                </span>
              </MemberModal>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleDeactivate}
              disabled={!isAdminActionable}
              className="text-red-500"
            >
              {userStatus ? "Deactivate" : "Activate User"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={handleDeactivateStakeholder}
              disabled={!isAdminActionable}
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

const MemberTable = ({ members }: MembersType) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: members,
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
        <MemberTableToolbar />
        <DataTableContent>
          <DataTableHeader />
          <DataTableBody />
        </DataTableContent>
        <DataTablePagination />
      </DataTable>
    </div>
  );
};

export default MemberTable;
