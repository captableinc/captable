import "@/styles/globals.css";
import "cal-sans";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "@/trpc/react";
import { type Metadata } from "next";
import { constants } from "@/lib/constants";

export const metadata: Metadata = {
  title: "OpenCap",
  description:
    "OpenCap is an open source cap table management tool that does not sell your data.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL(constants.url),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
