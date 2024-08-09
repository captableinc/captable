import * as React from "react";

import { Icon } from "@/components/ui/icon";
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input, type InputProps } from "./input";

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, "type">
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pr-10", className)}
        ref={ref}
        {...props}
      />

      <Button
        variant="link"
        type="button"
        className="absolute right-0 top-0 flex h-full items-center justify-center pr-3"
        aria-label={showPassword ? "Mask password" : "Reveal password"}
        onClick={() => setShowPassword((show) => !show)}
      >
        {showPassword ? (
          <Icon
            name="eye-off-line"
            aria-hidden
            className="h-5 w-5 text-muted-foreground"
          />
        ) : (
          <Icon
            name="eye-line"
            aria-hidden
            className="h-5 w-5 text-muted-foreground"
          />
        )}
      </Button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
