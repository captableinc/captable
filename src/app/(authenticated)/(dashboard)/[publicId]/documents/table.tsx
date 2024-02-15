"use client";

import { dayjsExt } from "@/common/dayjs";
import { Card } from "@/components/ui/card";
import type { Document, User } from "@prisma/client";
import FileIcon from "@/components/shared/file-icon";
import { RiFileDownloadLine } from "@remixicon/react";
import { getPresignedGetUrl } from "@/server/file-uploads";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";

interface DocumentType extends Document {
  uploadedBy: User | null;
}

type DocumentTableProps = {
  documents: DocumentType[];
};

const DocumentsTable = ({ documents }: DocumentTableProps) => {
  const openFileOnTab = async (key: string) => {
    const fileUrl = await getPresignedGetUrl(key);
    window.open(fileUrl.url, "_blank");
  };

  return (
    <Card>
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {/* <TableHead>Type</TableHead> */}
            <TableHead>Owner</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell className="flex items-center ">
                <FileIcon type={document.type} />
                <span className="flex">{document.name}</span>
              </TableCell>
              <TableCell>{document.uploadedBy?.name}</TableCell>
              <TableCell>{dayjsExt().to(document.createdAt)}</TableCell>
              <TableCell>
                <button
                  onClick={async () => {
                    await openFileOnTab(document.key);
                  }}
                  className="cursor-pointer text-muted-foreground hover:text-primary/80"
                >
                  <RiFileDownloadLine className="cursor-pointer text-muted-foreground hover:text-primary/80" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default DocumentsTable;
