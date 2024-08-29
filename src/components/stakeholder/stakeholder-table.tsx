"use client";

import { pushModal } from "@/components/modals";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableBody } from "@/components/ui/data-table/data-table-body";
import { DataTableContent } from "@/components/ui/data-table/data-table-content";
import { DataTableHeader } from "@/components/ui/data-table/data-table-header";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import {
  usePaginatedQueryParams,
  usePaginatedTable,
  useSortQueryParams,
} from "@/hooks/use-paginated-data-table";
import type { TGetManyStakeholderRes } from "@/server/api/client-handlers/stakeholder";
import { useManyStakeholder } from "@/server/api/client-hooks/stakeholder";
import { ManyStakeholderSortParams } from "@/server/api/schema/stakeholder";
import type { RouterOutputs } from "@/trpc/shared";
import { RiMore2Fill } from "@remixicon/react";
import { createColumnHelper } from "@tanstack/react-table";

import { Allow } from "../rbac/allow";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { StakeholderTableToolbar } from "./stakeholder-table-toolbar";

type Stakeholder = RouterOutputs["stakeholder"]["getStakeholders"];

type StakeholderTableType = {
  stakeholders: Stakeholder;
  companyId: string;
};

const getStakeholderType = (type: string) => {
  switch (type) {
    case "INDIVIDUAL":
      return "Individual";
    case "INSTITUTION":
      return "Institution";
  }
};

const getCurrentRelationship = (relationship: string) => {
  switch (relationship) {
    case "ADVISOR":
      return "Advisor";
    case "BOARD_MEMBER":
      return "Board member";
    case "CONSULTANT":
      return "Consultant";
    case "EMPLOYEE":
      return "Employee";
    case "EX_ADVISOR":
      return "Ex Advisor";
    case "EX_CONSULTANT":
      return "Ex Consultant";
    case "EX_EMPLOYEE":
      return "Ex Employee";
    case "EXECUTIVE":
      return "Executive";
    case "FOUNDER":
      return "Founder";
    case "INVESTOR":
      return "Investor";
    case "NON_US_EMPLOYEE":
      return "Non us employee";
    case "OFFICER":
      return "Officer";
    case "OTHER":
      return "Other";
  }
};

const columnHelper =
  createColumnHelper<TGetManyStakeholderRes["data"][number]>();

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
    enableHiding: false,
    enableSorting: false,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (row) => <div className="font-medium">{row.getValue()}</div>,
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("institutionName", {
    header: "Institute name",
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
  columnHelper.accessor("stakeholderType", {
    header: "Type",
    cell: (info) => {
      const type = info.getValue();
      return (
        <Badge variant={type === "INDIVIDUAL" ? "info" : "success"}>
          {getStakeholderType(type)}
        </Badge>
      );
    },
    enableSorting: false,
  }),
  columnHelper.accessor("currentRelationship", {
    header: "Association",
    cell: (info) => getCurrentRelationship(info.getValue()),
    enableSorting: false,
  }),

  columnHelper.display({
    id: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const singleStakeholder = row.original;
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

            <Allow action="update" subject="stakeholder">
              <DropdownMenuItem
                onSelect={() => {
                  pushModal("UpdateSingleStakeholderModal", {
                    title: "Update stakeholder",
                    subtitle: "Edit the stakeholder details",
                    stakeholder: singleStakeholder,
                  });
                }}
              >
                Edit
              </DropdownMenuItem>
            </Allow>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

const StakeholderTable = ({ companyId }: StakeholderTableType) => {
  const { limit, page, onPaginationChange, pagination } =
    usePaginatedQueryParams();

  const { onSortingChange, sorting, sort } = useSortQueryParams(
    ManyStakeholderSortParams,
    "createdAt.desc",
  );

  const { data } = useManyStakeholder({
    searchParams: { limit, page, sort },
    urlParams: { companyId },
  });

  const table = usePaginatedTable({
    pageCount: data?.meta.pageCount ?? -1,
    columns,
    data: data?.data ?? [],
    state: {
      pagination,
      sorting,
    },
    onPaginationChange,
    onSortingChange,
    manualSorting: true,
  });
  return (
    <div className="w-full p-6">
      <DataTable table={table}>
        <StakeholderTableToolbar />
        <DataTableContent>
          <DataTableHeader />
          <DataTableBody />
        </DataTableContent>
        <DataTablePagination />
      </DataTable>
    </div>
  );
};

export default StakeholderTable;
