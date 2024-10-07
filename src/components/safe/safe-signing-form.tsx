"use client";

import type { SafeSigningFieldForm } from "@/providers/safe-signing-field-provider";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

interface SafeSigningFormProps {
  children: ReactNode;
}

export function SafeSigningForm({ children }: SafeSigningFormProps) {
  const { handleSubmit } = useFormContext<SafeSigningFieldForm>();
  const router = useRouter();
  const { mutate } = api.safe.sign.useMutation({
    onSuccess() {
      toast.success("🎉 Great job, you are done signing this document.");
      router.push("/");
    },
  });

  const onSubmit = (values: SafeSigningFieldForm) => {
    mutate({
      data: values.fieldValues,
      safeId: values.safeId,
      token: values.token,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-4 px-2 py-10"
    >
      {children}
    </form>
  );
}
