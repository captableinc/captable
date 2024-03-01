"use client";

import { useToast } from "@/components/ui/use-toast";
import { type TemplateSigningFieldForm } from "@/providers/template-signing-field-provider";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { type ComponentProps, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";

interface SigningFieldFormProps extends ComponentProps<"form"> {
  companyPublicId?: string;
  children: ReactNode;
  token: string;
}

export function SigningFieldForm({
  companyPublicId,
  children,
  token,
  ...rest
}: SigningFieldFormProps) {
  const { handleSubmit } = useFormContext<TemplateSigningFieldForm>();
  const { toast } = useToast();

  const router = useRouter();

  const { mutateAsync } = api.template.sign.useMutation({
    onSuccess() {
      toast({
        variant: "default",
        title: "🎉 Document signed Successfully",
        description: "",
      });

      if (companyPublicId) {
        router.push(`/${companyPublicId}/documents`);
      }
    },
  });
  const onSubmit = async (values: TemplateSigningFieldForm) => {
    await mutateAsync({ data: values.fieldValues, templatePublicId: token });
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
