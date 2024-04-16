import { useDataTable } from "@/components/ui/data-table/data-table";
import { ResetButton } from "@/components/ui/data-table/data-table-buttons";
import { DataTableFacetedFilter } from "@/components/ui/data-table/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/ui/data-table/data-table-view-options";
import { Input } from "@/components/ui/input";
import { statusValues } from "./data";

export function UpdateTableToolbar() {
  const { table } = useDataTable();
  console.log({ table });
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col gap-2 sm:flex-1 sm:flex-row sm:items-center sm:gap-0 sm:space-x-2">
        <Input
          placeholder="Search by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-64"
        />
        <div className="space-x-2">
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={statusValues}
            />
          )}

          {isFiltered && (
            <ResetButton
              className="p-1"
              onClick={() => table.resetColumnFilters()}
            />
          )}
        </div>
      </div>
      <DataTableViewOptions />
    </div>
  );
}
