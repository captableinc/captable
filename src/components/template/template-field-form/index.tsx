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

  const { handleSubmit, setValue, reset } =
    useFormContext<TTemplateFieldForm>();

  const { mutateAsync } = api.templateField.add.useMutation({
    onSuccess: ({ message, success }) => {
      if (!success) return;
      toast({
        variant: "default",
        title: "🎉 Successfully sent for e-sign.",
        description: message,
      });
      reset();
      // fires use-effect in canvas-toolbar-component that closes the modal
      setValue("closeModal", true);
    },
  });

  const onSubmit = async (values: TTemplateFieldForm) => {
    console.log({ values });
    await mutateAsync({
      templatePublicId,
      data: values.fields,
      status: values.status,
      completedOn: values.completedOn,
      emailPayload: values.emailPayload,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
      {children}
    </form>
  );
};
