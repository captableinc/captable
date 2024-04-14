import { flexRender } from "@tanstack/react-table";
import { TableHead, TableHeader, TableRow } from "../table";

import { useDataTable } from "./data-table";

export function DataTableHeader() {
  const { table } = useDataTable();
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                style={{ backgroundColor: "#f2f2f2", color: "#535353" }}
              >
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
