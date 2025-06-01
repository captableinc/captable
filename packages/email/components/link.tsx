import { Link as ReactEmailLink } from "@react-email/components";
import type * as React from "react";

export interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "muted" | "breakable";
}

const variantClasses = {
  primary: "text-blue-600 no-underline",
  muted: "text-sm !text-muted-foreground no-underline",
  breakable: "break-all text-blue-600 no-underline",
};

export const Link = ({
  href,
  children,
  className,
  variant = "primary",
}: LinkProps) => {
  const baseClassName = className || variantClasses[variant];

  return (
    <ReactEmailLink href={href} className={baseClassName}>
      {children}
    </ReactEmailLink>
  );
};

export default Link;
