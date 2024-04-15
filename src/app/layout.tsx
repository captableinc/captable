import logo from "@/assets/logo.svg";
import ScreenSize from "@/components/screen-size";
import { Toaster } from "@/components/ui/toaster";
import { constants } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { NextAuthProvider } from "@/providers/next-auth";
import { ProgressBarProvider } from "@/providers/progress-bar";
import { getServerAuthSession } from "@/server/auth";
import { robotoMono, satoshi } from "@/styles/fonts";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { type Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: {
    template: "%s | Captable, Inc.",
    default: "Captable, Inc.",
  },
  description:
    "Captable, Inc. is an open source cap table management tool that does not sell your data.",
  icons: [{ rel: "icon", url: logo.src }],
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
              {process.env.NEXT_PUBLIC_NODE_ENV === "development" && (
                <ScreenSize />
              )}
            </TRPCReactProvider>
          </NextAuthProvider>
        </ProgressBarProvider>
      </body>
    </html>
  );
}
