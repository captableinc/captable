"use client";

import ShareModal, {
  type ExtendedDataRoomRecipientType,
} from "@/components/common/share-modal";
import { env } from "@/env";
import type { ShareContactType, ShareRecipientType } from "@/schema/contacts";
import { api } from "@/trpc/react";
import type { DataRoom } from "@prisma/client";
import { toast } from "sonner";

type ShareDataRoomModalProps = {
  dataRoom: DataRoom;
  contacts: ShareContactType[];
};

export const ShareDataRoomModal = ({
  dataRoom,
  contacts,
}: ShareDataRoomModalProps) => {
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;

  const { data, refetch: refetchRecipients } =
    api.dataRoom.getDataRoom.useQuery({
      dataRoomPublicId: dataRoom.publicId,
      include: { recipients: true },
    });

  const recipients = data?.recipients;

  const { mutateAsync: shareDataRoomMutation } = api.dataRoom.share.useMutation(
    {
      onSuccess: () => {
        refetchRecipients();
        toast.success("Data room successfully shared.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );

  const { mutateAsync: unShareDataRoomMutation } =
    api.dataRoom.unShare.useMutation({
      onSuccess: () => {
        refetchRecipients();
        toast.success("Successfully removed access to data room.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return (
    <ShareModal
      recipientsPayload={{
        type: "dataroom",
        recipients: (recipients as ExtendedDataRoomRecipientType[]) ?? [],
      }}
      contacts={contacts}
      baseLink={`${baseUrl}/data-rooms/${dataRoom.publicId}`}
      title={`Share data room - "${dataRoom.name}"`}
      subtitle="Share this data room with others."
      onShare={async ({ selectedContacts, others }) => {
        await shareDataRoomMutation({
          dataRoomId: dataRoom.id,
          selectedContacts: selectedContacts as ShareRecipientType[],
          others: others as ShareRecipientType[],
        });
      }}
      removeAccess={async ({ recipientId }) => {
        await unShareDataRoomMutation({
          dataRoomId: dataRoom.id,
          recipientId,
        });
      }}
    />
  );
};
