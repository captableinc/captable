import { cn } from "@/lib/utils";
interface DrawingFieldProps {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function DrawingField({ height, left, top, width }: DrawingFieldProps) {
  return (
    <div
      className={cn(
        "absolute overflow-visible border-2 bg-opacity-30 bg-red-400 border-red-400",
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
