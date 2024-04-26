"use client";

import { CaptableLogo } from "@/components/common/logo";
import { PasswordInput } from "@/components/ui/password-input";
import { api } from "@/trpc/react";
import { ZPasswordSchema } from "@/trpc/routers/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

export const ZResetPasswordFormSchema = z
  .object({
    password: ZPasswordSchema,
    repeatedPassword: ZPasswordSchema,
  })
  .refine((data) => data.password === data.repeatedPassword, {
    path: ["repeatedPassword"],
    message: "Passwords don't match",
  });

export type TResetPasswordFormSchema = z.infer<typeof ZResetPasswordFormSchema>;

export type ResetPasswordFormProps = {
  token: string;
};

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const router = useRouter();

  const form = useForm<TResetPasswordFormSchema>({
    values: {
      password: "",
      repeatedPassword: "",
    },
    resolver: zodResolver(ZResetPasswordFormSchema),
  });

  const isSubmitting = form.formState.isSubmitting;

  const { mutateAsync } = api.auth.newPassword.useMutation({
    onSuccess: async ({ message }) => {
      toast({
        variant: "default",
        title: "🎉 Password Updated",
        description: message,
      });
      router.replace("/password-updated");
    },
    onError: ({ message }) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: message,
      });
    },
  });

  const onFormSubmit = async ({
    password,
  }: Omit<TResetPasswordFormSchema, "repeatedPassword">) => {
    await mutateAsync({ password, token });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <div className="grid w-full max-w-md grid-cols-1 gap-5 rounded-xl border bg-white p-10 shadow">
        <div className="flex flex-col gap-y-2 text-center">
          <CaptableLogo className="mb-1 h-10 w-auto" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset your password
          </h1>
        </div>
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(onFormSubmit)}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel htmlFor="password">Passowrd</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          autoCapitalize="none"
                          autoCorrect="off"
                          autoFocus
                          required
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-light" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="repeatedPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel htmlFor="password">Repeat Passowrd</FormLabel>
                      <FormControl>
                        <Input
                          id="repeatPassword"
                          type="password"
                          autoCapitalize="none"
                          autoCorrect="off"
                          autoFocus
                          required
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-light" />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" loading={isSubmitting}>
                {isSubmitting ? "Resetting Password..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
