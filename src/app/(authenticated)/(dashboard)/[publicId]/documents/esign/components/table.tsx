import { dayjsExt } from "@/common/dayjs";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type RouterOutputs } from "@/trpc/shared";
import Link from "next/link";

type DocumentsType = RouterOutputs["template"]["all"]["documents"];

type ESignTableProps = {
  documents: DocumentsType;
  companyPublicId: string;
};

export const ESignTable = ({ documents, companyPublicId }: ESignTableProps) => {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Signed Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell suppressHydrationWarning>
                {dayjsExt().to(item.createdAt)}
              </TableCell>

              <TableCell>
                {item.completedOn ? "Signed" : "Not Signed"}
              </TableCell>

              <TableCell>
                <Link
                  className={buttonVariants()}
                  href={`/${companyPublicId}/documents/esign/v/${item.publicId}`}
                >
                  View
                </Link>

                {item.status === "DRAFT" && (
                  <Link
                    className={buttonVariants()}
                    href={`/${companyPublicId}/documents/esign/${item.publicId}`}
                  >
                    Edit
                  </Link>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
