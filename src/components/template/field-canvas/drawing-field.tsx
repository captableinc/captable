import { COLORS } from "@/constants/esign";
import { cn } from "@/lib/utils";
interface DrawingFieldProps {
  color: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

export function DrawingField({
  color,
  height,
  left,
  top,
  width,
}: DrawingFieldProps) {
  return (
    <div
      className={cn(
        "absolute overflow-visible border-2 bg-opacity-30",
        COLORS[color as keyof typeof COLORS]?.border,
        COLORS[color as keyof typeof COLORS]?.bg,
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
