"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TemplateCancelButtonProps {
  publicId: string;
  templateId: string;
}

export const TemplateCancelButton = ({
  templateId,
  publicId,
}: TemplateCancelButtonProps) => {
  const router = useRouter();

  const { mutateAsync: handleCancelTemplate } = api.template.cancel.useMutation(
    {
      onSuccess(response) {
        if (response.success) {
          router.refresh();
          toast.success(response.message);
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
  return (
    <Button onClick={() => handleCancelTemplate({ templateId, publicId })}>
      Cancel
    </Button>
  );
};
