import type React from "react";

export type IconProps = {
  className?: string;
};

export const CheckIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    width="1em"
    height="1em"
    fill="#5e5e5f"
    aria-hidden="true"
    className={` ${className}`}
  >
    <path d="M6.336 13.6a1.049 1.049 0 0 1-.8-.376L2.632 9.736a.992.992 0 0 1 .152-1.424 1.056 1.056 0 0 1 1.456.152l2.008 2.4 5.448-8a1.048 1.048 0 0 1 1.432-.288A.992.992 0 0 1 13.424 4L7.2 13.144a1.04 1.04 0 0 1-.8.456h-.064Z" />
  </svg>
);
