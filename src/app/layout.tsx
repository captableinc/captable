import { satoshi, robotoMono } from "@/styles/fonts";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "@/trpc/react";
import { type Metadata } from "next";
import { constants } from "@/lib/constants";
import { Toaster } from "@/components/ui/toaster";
import { NextAuthProvider } from "@/providers/next-auth";
import { getServerAuthSession } from "@/server/auth";
import { ProgressBarProvider } from "@/providers/progress-bar";

export const metadata: Metadata = {
  title: {
    template: "%s | OpenCap",
    default: "OpenCap",
  },
  description:
    "OpenCap is an open source cap table management tool that does not sell your data.",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
  metadataBase: new URL(constants.url),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <html lang="en" className={cn(satoshi.variable, robotoMono.variable)}>
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
