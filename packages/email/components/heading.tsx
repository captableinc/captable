import { Heading as ReactEmailHeading } from "@react-email/components";
import type * as React from "react";

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  level?: "h1" | "h2" | "h3";
}

export const Heading = ({
  children,
  className = "mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black",
  level = "h1",
}: HeadingProps) => {
  return (
    <ReactEmailHeading as={level} className={className}>
      {children}
    </ReactEmailHeading>
  );
};

export default Heading;
