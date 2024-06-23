"use client";

import { CaptableLogo } from "@/components/common/logo";
import { PasswordInput } from "@/components/ui/password-input";
import { api } from "@/trpc/react";
import { ZPasswordSchema } from "@/trpc/routers/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export const ZSetPasswordFormSchema = z
  .object({
    password: ZPasswordSchema,
    repeatedPassword: ZPasswordSchema,
  })
  .refine((data) => data.password === data.repeatedPassword, {
    path: ["repeatedPassword"],
    message: "Passwords don't match",
  });

export type TSetPasswordFormSchema = z.infer<typeof ZSetPasswordFormSchema>;

export type SetPasswordFormProps = {
  token: string;
  email: string;
  verificationToken: string;
};

export const SetPasswordForm = ({
  token,
  email,
  verificationToken,
}: SetPasswordFormProps) => {
  const form = useForm<TSetPasswordFormSchema>({
    values: {
      password: "",
      repeatedPassword: "",
    },
    resolver: zodResolver(ZSetPasswordFormSchema),
  });

  const isSubmitting = form.formState.isSubmitting;

  const { mutateAsync } = api.auth.newPassword.useMutation({
    onSuccess: async () => {
      toast.success("🎉 Password updated successfully.");
      await signIn("credentials", {
        password: form.getValues("password"),
        email: email,
        callbackUrl: `/verify-member/${verificationToken}?email=${email}`,
      });
    },
    onError: ({ message }) => {
      toast.error(`🔥 Error - ${message}`);
    },
  });

  const onFormSubmit = async ({
    password,
  }: Omit<TSetPasswordFormSchema, "repeatedPassword">) => {
    await mutateAsync({ password, token });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <div className="grid w-full max-w-md grid-cols-1 gap-5 rounded-xl border bg-white p-10 shadow">
        <div className="flex flex-col gap-y-2 text-center">
          <CaptableLogo className="mb-1 h-10 w-auto" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Set your password
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
                      <FormLabel htmlFor="password">Password</FormLabel>
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
                      <FormLabel htmlFor="password">Confirm password</FormLabel>
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
                {isSubmitting ? "Setting Password..." : "Set Password"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
