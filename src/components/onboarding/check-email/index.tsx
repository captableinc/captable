"use client";

import { RiMailLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";

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
        description: "Invalid Email!",
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
          <RiMailLine className="mb-1 h-10 w-auto" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
        </div>
        <div className="mb-2 text-center">
          We&apos;ve sent an email to
          <span className="text-sm font-bold"> {email} </span>. Please click the
          link in the email to gain access to your account.
        </div>
        <Button onClick={Resend} disabled={!!!email} loading={isLoading}>
          Resend Email
        </Button>
      </div>
    </div>
  );
};
export default CheckEmailComponent;
