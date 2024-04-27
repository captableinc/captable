"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { RiMailLine } from "@remixicon/react";
import { useSearchParams } from "next/navigation";

const CheckEmailComponent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const { mutateAsync, isLoading } = api.auth.resendEmail.useMutation({
    onSuccess: async ({ message }) => {
      toast({
        variant: "default",
        title: "Resend Email",
        description: message,
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Email not found!",
      });
    },
  });

  async function Resend() {
    try {
      if (email) {
        await mutateAsync(email);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <div className="grid w-full max-w-md grid-cols-1 gap-5 rounded-xl border bg-white p-10 shadow">
        <div className="flex flex-col gap-y-2 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
            <span className="text-teal-500">
              <RiMailLine className="h-6 w-auto" />
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
        </div>
        <div className="mb-2 text-center">
          We&apos;ve sent an email to
          <span className="text-sm font-bold"> {email} </span>. Please click the
          link in the email to verify your account.
        </div>
        <Button onClick={Resend} disabled={!!!email} loading={isLoading}>
          Resend verification email
        </Button>
      </div>
    </div>
  );
};
export default CheckEmailComponent;
