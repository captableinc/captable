import { inter, satoshi } from "@/styles/fonts";
import "@/styles/globals.css";
import "cal-sans";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "@/trpc/react";
import { type Metadata } from "next";
import ProgressBarProvider from "./ProgressBarProvider";
import { constants } from "@/lib/constants";
import { Toaster } from "@/components/ui/toaster";
import { NextAuthProvider } from "@/providers/next-auth";
import { getServerAuthSession } from "@/server/auth";

export const metadata: Metadata = {
  title: "OpenCap",
  description:
    "OpenCap is an open source cap table management tool that does not sell your data.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL(constants.url),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <html lang="en" className={cn(satoshi.variable, inter.variable)}>
      <body className="min-h-screen">
        <ProgressBarProvider>
          <NextAuthProvider session={session}>
            <TRPCReactProvider cookies={cookies().toString()}>
              <main>{children}</main>
              <Toaster />
            </TRPCReactProvider>
          </NextAuthProvider>
        </ProgressBarProvider>
      </body>
    </html>
  );
}
