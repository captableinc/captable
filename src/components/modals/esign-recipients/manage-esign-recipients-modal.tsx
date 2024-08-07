"use client";

import Loading from "@/components/common/loading";
import Modal from "@/components/common/push-modal";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  ManageEsignRecipientsForm,
  type TGetRecipients,
} from "./manage-esign-recipients-form";

type ManageEsignRecipientsModalProps = {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  templateId: string;
  serverPayload: TGetRecipients;
};

export const ManageEsignRecipientsModal = ({
  title,
  subtitle,
  templateId,
  serverPayload,
}: ManageEsignRecipientsModalProps) => {
  const router = useRouter();
  const hasRendered = useRef<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const { data: clientPayload, refetch: refetchRecipients } =
    api.template.getRecipients.useQuery(
      { templateId },
      { enabled: hasRendered.current },
    );

  useEffect(() => {
    hasRendered.current = true;
  }, []);

  const { mutateAsync: toggleOrderedDelivery } =
    api.template.toggleOrderedDelivery.useMutation({
      onSuccess: ({ success, message }) => {
        if (success) {
          toast.success(message);
          refetchRecipients();
          router.refresh();
        }
      },
    });

  const { mutateAsync: deleteRecipientMutation } =
    api.template.removeRecipient.useMutation({
      onSuccess: ({ success, message }) => {
        if (success) {
          toast.success(message);
          refetchRecipients();
          router.refresh();
        }
      },
    });

  const { mutateAsync: addRecipientMutation } =
    api.template.addRecipient.useMutation({
      onSuccess: ({ success, message }) => {
        if (success) {
          toast.success(message);
          refetchRecipients();
          router.refresh();
        }
      },
    });

  return (
    <Modal size="2xl" title={title} subtitle={subtitle}>
      <ManageEsignRecipientsForm
        type="update"
        payload={(clientPayload || serverPayload) as TGetRecipients}
        onSubmit={() => {}}
        onSave={async ({ name, email }) => {
          setLoading(true);
          await addRecipientMutation({
            recipient: {
              name,
              email,
            },
            templateId,
          });
          setLoading(false);
        }}
        onDelete={async ({ recipientId }) => {
          setLoading(true);
          await deleteRecipientMutation({ recipientId });
          setLoading(false);
        }}
        onToggleOrderedDelivery={async (newStatusValue) => {
          setLoading(true);
          await toggleOrderedDelivery({
            orderedDelivery: newStatusValue,
            templateId,
          });
          setLoading(false);
        }}
      />
      {loading && <Loading />}
    </Modal>
  );
};
