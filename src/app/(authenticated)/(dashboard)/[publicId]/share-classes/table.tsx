import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ShareClassModal from "./modal";
import Tldr from "@/components/shared/tldr";
import { Card } from "@/components/ui/card";
import type { ShareClass } from "@prisma/client";
const formatter = new Intl.NumberFormat("en-US");
import { RiEqualizer2Line } from "@remixicon/react";

type ShareClassTableProps = {
  shareClasses: ShareClass[];
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
            <TableHead></TableHead>
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
                <ShareClassModal
                  type="update"
                  title="Update share class"
                  shareClass={klass}
                  subtitle={
                    <Tldr
                      message="Equity plans are used to distribute ownership of your company using stock options, RSUs, and other instruments among employees and stakeholders."
                      cta={{
                        label: "Learn more",
                        // TODO - this link should be updated to the correct URL
                        href: "https://opencap.co/help",
                      }}
                    />
                  }
                  trigger={
                    <RiEqualizer2Line className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700" />
                  }
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
