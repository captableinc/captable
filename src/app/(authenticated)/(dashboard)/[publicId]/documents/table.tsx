"use client";

import { useState } from "react";
import { dayjsExt } from "@/common/dayjs";
import { Card } from "@/components/ui/card";
import FileIcon from "@/components/shared/file-icon";
import { RiFileDownloadLine, RiMoreLine } from "@remixicon/react";
import { getPresignedGetUrl } from "@/server/file-uploads";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DocumentShareModal from "@/components/document/share/document-share-modal";
import { type RouterOutputs } from "@/trpc/shared";

type DocumentType = RouterOutputs["document"]["getAll"];

type DocumentTableProps = {
  documents: DocumentType;
};

const DocumentsTable = ({ documents }: DocumentTableProps) => {
  const openFileOnTab = async (key: string) => {
    const fileUrl = await getPresignedGetUrl(key);
    window.open(fileUrl.url, "_blank");
  };

  const [openShareModal, setOpenShareModal] = useState(false);

  return (
    <>
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
                  <FileIcon type={document.bucket.mimeType} />
                  <span className="flex">{document.name}</span>
                </TableCell>
                <TableCell>{document.uploader.user.name}</TableCell>
                <TableCell suppressHydrationWarning>
                  {dayjsExt().to(document.createdAt)}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={async () => {
                        await openFileOnTab(document.bucket.key);
                      }}
                      className="cursor-pointer text-muted-foreground hover:text-primary/80"
                    >
                      <RiFileDownloadLine className="cursor-pointer text-muted-foreground hover:text-primary/80" />
                    </button>

                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <RiMoreLine className="cursor-pointer text-muted-foreground hover:text-primary/80" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => setOpenShareModal(true)}
                        >
                          Share document
                        </DropdownMenuItem>
                        <DropdownMenuItem>E-sign document</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <DocumentShareModal
        title="Share document"
        subtitle="Create a link to share this document."
        open={openShareModal}
        setOpen={setOpenShareModal}
      />
    </>
  );
};

export default DocumentsTable;
