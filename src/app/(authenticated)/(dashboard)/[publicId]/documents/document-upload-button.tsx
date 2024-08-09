"use client";

import { pushModal } from "@/components/modals";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import React from "react";

type DocumentUploadButtonProps = {
  companyPublicId: string;
  buttonDisplayName: string;
};

export const DocumentUploadButton = ({
  companyPublicId,
  buttonDisplayName,
}: DocumentUploadButtonProps) => {
  return (
    <Button
      onClick={() => {
        pushModal("DocumentUploadModal", {
          companyPublicId,
        });
      }}
    >
      <Icon name="add-fill" size="md" className="mr-2" />
      {buttonDisplayName}
    </Button>
  );
};
