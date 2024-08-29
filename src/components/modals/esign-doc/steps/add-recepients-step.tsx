import { uploadFile } from "@/common/uploads";
import Loading from "@/components/common/loading";
import { popModal } from "@/components/modals";
import {
  ManageEsignRecipientsForm,
  type TFormSchema,
} from "@/components/modals/esign-recipients/manage-esign-recipients-form";
import { Button } from "@/components/ui/button";
import {
  StepperModalContent,
  StepperModalFooter,
  StepperPrev,
  StepperStep,
} from "@/components/ui/stepper";
import { TAG } from "@/lib/tags";
import { useEsignValues } from "@/providers/esign-form-provider";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AddRecipientStepProps {
  companyPublicId: string;
}

export function AddRecipientStep({ companyPublicId }: AddRecipientStepProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { value } = useEsignValues();
  const { mutateAsync: handleBucketUpload } = api.bucket.create.useMutation();
  const { mutateAsync: handleTemplateCreation } =
    api.template.create.useMutation();

  const onSubmit = async (data: TFormSchema) => {
    setLoading(true);
    const document = value?.document?.[0];
    if (!document) {
      throw new Error("no document found to upload");
    }
    const { key, mimeType, name, size } = await uploadFile(document, {
      identifier: companyPublicId,
      keyPrefix: "unsigned-esign-doc",
    });

    const { id: bucketId, name: templateName } = await handleBucketUpload({
      key,
      mimeType,
      name,
      size,
      tags: [TAG.ESIGN],
    });

    const recipients = data.recipients.map((x) => ({
      name: x.name,
      email: x.email,
    }));

    const template = await handleTemplateCreation({
      bucketId,
      name: templateName,
      recipients,
      orderedDelivery: data.orderedDelivery,
    });

    popModal("AddEsignDocumentModal");

    router.push(`/${companyPublicId}/documents/esign/${template.publicId}`);
  };

  return (
    <>
      <StepperStep className="flex flex-col gap-y-6" title="Add recipients">
        <StepperModalContent>
          <ManageEsignRecipientsForm type="create" onSubmit={onSubmit} />
        </StepperModalContent>
        <StepperModalFooter>
          <StepperPrev>Back</StepperPrev>
          <Button type="submit" form="esign-recipients-form">
            Save & Continue
          </Button>
        </StepperModalFooter>
      </StepperStep>
      {loading && <Loading />}
    </>
  );
}
