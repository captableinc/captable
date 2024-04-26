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
    onSuccess: () => {
      toast({
        variant: "default",
        title: "🎉 Successfully created",
        description: "Your template fields has been created.",
      });
    },
  });

  const onSubmit = async (values: TTemplateFieldForm) => {
    await mutateAsync({
      templatePublicId,
      data: values.fields,
      status: values.status,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
      {children}
    </form>
  );
};
