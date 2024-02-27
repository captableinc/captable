"use client";

import { Form } from "@/components/ui/form";
import { type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { type TypeZodAddFieldMutationSchema } from "@/trpc/routers/template-field-router/schema";
import { type FieldTypes } from "@/prisma-enums";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";

type Field = TypeZodAddFieldMutationSchema["data"][number];

interface TemplateFieldProviderProps {
  children: ReactNode;
  fields?: Field[];
  templatePublicId: string;
}

export type TemplateFieldForm = {
  fields: Field[];
  fieldType: FieldTypes | undefined;
};

export const TemplateFieldProvider = ({
  children,
  fields,
  templatePublicId,
}: TemplateFieldProviderProps) => {
  const { toast } = useToast();

  const form = useForm<TemplateFieldForm>({
    defaultValues: {
      fields: fields ?? [],
      fieldType: undefined,
    },
  });

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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col"
      >
        {children}
      </form>
    </Form>
  );
};
