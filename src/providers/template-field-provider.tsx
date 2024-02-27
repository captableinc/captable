"use client";

import { Form } from "@/components/ui/form";
import { type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { type TypeZodAddFieldMutationSchema } from "@/trpc/routers/template-field-router/schema";
import { type FieldTypes } from "@/prisma-enums";

type Field = TypeZodAddFieldMutationSchema["data"][number];

interface TemplateFieldProviderProps {
  children: ReactNode;
  fields?: Field[];
}

export type TemplateFieldForm = {
  fields: Field[];
  fieldType: FieldTypes | undefined;
};

export const TemplateFieldProvider = ({
  children,
  fields,
}: TemplateFieldProviderProps) => {
  const form = useForm<TemplateFieldForm>({
    defaultValues: {
      fields: fields ?? [],
      fieldType: undefined,
    },
  });

  return <Form {...form}>{children}</Form>;
};
