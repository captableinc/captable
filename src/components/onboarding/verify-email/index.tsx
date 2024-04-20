"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RiMailCheckLine } from "@remixicon/react";
import { RiMailCloseLine } from "@remixicon/react";

const VerifyEmail = ({ token }: { token: string }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const { mutateAsync } = api.auth.verifyEmail.useMutation({
    onSuccess: async ({ message }) => {
      setSuccess(message);
    },
    onError: (error) => {
      setError(error.message);
    },
  });
  const onSubmit = useCallback(async () => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");

      return;
    }

    try {
      await mutateAsync(token);
    } catch (err) {
      console.error(err);
    }
  }, [token, success, error]);

  useEffect(() => {
    void onSubmit();
  }, [onSubmit]);
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
                Something went wrong!
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
