import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { dayjsExt } from "@/common/dayjs";
import { Card } from "@/components/ui/card";
import type { CapTableConvertible } from "@/server/captable";

const formatter = new Intl.NumberFormat("en-US");

const getStatusClasses = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-50 text-green-600 ring-green-600/20";
    case "DRAFT":
      return "bg-yellow-50 text-yellow-600 ring-yellow-600/20";
    case "PENDING":
      return "bg-gray-50 text-gray-600 ring-gray-600/20";
    default:
      return "bg-gray-50 text-gray-600 ring-gray-600/20";
  }
};

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center rounded-md ${getStatusClasses(
      status,
    )} px-2 py-1 text-center text-xs font-medium ring-1 ring-inset`}
  >
    {status.charAt(0) + status.slice(1).toLowerCase()}
  </span>
);

type ConvertiblesCardProps = {
  safes: CapTableConvertible[];
  notes: CapTableConvertible[];
  totalCapital: number;
};

const ConvertiblesCard = ({
  safes,
  notes,
  totalCapital,
}: ConvertiblesCardProps) => {
  const instruments = [
    ...safes.map((safe) => ({ ...safe, kind: "SAFE" })),
    ...notes.map((note) => ({ ...note, kind: "Convertible note" })),
  ];

  if (instruments.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <h4 className="font-medium">Convertible instruments</h4>
      <p className="text-sm text-muted-foreground">
        SAFEs and convertible notes that have not converted into equity yet
      </p>

      <Card className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Holder</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issue date</TableHead>
              <TableHead className="text-right">Capital</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instruments.map((instrument) => (
              <TableRow key={instrument.id} className="border-none">
                <TableCell className="font-medium">{instrument.kind}</TableCell>
                <TableCell>{instrument.publicId}</TableCell>
                <TableCell>{instrument.stakeholderName}</TableCell>
                <TableCell>
                  <StatusBadge status={instrument.status} />
                </TableCell>
                <TableCell>
                  {dayjsExt(instrument.issueDate).format("ll")}
                </TableCell>
                <TableCell className="text-right">
                  $ {formatter.format(instrument.capital)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Total</TableCell>
              <TableCell className="text-right">
                $ {formatter.format(totalCapital)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
    </div>
  );
};

export default ConvertiblesCard;
