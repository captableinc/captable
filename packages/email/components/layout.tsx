import {
  Body,
  Container,
  Head,
  Img,
  Preview,
  Html as ReactEmailHtml,
  Tailwind,
} from "@react-email/components";
import type * as React from "react";

export interface LayoutProps {
  children: React.ReactNode;
  preview?: string;
  logoUrl?: string;
  logoAlt?: string;
  containerClassName?: string;
}

export const Layout = ({
  children,
  preview,
  logoUrl = "https://cdn.captableinc.com/logo/100.png", // Default logo URL
  logoAlt = "Captable Logo",
  containerClassName = "mx-auto my-[40px] max-w-[465px] border-separate rounded border border-solid border-neutral-200 p-[20px]",
}: LayoutProps) => {
  return (
    <ReactEmailHtml>
      <Head />
      {preview && <Preview>{preview}</Preview>}
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className={containerClassName}>
            {/* Centered Logo */}
            <div className="mx-auto mb-[30px] text-center">
              <Img
                src={logoUrl}
                alt={logoAlt}
                className="mx-auto h-[40px] w-auto"
              />
            </div>
            {children}
          </Container>
        </Body>
      </Tailwind>
    </ReactEmailHtml>
  );
};

export default Layout;
