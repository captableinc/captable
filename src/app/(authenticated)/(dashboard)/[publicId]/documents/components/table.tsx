"use client";

import { dayjsExt } from "@/common/dayjs";
import FileIcon from "@/components/common/file-icon";
import { Card } from "@/components/ui/card";
import { getPresignedGetUrl } from "@/server/file-uploads";
import { RiMore2Fill } from "@remixicon/react";
import { useRouter } from "next/navigation";

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
import type { RouterOutputs } from "@/trpc/shared";

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
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell
                  className="flex cursor-pointer items-center hover:underline"
                  onClick={() => {
                    router.push(
                      `/${companyPublicId}/documents/${document.bucket.id}`,
                    );
                  }}
                >
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
                        <RiMore2Fill className="cursor-pointer text-muted-foreground hover:text-primary/80" />
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
                          onClick={() => {
                            router.push(
                              `/${companyPublicId}/documents/${document.bucket.id}`,
                            );
                          }}
                        >
                          View
                        </DropdownMenuItem>
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
    </>
  );
};

export default DocumentsTable;
