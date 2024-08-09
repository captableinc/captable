"use client";

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

import { Icon } from "@/components/ui/icon";
import { getRoleId } from "@/lib/rbac/access-control-utils";
import type { RouterOutputs } from "@/trpc/shared";
import { RiMore2Fill } from "@remixicon/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { pushModal } from "../modals";
import { DataTable } from "../ui/data-table/data-table";
import { DataTableBody } from "../ui/data-table/data-table-body";
import { SortButton } from "../ui/data-table/data-table-buttons";
import { DataTableContent } from "../ui/data-table/data-table-content";
import { DataTableHeader } from "../ui/data-table/data-table-header";
import { DataTablePagination } from "../ui/data-table/data-table-pagination";
import { MemberTableToolbar } from "./member-table-toolbar";

type Member = RouterOutputs["member"]["getMembers"]["data"];
type Roles = RouterOutputs["rbac"]["listRoles"]["rolesList"];

type MembersType = {
  members: Member;
  roles: Roles;
};

const humanizeStatus = (status: string) => {
  if (status === "PENDING") {
    return (
      <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
        Pending
      </span>
    );
  }
  if (status === "ACTIVE") {
    return (
      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
        Active
      </span>
    );
  }
  if (status === "INACTIVE") {
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
        <SortButton
          label="Name"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    accessorFn: (row) => row.user?.name,
    cell: ({ row }) => (
      <div className="flex">
        <Avatar className="rounded-full">
          <AvatarImage
            src={row.original?.user?.image ?? "/placeholders/user.svg"}
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
    cell: ({ row }) => <div>{humanizeStatus(row.original.status)}</div>,
    filterFn: (row, id, value: string[]) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { data } = useSession();
      const member = row.original;
      const removeMember = api.member.removeMember.useMutation();
      const revokeInvite = api.member.revokeInvite.useMutation();
      const revInvite = api.member.reInvite.useMutation();
      const toggleActivation = api.member.toggleActivation.useMutation({
        onSuccess: () => {
          router.refresh();
        },
      });

      const status = member.status;
      const memberId = member.id;
      const email = member?.user?.email;

      const isActive = status === "ACTIVE";
      const isPending = status === "PENDING";
      const deleteAction = isPending ? "Revoke invite" : "Remove member";
      const isAdminActionable = member.userId !== data?.user.id;

      const handleRevokeOrRemove = async () => {
        try {
          if (isPending && email) {
            await revokeInvite.mutateAsync({ email, memberId });
          } else {
            await removeMember.mutateAsync({ memberId });
          }

          router.refresh();
        } catch (error) {
          console.error("Error revoking invite or removing member", error);
        }
      };

      const handleToggleActivation = async () => {
        try {
          await toggleActivation.mutateAsync({
            status: isActive ? "INACTIVE" : "ACTIVE",
            memberId,
          });
        } catch (_error) {
          console.error("Error toggling activation");
        }
      };

      const handleReinvite = () => {
        revInvite.mutate({ memberId: member.id });
      };

      return (
        <DropdownMenu>
          <div className="items-end justify-end text-right">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <RiMore2Fill aria-hidden className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {isAdminActionable && status === "PENDING" && (
              <DropdownMenuItem onSelect={handleReinvite}>
                Re-invite member
              </DropdownMenuItem>
            )}

            {status === "ACTIVE" && (
              <DropdownMenuItem
                onClick={() => {
                  pushModal("TeamMemberModal", {
                    isEditMode: true,
                    memberId,
                    title: "Update team member",
                    subtitle: "Update team member's account information.",
                    member: {
                      name: member.user.name ?? "",
                      loginEmail: "",
                      title: member.title ?? "",
                      workEmail: member.workEmail ?? "",
                      roleId: getRoleId({
                        role: member.role,
                        customRoleId: member.customRoleId,
                      }),
                    },
                    // @ts-expect-error
                    roles: table.options.meta.roles,
                  });
                }}
              >
                Update member
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {!isPending && (
              <DropdownMenuItem
                onSelect={handleToggleActivation}
                disabled={!isAdminActionable}
                className="text-red-500"
              >
                {isActive ? "Deactivate member" : "Activate member"}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onSelect={handleRevokeOrRemove}
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

const MemberTable = ({ members, roles }: MembersType) => {
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
    meta: {
      roles,
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
