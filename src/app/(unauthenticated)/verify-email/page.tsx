import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default function EmailVerificationWithoutTokenPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <div className="grid w-full max-w-md grid-cols-1 gap-5 rounded-xl border bg-white p-10 shadow">
        <div className="flex flex-col gap-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Uh oh! Looks like you&apos;re missing a token
          </h1>

          <p className="text-sm text-muted-foreground">
            It seems that there is no token provided, if you are trying to
            verify your email please follow the link in your email.
          </p>

          <Link href="/" className="mt-4">
            <Button size="lg">Go back home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
