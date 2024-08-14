"use client";

import { pushModal } from "@/components/modals";
import type {
  TShareClasses,
  TStakeholders,
} from "@/components/modals/issue-share-modal";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type React from "react";

type IssueShareButtonProps = {
  title: string;
  subtitle: string | React.ReactNode;
  stakeholders: TStakeholders;
  shareClasses: TShareClasses;
};

export const IssueShareButton = ({
  title,
  subtitle,
  stakeholders,
  shareClasses,
}: IssueShareButtonProps) => {
  return (
    <Button
      onClick={() => {
        pushModal("IssueShareModal", {
          shouldClientFetch: false,
          title,
          subtitle,
          stakeholders,
          shareClasses,
        });
      }}
    >
      <Icon name="add-fill" className="mr-2 h-5 w-5" />
      Create a share
    </Button>
  );
};
