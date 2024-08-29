import { useTable } from "@/components/ui/data-table/data-table";
import { ResetButton } from "@/components/ui/data-table/data-table-buttons";
import { DataTableViewOptions } from "@/components/ui/data-table/data-table-view-options";
import { DebouncedInput } from "../ui/debounced-input";

export const StakeholderTableToolbar = () => {
  const { table } = useTable();
  const isFiltered = table.getState().columnFilters.length > 0;

  const value = table.getColumn("name")?.getFilterValue() as string;
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col gap-2 sm:flex-1 sm:flex-row sm:items-center sm:gap-0 sm:space-x-2">
        <DebouncedInput
          placeholder="Search by name..."
          value={value}
          onChange={(value) => table.getColumn("name")?.setFilterValue(value)}
          className="h-8 w-64"
        />
        <div className="space-x-2">
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
};
