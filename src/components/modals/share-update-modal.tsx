"use client";

import ShareModal, {
  type ExtendedUpdateRecipientType,
} from "@/components/common/share-modal";
import { env } from "@/env";
import type { ShareRecipientType } from "@/schema/contacts";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ShareUpdateModalProps = {
  update: {
    id: string;
    publicId: string;
  };
};

export const ShareUpdateModal = ({ update }: ShareUpdateModalProps) => {
  const router = useRouter();
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;

  const { data: recipients, refetch: refetchRecipients } =
    api.update.getRecipients.useQuery({
      updateId: update.id,
    });

  const { data: contacts } = api.common.getContacts.useQuery();

  const { mutateAsync: shareUpdateMutation } = api.update.share.useMutation({
    onSuccess: ({ success }) => {
      if (success) {
        toast.success("Update successfully shared.");
        refetchRecipients();
        router.refresh();
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutateAsync: unShareUpdateMutation } = api.update.unShare.useMutation(
    {
      onSuccess: () => {
        toast.success("Successfully removed access to update.");
        refetchRecipients();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );

  return (
    <ShareModal
      recipientsPayload={{
        type: "update",
        recipients: (recipients as ExtendedUpdateRecipientType[]) ?? [],
      }}
      contacts={contacts || []}
      baseLink={`${baseUrl}/updates/${update.publicId}`}
      title={"Share investor updates"}
      subtitle="Share important updates with fellow members/stakeholders"
      onShare={async ({ selectedContacts, others }) => {
        await shareUpdateMutation({
          updateId: update.id,
          selectedContacts: selectedContacts as ShareRecipientType[],
          others: others as ShareRecipientType[],
        });
      }}
      removeAccess={async ({ recipientId }) => {
        await unShareUpdateMutation({
          updateId: update.id,
          recipientId,
        });
      }}
    />
  );
};
