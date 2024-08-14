import type { SVGProps } from "react";
import type { IconName } from "./icon-names";

import { cn } from "@/lib/utils";

export type { IconName };

const sizeClassName = {
  sm: "w-6 h-6",
  md: "w-7 h-7",
  lg: "w-8 h-8",
} as const;

type Size = keyof typeof sizeClassName;

export function Icon({
  name,
  size = "sm",
  className,
  title,
  ...props
}: SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: Size;
  title?: string;
}) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      {...props}
      className={cn(sizeClassName[size], "inline self-center", className)}
      aria-hidden
    >
      {title ? <title>{title}</title> : null}
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  );
}
