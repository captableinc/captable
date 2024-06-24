"use client";

import { PublicEnvScript } from "@/components/public-env-script";
import { env } from "@/env";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    const handleError = async () => {
      if (env.NEXT_PUBLIC_SENTRY_DSN) {
        const captureException = (await import("@sentry/nextjs"))
          .captureException;

        captureException(error);
      }
    };

    handleError();
  }, [error]);

  return (
    <html lang="en">
      <head>
        <PublicEnvScript />
      </head>
      <body>
        <NextError statusCode={undefined as never} />
      </body>
    </html>
  );
}
