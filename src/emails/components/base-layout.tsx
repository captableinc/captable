import { Body, Container } from "@react-email/components";
import type { ReactNode } from "react";
import { Footer } from "./footer";
import { Logo } from "./logo";

interface BaseLayoutProps {
  children: ReactNode;
  baseUrl: string;
}

export function BaseLayout({ children, baseUrl }: BaseLayoutProps) {
  return (
    <Body className="bg-[#fff] my-auto mx-auto font-sans">
      <Container
        className="border-transparent md:border-[#E8E7E1] my-[40px] mx-auto p-[20px] max-w-[600px]"
        style={{ borderStyle: "solid", borderWidth: 1 }}
      >
        <Logo baseUrl={baseUrl} />

        {children}

        <Footer />
      </Container>
    </Body>
  );
}
