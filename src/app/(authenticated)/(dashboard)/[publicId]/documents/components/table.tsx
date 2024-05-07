"use client";

import { dayjsExt } from "@/common/dayjs";
import FileIcon from "@/components/common/file-icon";
import { Card } from "@/components/ui/card";
import { getPresignedGetUrl } from "@/server/file-uploads";
import { RiMoreLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import DocumentShareModal from "@/components/documents/share/document-share-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type RouterOutputs } from "@/trpc/shared";

type DocumentType = RouterOutputs["document"]["getAll"];

type DocumentTableProps = {
  documents: DocumentType;
  companyPublicId: string;
};

const DocumentsTable = ({ documents, companyPublicId }: DocumentTableProps) => {
  const router = useRouter();
  const openFileOnTab = async (key: string) => {
    const fileUrl = await getPresignedGetUrl(key);
    window.open(fileUrl.url, "_blank");
  };

  const [openShareModal, setOpenShareModal] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null,
  );

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
                  <div className="mr-3">
                    <FileIcon type={document.bucket.mimeType} />
                  </div>
                  <span className="flex">{document.name}</span>
                </TableCell>
                <TableCell>{document?.uploader?.user?.name}</TableCell>
                <TableCell suppressHydrationWarning>
                  {dayjsExt().to(document.createdAt)}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <RiMoreLine className="cursor-pointer text-muted-foreground hover:text-primary/80" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        {/* <DropdownMenuItem
                          onClick={() => {
                            if (document) {
                              setSelectedDocumentId(document.id);
                            }
                            setOpenShareModal(true);
                          }}
                        >
                          Share document
                        </DropdownMenuItem> */}

                        {document.bucket.mimeType === "application/pdf" && (
                          <DropdownMenuItem
                            onClick={() => {
                              console.log(
                                "TODO - Show recipient popup and redirect to template page.",
                              );
                            }}
                          >
                            eSign
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={async () => {
                            await openFileOnTab(document.bucket.key);
                          }}
                        >
                          Download
                        </DropdownMenuItem>
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
        documentId={selectedDocumentId}
      />
    </>
  );
};

export default DocumentsTable;
