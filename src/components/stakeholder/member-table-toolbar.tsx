import { Input } from "../ui/input";
import { DataTableFacetedFilter } from "../ui/data-table/data-table-faceted-filter";
import { Button } from "../ui/button";
import { DataTableViewOptions } from "../ui/data-table/data-table-view-options";
import { accessValues, statusValues } from "./data";
import { RiCloseLine } from "@remixicon/react";
import { useDataTable } from "../ui/data-table/data-table";

export function MemberTableToolbar() {
  const { table } = useDataTable();
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="w-64"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statusValues}
          />
        )}
        {table.getColumn("access") && (
          <DataTableFacetedFilter
            column={table.getColumn("access")}
            title="Access"
            options={accessValues}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <RiCloseLine aria-hidden className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions />
    </div>
  );
}
