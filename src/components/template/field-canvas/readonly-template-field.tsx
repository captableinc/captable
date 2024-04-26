/* eslint-disable @next/next/no-img-element */
import { useFormContext, useWatch } from "react-hook-form";
import {
  ReadOnlyTemplateFieldContainer,
  type ReadOnlyTemplateFieldContainerProps,
} from "./template-field-container";

import { type FieldTypes } from "@/prisma/enums";
import { type TemplateSigningFieldForm } from "@/providers/template-signing-field-provider";

type ReadOnlyTemplateFieldProps = Omit<
  ReadOnlyTemplateFieldContainerProps,
  "children" | "color"
> & {
  name: string;
  id: string;
  type: FieldTypes;
  group: string;
  prefilledValue: string | null;
};

export const ReadOnlyTemplateField = ({
  name,
  type,
  id,
  group,
  prefilledValue,
  ...rest
}: ReadOnlyTemplateFieldProps) => {
  const { getValues } = useFormContext<TemplateSigningFieldForm>();
  const value = useWatch<TemplateSigningFieldForm>({
    name: `fieldValues.${id}` as const,
    disabled: !!prefilledValue,
  }) as string;

  const colors = getValues("recipientColors");

  const color = colors?.[group] ?? "";

  console.log({
    value,
    isDisabled: typeof prefilledValue === "string",
    prefilled: !!prefilledValue,
  });

  return (
    <ReadOnlyTemplateFieldContainer {...rest} color={color}>
      {type === "SIGNATURE" ? (
        prefilledValue || value !== "" ? (
          <img
            src={prefilledValue ?? value}
            alt="signature"
            className="h-full w-full"
          />
        ) : (
          <p>{name}</p>
        )
      ) : (
        <p>{value}</p>
      )}
    </ReadOnlyTemplateFieldContainer>
  );
};
