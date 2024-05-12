import { flexRender } from '@tanstack/react-table'
import { TableBody, TableCell, TableRow } from '../table'
import { useDataTable } from './data-table'

export function DataTableBody() {
  const { table } = useDataTable()

  const columnLength = table.getAllColumns().length

  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columnLength} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}
