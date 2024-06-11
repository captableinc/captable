import { Button } from "../button";
import { useDataTable } from "./data-table";

export function DataTablePagination() {
  const { table } = useDataTable();

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex-1 text-xs text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length}{" "}
        {table.getFilteredSelectedRowModel().rows.length === 1 ? "row" : "rows"}{" "}
        selected.
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="xs"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="xs"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
