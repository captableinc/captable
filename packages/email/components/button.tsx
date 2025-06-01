import { Button as ReactEmailButton, Section } from "@react-email/components";
import type * as React from "react";

export interface ButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  sectionClassName?: string;
}

export const Button = ({
  href,
  children,
  className = "rounded bg-black px-5 py-3 text-center text-[12px] font-semibold text-white no-underline",
  sectionClassName = "mb-[32px] mt-[32px]",
}: ButtonProps) => {
  return (
    <Section className={sectionClassName}>
      <table
        align="center"
        width="100%"
        border={0}
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        style={{ width: "100%" }}
      >
        <tbody>
          <tr>
            <td align="center" style={{ textAlign: "center" }}>
              <ReactEmailButton className={className} href={href}>
                {children}
              </ReactEmailButton>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  );
};

export default Button;
