"use client";

import { useToast } from "@/components/ui/use-toast";
import { type FieldTypes } from "@/prisma/enums";
import { api } from "@/trpc/react";
import { type TypeZodAddFieldMutationSchema } from "@/trpc/routers/template-field-router/schema";
import { type ReactNode } from "react";
import { useFormContext } from "react-hook-form";

type Field = TypeZodAddFieldMutationSchema["data"][number];

interface TemplateFieldFormProps {
  children: ReactNode;
  templatePublicId: string;
}

export type TemplateFieldForm = {
  fields: Field[];
  fieldType: FieldTypes | undefined;
};

export const TemplateFieldForm = ({
  children,
  templatePublicId,
}: TemplateFieldFormProps) => {
  const { toast } = useToast();

  const { handleSubmit } = useFormContext<TemplateFieldForm>();

  const { mutateAsync } = api.templateField.add.useMutation({
    onSuccess: () => {
      toast({
        variant: "default",
        title: "🎉 Successfully created",
        description: "Your template fields has been created.",
      });
    },
  });

  const onSubmit = async (values: TemplateFieldForm) => {
    await mutateAsync({ templatePublicId, data: values.fields });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
      {children}
    </form>
  );
};
