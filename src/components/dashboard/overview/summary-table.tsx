import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card } from "@/components/ui/card";
const formatter = new Intl.NumberFormat("en-US");

type SummaryRow = {
  id: string;
  name: string;
  authorized: number;
  diluted: number;
  ownership: number;
  raised: number;
};

type SummaryTableProps = {
  rows: SummaryRow[];
  totalRaised: number;
};

const SummaryTable = ({ rows, totalRaised }: SummaryTableProps) => {
  return (
    <Card className="mt-4">
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Share class</TableHead>
            <TableHead>Authorized shares</TableHead>
            <TableHead>Diluted shares</TableHead>
            <TableHead>Ownership</TableHead>
            <TableHead className="text-right">Amount raised</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((klass) => (
            <TableRow key={klass.id} className="border-none">
              <TableCell className="font-medium">{klass.name}</TableCell>
              <TableCell>{formatter.format(klass.authorized)}</TableCell>
              <TableCell>{formatter.format(klass.diluted)}</TableCell>
              <TableCell>{formatter.format(klass.ownership)} %</TableCell>
              <TableCell className="text-right">
                $ {formatter.format(klass.raised)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">
              $ {formatter.format(totalRaised)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  );
};

export default SummaryTable;
