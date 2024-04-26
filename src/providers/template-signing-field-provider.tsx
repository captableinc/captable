"use client";

import { Form } from "@/components/ui/form";
import { RECIPIENT_COLORS } from "@/constants/esign";
import { type RouterOutputs } from "@/trpc/shared";
import { type ReactNode } from "react";
import { useForm } from "react-hook-form";

type Field = RouterOutputs["template"]["getSigningFields"]["fields"][number];

interface TemplateSigningFieldProviderProps {
  children: ReactNode;
  fields?: Field[];
}

export type TemplateSigningFieldForm = {
  fields: Field[];
  fieldValues: Record<string, string>;
  recipientColors: Record<string, string>;
};

export const TemplateSigningFieldProvider = ({
  children,
  fields,
}: TemplateSigningFieldProviderProps) => {
  const form = useForm<TemplateSigningFieldForm>({
    defaultValues: {
      fields: fields ?? [],
      fieldValues: fields
        ? fields.reduce<Record<string, string>>((prev, curr) => {
            prev[curr.id] = curr?.prefilledValue || curr?.defaultValue || "";
            return prev;
          }, {})
        : {},
      recipientColors: fields
        ? fields.reduce<Record<string, string>>((prev, curr, index) => {
            const color = RECIPIENT_COLORS?.[index] ?? "";

            prev[curr.group] = color;

            return prev;
          }, {})
        : {},
    },
  });

  return <Form {...form}>{children}</Form>;
};
