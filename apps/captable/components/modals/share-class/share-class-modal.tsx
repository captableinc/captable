"use client";

import Modal from "@/components/common/push-modal";
import { api } from "@/trpc/react";
import type { ShareClassMutationType } from "@/trpc/routers/share-class/schema";
import ShareClassForm from "./share-class-form";

type ShareClassType = {
  type: "create" | "update";
  shouldClientFetch: boolean;
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  shareClass?: ShareClassMutationType;
  shareClasses?: ShareClassMutationType[];
};

export const ShareClassModal = ({
  type = "create",
  title,
  subtitle,
  shareClass,
  shareClasses = [] as ShareClassMutationType[],
}: ShareClassType) => {
  // const _shareClasses = api.shareClass.get.useQuery(undefined, {
  //   enabled: shouldClientFetch,
  // })?.data;

  const _shareClasses = api.shareClass.get.useQuery(undefined).data;
  const __shareClasses = shareClasses.length
    ? shareClasses
    : (_shareClasses as unknown as ShareClassMutationType[]);

  return (
    <Modal size="2xl" title={title} subtitle={subtitle}>
      <ShareClassForm
        type={type}
        shareClass={shareClass}
        shareClasses={__shareClasses}
      />
    </Modal>
  );
};
