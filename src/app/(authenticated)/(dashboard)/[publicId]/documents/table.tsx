import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  uploadedBy: User;
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
              <TableCell className="flex">
                {/* <FileIcon type={document.type} className="w-5 h-5 mr-2 inline-block text-muted-foreground" />
                <Input type="text" className="border-none p-0 inline-block" value={document.name} /> */}
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FileIcon
                      type={document.type}
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="text"
                    name="documentName"
                    value={document.name}
                    className="block w-full border-transparent bg-transparent py-1.5 pl-10 text-primary !outline-none hover:border-b focus:border-transparent focus:ring-0 focus-visible:ring-0 sm:text-sm sm:leading-6"
                    placeholder="you@example.com"
                  />
                </div>
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
