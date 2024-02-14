import { Card } from "@/components/ui/card";
import type { Document, User } from "@prisma/client";
import FileIcon from "@/components/shared/file-icon";
import { RiExpandRightLine } from "@remixicon/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DocumentType extends Document {
  uploadedBy: User | null;
}

type DocumentTableProps = {
  documents: DocumentType[];
};

const DocumentsTable = ({ documents }: DocumentTableProps) => {
  return (
    <Card>
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell className="relative flex">
                <FileIcon
                  type={document.type}
                  className="mr-2 inline-block h-5 w-5 text-muted-foreground"
                />
                <span className="inline-block">{document.name}</span>
              </TableCell>
              <TableCell>{document.type}</TableCell>
              <TableCell>{document.createdAt.toDateString()}</TableCell>
              <TableCell>{document.uploadedBy?.name}</TableCell>
              <TableCell>
                <RiExpandRightLine className="cursor-pointer text-muted-foreground" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default DocumentsTable;
