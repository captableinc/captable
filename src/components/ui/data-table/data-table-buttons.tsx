import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "../button";

interface SortButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: string;
}

export function SortButton({ label, className, ...rest }: SortButtonProps) {
  return (
    <button {...rest} className={cn("flex cursor-pointer", className)}>
      {label}
      <Icon name="expand-up-down-line" aria-hidden className="ml-2 h-4 w-4" />
    </button>
  );
}

type ResetButtonProps = Omit<ButtonProps, "children" | "variant">;

export function ResetButton({ className, ...rest }: ResetButtonProps) {
  return (
    <Button
      variant={"secondary"}
      {...rest}
      className={cn("h-8 px-2 lg:px-3", className)}
    >
      Reset
      <Icon name="close-line" aria-hidden className="ml-2 h-4 w-4" />
    </Button>
  );
}
