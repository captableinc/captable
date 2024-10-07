"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignaturePad } from "@/components/ui/signature-pad";
import type { FieldTypes } from "@/prisma/enums";
import { useFormContext } from "react-hook-form";

export type TSigningField = {
  meta: {
    options?:
      | [
          {
            value: string;
            id: string;
          },
          ...{
            value: string;
            id: string;
          }[],
        ]
      | undefined;
  };
  type: FieldTypes;
  readOnly: boolean;
  required: boolean;
  name: string;
  id: string;
  prefilledValue: string | null;
  defaultValue?: string | null;
};

type SigningFieldProps = TSigningField;

function SigningField({
  type,
  name,
  required,
  readOnly,
  prefilledValue,
  id,
  meta,
}: SigningFieldProps) {
  const { control } = useFormContext<{ fieldValues: Record<string, string> }>();

  const disabled = readOnly;

  const fieldName = `fieldValues.${id}` as const;

  const rules = {
    ...(required && !disabled
      ? {
          required: {
            message: "this field is required",
            value: required,
          },
        }
      : undefined),
  };

  const commonProps = {
    control,
    rules,
    name: fieldName,
  };

  switch (type) {
    case "TEXT":
      return (
        <FormField
          {...commonProps}
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
          {...commonProps}
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

    case "DATE":
      return (
        <FormField
          {...commonProps}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{name}</FormLabel>
              <FormControl>
                <Input disabled={disabled} type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "SELECT":
      return (
        <FormField
          {...commonProps}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{name}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {meta?.options?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    default:
      return null;
  }
}

interface SigningFieldRendererProps {
  fields: SigningFieldProps[];
}

export function SigningFieldRenderer(props: SigningFieldRendererProps) {
  const { fields } = props;

  return fields.map((item) => (
    <SigningField
      name={item.name}
      key={item.id}
      type={item.type}
      required={item.required}
      readOnly={item.readOnly}
      prefilledValue={item.prefilledValue}
      id={item.id}
      meta={item.meta}
    />
  ));
}
