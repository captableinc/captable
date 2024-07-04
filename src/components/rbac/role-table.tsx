"use client";

import { RBAC } from "@/lib/rbac";
import { api } from "@/trpc/react";
import type { TypeZodCreateRoleMutationSchema } from "@/trpc/routers/rbac-router/schema";
import type { RouterOutputs } from "@/trpc/shared";
import { RiMore2Fill } from "@remixicon/react";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { pushModal } from "../modals";
import { defaultInputPermissionInputs } from "../modals/role-create-update-modal";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { DataTable } from "../ui/data-table/data-table";
import { DataTableBody } from "../ui/data-table/data-table-body";
import { SortButton } from "../ui/data-table/data-table-buttons";
import { DataTableContent } from "../ui/data-table/data-table-content";
import { DataTableHeader } from "../ui/data-table/data-table-header";
import { DataTablePagination } from "../ui/data-table/data-table-pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Allow } from "./allow";

type Role = RouterOutputs["rbac"]["listRoles"]["rolesList"][number];

interface RoleTableProps {
  roles: Role[];
}

export const columns: ColumnDef<Role>[] = [
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
    accessorKey: "name",
    cell: ({ row }) => {
      return <div>{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "type",
    header: () => <div className="text-right">Type</div>,
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div className="text-right">
          <Badge variant={type === "default" ? "secondary" : "success"}>
            {type}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const role = row.original;
      const router = useRouter();
      const { mutateAsync: deleteRole } = api.rbac.deleteRole.useMutation({
        onSuccess: () => {
          router.refresh();
        },
      });

      const handleDeleteRole = async () => {
        await deleteRole({ roleId: row.original.id });
      };

      const handleUpdateRole = () => {
        if (role.type === "custom") {
          const permissions = { ...defaultInputPermissionInputs };

          for (const permission of role.permissions) {
            if (permissions?.[permission.subject]) {
              for (const action of permission.actions) {
                if (permissions?.[permission.subject]?.[action] !== undefined) {
                  // @ts-expect-error
                  permissions[permission.subject][action] = true;
                }
              }
            }
          }

          pushModal("RoleCreateUpdate", {
            type: "edit",
            title: `edit role ${role.name}`,
            defaultValues: { name: role.name, permissions },
            roleId: role.id,
          });
        }
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <RiMore2Fill className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Allow action="update" subject="roles">
              <DropdownMenuItem onSelect={handleUpdateRole}>
                Edit
              </DropdownMenuItem>
            </Allow>
            <Allow action="delete" subject="roles">
              <DropdownMenuItem
                onSelect={handleDeleteRole}
                disabled={row.original.type === "default"}
              >
                Delete
              </DropdownMenuItem>
            </Allow>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function RoleTable({ roles }: RoleTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: roles,
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
        <DataTableContent>
          <DataTableHeader />
          <DataTableBody />
        </DataTableContent>
        <DataTablePagination />
      </DataTable>
    </div>
  );
}
