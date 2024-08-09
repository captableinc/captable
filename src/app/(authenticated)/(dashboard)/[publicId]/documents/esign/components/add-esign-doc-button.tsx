"use client";

import { pushModal } from "@/components/modals";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { RiAddFill } from "@remixicon/react";
import type React from "react";

type AddEsignDocumentButtonProps = {
  title: string;
  subtitle: string | React.ReactNode;
  companyPublicId: string;
};

export const AddEsignDocumentButton = ({
  title,
  subtitle,
  companyPublicId,
}: AddEsignDocumentButtonProps) => {
  return (
    <Button
      onClick={() => {
        pushModal("AddEsignDocumentModal", {
          title,
          subtitle,
          companyPublicId,
        });
      }}
    >
      <Icon name="add-fill" className="mr-2 h-5 w-5" />
      Upload a document
    </Button>
  );
};
