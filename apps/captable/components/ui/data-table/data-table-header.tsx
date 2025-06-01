import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";

import { useDataTable } from "@/components/ui/data-table/data-table";

export function DataTableHeader() {
  const { table } = useDataTable();
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
