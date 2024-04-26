/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignaturePad } from "@/components/ui/signature-pad";

import { type TemplateSigningFieldForm } from "@/providers/template-signing-field-provider";
import { type RouterOutputs } from "@/trpc/shared";
import { useFormContext } from "react-hook-form";

type Field = RouterOutputs["template"]["getSigningFields"]["fields"][number];

type FieldRendererProps = Pick<
  Field,
  "type" | "name" | "required" | "readOnly" | "group"
> & { recipientId: string; prefilledValue: string | null; id: string };

export function FieldRenderer({
  type,
  name,
  required,
  readOnly,
  group,
  recipientId,
  prefilledValue,
  id,
}: FieldRendererProps) {
  const { control } = useFormContext<TemplateSigningFieldForm>();

  const enabled = group === recipientId;
  const disabled = readOnly || !enabled;

  const fieldName = `fieldValues.${id}` as const;

  switch (type) {
    case "TEXT":
      return (
        <FormField
          control={control}
          rules={
            required && !disabled
              ? {
                  required: {
                    message: "this field is required",
                    value: required,
                  },
                }
              : undefined
          }
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{name}</FormLabel>
              <FormControl>
                <Input disabled={disabled} type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "SIGNATURE":
      return (
        <FormField
          control={control}
          rules={
            required && !disabled
              ? {
                  required: {
                    message: "this field is required",
                    value: required,
                  },
                }
              : undefined
          }
          name={fieldName}
          render={({ field: { onChange } }) => (
            <FormItem>
              <FormLabel>{name}</FormLabel>
              <FormControl>
                <SignaturePad
                  disabled={disabled}
                  onChange={(val) => {
                    onChange(val);
                  }}
                  prefilledValue={prefilledValue}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    default:
      return null;
  }
}
