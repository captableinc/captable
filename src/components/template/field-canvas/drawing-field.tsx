import { COLORS } from "@/constants/esign";
import { cn } from "@/lib/utils";
import type { TemplateFieldForm } from "@/providers/template-field-provider";
import { useFormContext } from "react-hook-form";
interface DrawingFieldProps {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function DrawingField({ height, left, top, width }: DrawingFieldProps) {
  const { getValues } = useFormContext<TemplateFieldForm>();

  const recipient = getValues("recipient");
  const recipientColors = getValues("recipientColors");
  const color = (recipientColors?.[recipient] ?? "") as keyof typeof COLORS;

  return (
    <div
      className={cn(
        "absolute overflow-visible border-2 bg-opacity-30",
        COLORS?.[color]?.border,
        COLORS?.[color]?.bg,
      )}
      style={{
        left,
        top,
        width,
        height,
      }}
    />
  );
}
