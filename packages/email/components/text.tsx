import { Text as ReactEmailText } from "@react-email/components";
import type * as React from "react";

export interface TextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "body" | "small" | "muted";
}

const variantClasses = {
  body: "text-[14px] leading-[24px] text-black",
  small: "text-[12px] leading-[24px] text-black",
  muted: "text-[12px] leading-[24px] text-[#666666]",
};

export const Text = ({ children, className, variant = "body" }: TextProps) => {
  const baseClassName = className || variantClasses[variant];

  return <ReactEmailText className={baseClassName}>{children}</ReactEmailText>;
};

export default Text;
