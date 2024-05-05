import { CustomTextFieldRenderer } from "./custom-text-field-renderer";

import { type TemplateFieldForm } from "@/providers/template-field-provider";
import { useFormContext, useWatch } from "react-hook-form";

interface CustomFieldRendererProps {
  index: number;
}

export function CustomFieldRenderer({ index }: CustomFieldRendererProps) {
  const { control } = useFormContext<TemplateFieldForm>();
  const type = useWatch({ control: control, name: `fields.${index}.type` });

  switch (type) {
    case "TEXT":
      return <CustomTextFieldRenderer index={index} />;

    default:
      return null;
  }
}
