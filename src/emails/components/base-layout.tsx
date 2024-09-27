import { Body, Container } from "@react-email/components";
import type { ReactNode } from "react";
import { Footer } from "./footer";

interface BaseLayoutProps {
  children: ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <Body className="bg-[#fff] my-auto mx-auto font-sans">
      <Container
        className="border-transparent md:border-[#E8E7E1] my-[40px] mx-auto p-[20px] max-w-[600px]"
        style={{ borderStyle: "solid", borderWidth: 1 }}
      >
        {children}

        <Footer />
      </Container>
    </Body>
  );
}
