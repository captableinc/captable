import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card } from "@/components/ui/card";
import type { ShareClassMutationType } from "@/trpc/routers/share-class/schema";
import { EditShareClassButton } from "./edit-share-class-button";
const formatter = new Intl.NumberFormat("en-US");

type ShareClassTableProps = {
  shareClasses: ShareClassMutationType[];
};

const ShareClassTable = ({ shareClasses }: ShareClassTableProps) => {
  return (
    <Card>
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Authorized shares</TableHead>
            <TableHead>Board approval date</TableHead>
            <TableHead>Stockholder approval date</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {shareClasses.map((klass) => (
            <TableRow key={klass.id} className="border-none">
              <TableCell className="font-medium">{klass.name}</TableCell>
              <TableCell>{klass.classType}</TableCell>
              <TableCell>
                {formatter.format(klass.initialSharesAuthorized)}
              </TableCell>
              <TableCell>{`${new Date(
                klass.boardApprovalDate,
              ).toLocaleDateString("en-US")}`}</TableCell>
              <TableCell>{`${new Date(
                klass.stockholderApprovalDate,
              ).toLocaleDateString("en-US")}`}</TableCell>
              <TableCell>
                <EditShareClassButton
                  shareClass={{
                    ...klass,
                    initialSharesAuthorized: Number(
                      klass.initialSharesAuthorized,
                    ),
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ShareClassTable;
