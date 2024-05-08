"use client";

import { useToast } from "@/components/ui/use-toast";
import { type TemplateFieldForm as TTemplateFieldForm } from "@/providers/template-field-provider";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { useFormContext } from "react-hook-form";

interface TemplateFieldFormProps {
  children: ReactNode;
  templatePublicId: string;
  companyPublicId: string;
}

export const TemplateFieldForm = ({
  children,
  templatePublicId,
  companyPublicId,
}: TemplateFieldFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const { handleSubmit, getValues } = useFormContext<TTemplateFieldForm>();
  const status = getValues("status");

  const { mutateAsync } = api.templateField.add.useMutation({
    onSuccess: async ({ message, success, title }) => {
      toast({
        variant: success ? "default" : "destructive",
        title: success ? `🎉 ${title}` : title,
        description: message,
      });

      if (status === "COMPLETE") {
        router.push(`/${companyPublicId}/documents`);
      }
    },
  });

  const onSubmit = async (values: TTemplateFieldForm) => {
    await mutateAsync({
      templatePublicId,
      data: values.fields,
      status: values.status,
      message: values.message,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
      {children}
    </form>
  );
};
