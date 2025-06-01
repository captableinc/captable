"use client";

import { pushModal } from "@/components/modals";
import { Allow } from "@/components/rbac/allow";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";
import { ADMIN_PERMISSION } from "@captable/rbac";
import type { TPermission } from "@captable/rbac/types";
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
import { toast } from "sonner";

type Role = RouterOutputs["rbac"]["listRoles"]["rolesList"][number];

export default function RoleTable({
  roles: rawRoles,
}: {
  roles: RouterOutputs["rbac"]["listRoles"]["rolesList"];
}) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const deleteRole = api.rbac.deleteRole.useMutation({
    onSuccess: () => {
      toast.success("Role deleted successfully");
      router.refresh();
    },
    onError: (error) => {
      toast.error(`Failed to delete role: ${error.message}`);
    },
  });

  const columns: ColumnDef<Role>[] = [
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
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <SortButton
            label="Name"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <span>{row.getValue("name")}</span>
          {row.original.type === "default" && (
            <Badge variant="secondary">Default</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => {
        const permissions = row.original.permissions || [];
        return (
          <div className="flex flex-wrap gap-1">
            {permissions
              .slice(0, 3)
              .map((permission: TPermission, index: number) => (
                <Badge
                  key={`${permission.subject}-${index}`}
                  variant="outline"
                  className="text-xs"
                >
                  {permission.subject}: {permission.actions.join(", ")}
                </Badge>
              ))}
            {permissions.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{permissions.length - 3} more
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const role = row.original;

        const handleDeleteRole = async () => {
          if (role.id) {
            await deleteRole.mutateAsync({ roleId: role.id });
          }
        };

        const editRole = () => {
          pushModal("RoleCreateUpdate", {
            isEditMode: true,
            roleData: {
              id: role.id,
              name: role.name,
              permissions:
                role.permissions?.reduce(
                  (acc, perm: TPermission) => {
                    acc[perm.subject] = perm.actions;
                    return acc;
                  },
                  {} as Record<string, string[]>,
                ) || {},
            },
          });
        };

        const viewRole = () => {
          pushModal("RoleCreateUpdate", {
            isEditMode: false,
            roleData: {
              id: role.id,
              name: role.name,
              permissions:
                role.permissions?.reduce(
                  (acc, perm: TPermission) => {
                    acc[perm.subject] = perm.actions;
                    return acc;
                  },
                  {} as Record<string, string[]>,
                ) || {},
            },
          });
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
                <DropdownMenuItem
                  disabled={row.original.type === "default"}
                  onSelect={editRole}
                >
                  Edit
                </DropdownMenuItem>
              </Allow>
              <Allow action="read" subject="roles">
                <DropdownMenuItem onSelect={viewRole}>View</DropdownMenuItem>
              </Allow>
              <Allow action="delete" subject="roles">
                <DropdownMenuItem
                  onSelect={handleDeleteRole}
                  disabled={row.original.type === "default"}
                  className="text-red-600"
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

  const table = useReactTable({
    data: rawRoles,
    columns,
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
    <div className="w-full">
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
