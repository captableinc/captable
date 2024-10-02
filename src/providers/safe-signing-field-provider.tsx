"use client";

import type { TSigningField } from "@/components/signing-field/signing-field-renderer";
import { Form } from "@/components/ui/form";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";

interface SafeSigningFieldProviderProps {
  children: ReactNode;
  fields?: TSigningField[];
  token: string;
  safeId: string;
}

export type SafeSigningFieldForm = {
  fieldValues: Record<string, string>;
  token: string;
  safeId: string;
};

export const SafeSigningFieldProvider = ({
  children,
  fields,
  safeId,
  token,
}: SafeSigningFieldProviderProps) => {
  const form = useForm<SafeSigningFieldForm>({
    defaultValues: {
      fieldValues: fields
        ? fields.reduce<Record<string, string>>((prev, curr) => {
            prev[curr.id] = curr?.prefilledValue || curr?.defaultValue || "";
            return prev;
          }, {})
        : {},
      safeId,
      token,
    },
  });

  return <Form {...form}>{children}</Form>;
};
