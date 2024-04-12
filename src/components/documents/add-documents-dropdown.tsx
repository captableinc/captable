"use client";

import DocumentUploadModal from "@/app/(authenticated)/(dashboard)/[publicId]/documents/modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiAddFill } from "@remixicon/react";
import { AddEsignModal } from "./add-esign-modal";

interface AddDocumentsDropdownProps {
  companyPublicId: string;
}

export function AddDocumentsDropdown({
  companyPublicId,
}: AddDocumentsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <RiAddFill className="mr-2 h-5 w-5" />
          Documents
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <DocumentUploadModal
            companyPublicId={companyPublicId}
            trigger={<Button variant="ghost">Upload Document</Button>}
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <AddEsignModal companyPublicId={companyPublicId} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
