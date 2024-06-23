import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface PricingButtonProps
  extends Omit<ComponentProps<"button">, "children"> {
  label: string;
  active: boolean;
}

export function PricingButton({
  label,
  active,
  className,
  ...rest
}: PricingButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        active && "bg-background text-foreground shadow-sm",
        className,
      )}
      {...rest}
    >
      {label}
    </button>
  );
}
