import { dayjsExt } from "@/common/dayjs";
import FileIcon from "@/components/common/file-icon";
import { buttonVariants } from "@/components/ui/button";

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
            <TableCell className="flex items-center">
              <div className="mr-3">
                <FileIcon type={"application/pdf"} />
              </div>
              <span className="flex">{item.name}</span>
            </TableCell>

            <TableCell>{item.status}</TableCell>
            <TableCell suppressHydrationWarning>
              {dayjsExt().to(item.createdAt)}
            </TableCell>

            <TableCell>{item.completedOn ? "Signed" : "Not Signed"}</TableCell>

            <TableCell className="flex gap-x-2">
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
  );
};
