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
import type {
  CapTablePool,
  CapTableRow,
  CapTableShareClass,
} from "@/server/captable";

const formatter = new Intl.NumberFormat("en-US");

const getRelationshipLabel = (relationship: string) => {
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
    default:
      return "Other";
  }
};

const quantity = (value: number) => (value > 0 ? formatter.format(value) : "—");

type CaptableMatrixProps = {
  shareClasses: CapTableShareClass[];
  rows: CapTableRow[];
  pool: CapTablePool;
  totals: {
    sharesTotal: number;
    optionsTotal: number;
    fullyDilutedTotal: number;
  };
};

const CaptableMatrix = ({
  shareClasses,
  rows,
  pool,
  totals,
}: CaptableMatrixProps) => {
  const showPoolRow = pool.available > 0;
  const columnCount = shareClasses.length + 5;

  return (
    <Card className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Stakeholder</TableHead>
            <TableHead>Relationship</TableHead>
            {shareClasses.map((shareClass) => (
              <TableHead key={shareClass.id} className="text-right">
                {shareClass.name}
              </TableHead>
            ))}
            <TableHead className="text-right">Options</TableHead>
            <TableHead className="text-right">Fully diluted</TableHead>
            <TableHead className="text-right">Ownership</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && !showPoolRow && (
            <TableRow className="border-none">
              <TableCell
                colSpan={columnCount}
                className="text-center text-muted-foreground"
              >
                No equity issued yet
              </TableCell>
            </TableRow>
          )}

          {rows.map((row) => (
            <TableRow key={row.stakeholderId} className="border-none">
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {getRelationshipLabel(row.relationship)}
              </TableCell>
              {shareClasses.map((shareClass) => (
                <TableCell key={shareClass.id} className="text-right">
                  {quantity(row.sharesByClassId[shareClass.id] ?? 0)}
                </TableCell>
              ))}
              <TableCell className="text-right">
                {quantity(row.optionsTotal)}
              </TableCell>
              <TableCell className="text-right">
                {formatter.format(row.fullyDilutedTotal)}
              </TableCell>
              <TableCell className="text-right">{row.fdPercent} %</TableCell>
            </TableRow>
          ))}

          {showPoolRow && (
            <TableRow className="border-none">
              <TableCell className="font-medium">Equity plan pool</TableCell>
              <TableCell className="text-muted-foreground">
                Available for grants
              </TableCell>
              {shareClasses.map((shareClass) => (
                <TableCell key={shareClass.id} className="text-right">
                  —
                </TableCell>
              ))}
              <TableCell className="text-right">—</TableCell>
              <TableCell className="text-right">
                {formatter.format(pool.available)}
              </TableCell>
              <TableCell className="text-right">{pool.fdPercent} %</TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            {shareClasses.map((shareClass) => (
              <TableCell key={shareClass.id} className="text-right">
                {quantity(shareClass.issued)}
              </TableCell>
            ))}
            <TableCell className="text-right">
              {quantity(totals.optionsTotal)}
            </TableCell>
            <TableCell className="text-right">
              {formatter.format(totals.fullyDilutedTotal)}
            </TableCell>
            <TableCell className="text-right">
              {totals.fullyDilutedTotal > 0 ? "100 %" : "—"}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  );
};

export default CaptableMatrix;
