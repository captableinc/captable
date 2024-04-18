"use client";

import { Form } from "@/components/ui/form";
import { ALL_RECIPIENT_VALUE } from "@/constants/esign";
import { FieldTypes } from "@/prisma/enums";
import { type TypeZodAddFieldMutationSchema } from "@/trpc/routers/template-field-router/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Field = TypeZodAddFieldMutationSchema["data"][number];

interface TemplateFieldProviderProps {
  children: ReactNode;
  fields?: Field[];
}

const formSchema = z.object({
  fieldType: z.nativeEnum(FieldTypes).optional(),
  fields: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        width: z.number(),
        height: z.number(),
        top: z.number(),
        left: z.number(),
        required: z.boolean(),
        type: z.nativeEnum(FieldTypes),
        viewportHeight: z.number(),
        viewportWidth: z.number(),
        page: z.number(),
        defaultValue: z.string(),
        readOnly: z.boolean(),
        group: z.string().min(1),
      }),
    )
    .nonempty(),
  recipient: z.string(),
});

export type TemplateFieldForm = z.infer<typeof formSchema>;

export const TemplateFieldProvider = ({
  children,
  fields,
}: TemplateFieldProviderProps) => {
  const form = useForm<TemplateFieldForm>({
    defaultValues: {
      fields: fields ?? [],
      fieldType: undefined,
      recipient: ALL_RECIPIENT_VALUE,
    },
    resolver: zodResolver(formSchema),
  });

  return <Form {...form}>{children}</Form>;
};
