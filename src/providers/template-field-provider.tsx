"use client";

import { Form } from "@/components/ui/form";
import { RECIPIENT_COLORS } from "@/constants/esign";
import { FieldTypes, TemplateStatus } from "@/prisma/enums";
import { type RouterOutputs } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Field = RouterOutputs["template"]["get"]["fields"][number];
type recipients = RouterOutputs["template"]["get"]["recipients"][number];

interface TemplateFieldProviderProps {
  children: ReactNode;
  fields?: Field[];
  recipients: recipients[];
}

const formSchema = z.object({
  status: z.nativeEnum(TemplateStatus),
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
  recipientColors: z.record(z.string()),
});

export type TemplateFieldForm = z.infer<typeof formSchema>;

export const TemplateFieldProvider = ({
  children,
  fields,
  recipients,
}: TemplateFieldProviderProps) => {
  const form = useForm<TemplateFieldForm>({
    defaultValues: {
      status: "DRAFT",
      fields: fields ?? [],
      fieldType: undefined,
      recipient: recipients?.[0]?.id,
      recipientColors: recipients
        ? recipients.reduce<Record<string, string>>((prev, curr, index) => {
            const color = RECIPIENT_COLORS?.[index] ?? "";

            prev[curr.id] = color;

            return prev;
          }, {})
        : {},
    },
    resolver: zodResolver(formSchema),
  });

  return <Form {...form}>{children}</Form>;
};
