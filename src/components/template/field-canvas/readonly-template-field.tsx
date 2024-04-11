import { useWatch } from "react-hook-form";
import {
  TemplateFieldContainer,
  type TemplateFieldContainerProps,
} from "./template-field-container";

import { type FieldTypes } from "@/prisma/enums";
import { type TemplateSigningFieldForm } from "@/providers/template-signing-field-provider";

interface ReadOnlyTemplateFieldProps
  extends Omit<TemplateFieldContainerProps, "children"> {
  name: string;
  type: FieldTypes;
}

export const ReadOnlyTemplateField = ({
  name,
  type,
  ...rest
}: ReadOnlyTemplateFieldProps) => {
  const value = useWatch<TemplateSigningFieldForm>({
    name: `fieldValues.${name}` as const,
    disabled: type === "SIGNATURE",
  }) as string;
  return (
    <TemplateFieldContainer {...rest}>
      <p>{type === "SIGNATURE" ? name : value}</p>
    </TemplateFieldContainer>
  );
};
