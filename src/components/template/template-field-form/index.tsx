"use client";

import { useToast } from "@/components/ui/use-toast";
import { type TemplateFieldForm as TTemplateFieldForm } from "@/providers/template-field-provider";
import { api } from "@/trpc/react";
import { type ReactNode } from "react";
import { useFormContext } from "react-hook-form";

interface TemplateFieldFormProps {
  children: ReactNode;
  templatePublicId: string;
}

export const TemplateFieldForm = ({
  children,
  templatePublicId,
}: TemplateFieldFormProps) => {
  const { toast } = useToast();

  const { handleSubmit } = useFormContext<TTemplateFieldForm>();

  const { mutateAsync } = api.templateField.add.useMutation({
    onSuccess: async ({ message, success, title }) => {
      toast({
        variant: success ? "default" : "destructive",
        title: success ? `🎉 ${title}` : title,
        description: message,
      });
    },
  });

  const onSubmit = async (values: TTemplateFieldForm) => {
    await mutateAsync({
      templatePublicId,
      data: values.fields,
      status: values.status,
      optionalMessage: values.optionalMessage,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
      {children}
    </form>
  );
};
