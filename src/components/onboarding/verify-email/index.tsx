"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RiMailCheckLine, RiMailCloseLine } from "@remixicon/react";

const VerifyEmail = ({ token }: { token: string }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const { mutateAsync } = api.auth.verifyEmail.useMutation({
    onSuccess: async ({ message }) => {
      setLoading(false);
      setSuccess(message);
    },
    onError: (error) => {
      setLoading(false);
      setError(error.message);
    },
  });

  const onSubmit = useCallback(async () => {
    if (success || error) return;

    if (!token) {
      setLoading(false);
      setError("Missing token!");
      return;
    }

    try {
      await mutateAsync(token);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Something went wrong! Please try again.");
    }
  }, [token, success, error]);

  useEffect(() => {
    void onSubmit();
  }, [onSubmit]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
        <div className="grid w-full max-w-md grid-cols-1 gap-5 rounded-xl border bg-white p-10 shadow">
          <div className="flex flex-col gap-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Verifying...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <div className="grid w-full max-w-md grid-cols-1 gap-5 rounded-xl border bg-white p-10 shadow">
        <div className="flex flex-col gap-y-2 text-center">
          {success ? (
            <>
              <RiMailCheckLine className="mb-1 h-10 w-auto" />
              <h1 className="text-2xl font-semibold tracking-tight">
                {success}
              </h1>
              <div className="mb-2 text-center text-sm text-muted-foreground">
                Email verified successfully
              </div>
            </>
          ) : (
            <>
              <RiMailCloseLine className="mb-1 h-10 w-auto" />
              <h1 className="text-2xl font-semibold tracking-tight">
                Verification Failed
              </h1>
              <div className="mb-2 text-center text-sm text-muted-foreground">
                {error}
              </div>
            </>
          )}
          <Link href="/" className="mt-4">
            <Button size="lg">Go back home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
