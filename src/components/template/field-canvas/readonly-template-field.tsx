import { useWatch } from "react-hook-form";
import {
  ReadOnlyTemplateFieldContainer,
  type ReadOnlyTemplateFieldContainerProps,
} from "./template-field-container";

import { type FieldTypes } from "@/prisma/enums";
import { type TemplateSigningFieldForm } from "@/providers/template-signing-field-provider";

type ReadOnlyTemplateFieldProps = Omit<
  ReadOnlyTemplateFieldContainerProps,
  "children"
> & {
  name: string;
  type: FieldTypes;
};

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
    <ReadOnlyTemplateFieldContainer {...rest}>
      <p>{type === "SIGNATURE" ? name : value}</p>
    </ReadOnlyTemplateFieldContainer>
  );
};
