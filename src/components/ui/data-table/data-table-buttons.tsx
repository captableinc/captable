import { cn } from "@/lib/utils";
import { RiCloseLine } from "@remixicon/react";
import { Button, type ButtonProps } from "../button";

type ResetButtonProps = Omit<ButtonProps, "children" | "variant">;

export function ResetButton({ className, ...rest }: ResetButtonProps) {
  return (
    <Button
      variant={"secondary"}
      {...rest}
      className={cn("h-8 px-2 lg:px-3", className)}
    >
      Reset
      <RiCloseLine aria-hidden className="ml-2 h-4 w-4" />
    </Button>
  );
}
