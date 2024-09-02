"use client";

import { pushModal } from "@/components/modals";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableBody } from "@/components/ui/data-table/data-table-body";
import { DataTableContent } from "@/components/ui/data-table/data-table-content";
import { DataTableHeader } from "@/components/ui/data-table/data-table-header";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import {
  useFilterQueryParams,
  usePaginatedQueryParams,
  usePaginatedTable,
  useSortQueryParams,
} from "@/hooks/use-paginated-data-table";
import type { TGetManyStakeholderRes } from "@/server/api/client-handlers/stakeholder";
import { useManyStakeholder } from "@/server/api/client-hooks/stakeholder";
import { ManyStakeholderSortParams } from "@/server/api/schema/stakeholder";
import { RiGroup2Fill, RiMore2Fill } from "@remixicon/react";
import { createColumnHelper } from "@tanstack/react-table";

import { parseAsString } from "nuqs";
import EmptyState from "../common/empty-state";
import { Allow } from "../rbac/allow";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import StakeholderDropdown from "./stakeholder-dropdown";
import { StakeholderTableToolbar } from "./stakeholder-table-toolbar";

type StakeholderTableType = {
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
  // columnHelper.display({
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableHiding: false,
  //   enableSorting: false,
  // }),
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
  const { columnFilters, onColumnFiltersChange, state } = useFilterQueryParams({
    name: parseAsString,
  });

  const { data } = useManyStakeholder({
    searchParams: {
      limit,
      page,
      sort,
      ...(state.name && { name: state.name }),
    },
    urlParams: { companyId },
  });

  const table = usePaginatedTable({
    pageCount: data?.meta.pageCount ?? -1,
    columns,
    data: data.data,
    state: {
      pagination,
      sorting,
      columnFilters,
    },
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
  });

  if (data?.data?.length === 0 && data.meta.totalCount === 0) {
    return (
      <EmptyState
        icon={<RiGroup2Fill />}
        title="You do not have any stakeholders!"
        subtitle="Please click the button below to add or import stakeholders."
      >
        <Allow action="create" subject="stakeholder">
          <StakeholderDropdown />
        </Allow>
      </EmptyState>
    );
  }

  return (
    <Card className="mx-auto mt-3 w-[28rem] sm:w-[38rem] md:w-full">
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
    </Card>
  );
};

export default StakeholderTable;
