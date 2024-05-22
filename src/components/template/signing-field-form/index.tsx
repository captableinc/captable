"use client";

import type { TemplateSigningFieldForm } from "@/providers/template-signing-field-provider";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

interface SigningFieldFormProps extends ComponentProps<"form"> {
  companyPublicId?: string;
  children: ReactNode;
  recipientId: string;
  templateId: string;
}

export function SigningFieldForm({
  companyPublicId,
  children,
  recipientId,
  templateId,
  ...rest
}: SigningFieldFormProps) {
  const { handleSubmit } = useFormContext<TemplateSigningFieldForm>();

  const router = useRouter();

  const { mutateAsync } = api.template.sign.useMutation({
    onSuccess() {
      toast.success("🎉 Great job, you are done signing this document.");

      if (companyPublicId) {
        router.push(`/${companyPublicId}/documents`);
      } else {
        router.push("/");
      }
    },
  });
  const onSubmit = async (values: TemplateSigningFieldForm) => {
    await mutateAsync({
      data: values.fieldValues,
      recipientId,
      templateId,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-4 px-2 py-10"
      {...rest}
    >
      {children}
    </form>
  );
}
