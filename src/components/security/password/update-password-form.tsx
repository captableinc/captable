"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { api } from "@/trpc/react";
import { ZPasswordSchema } from "@/trpc/routers/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const ZChangePasswordFormSchema = z
  .object({
    currentPassword: ZPasswordSchema,
    newPassword: ZPasswordSchema,
    repeatedPassword: ZPasswordSchema,
  })
  .refine((data) => data.newPassword === data.repeatedPassword, {
    path: ["repeatedPassword"],
    message: "Passwords don't match",
  });

export type TChangePasswordFormSchema = z.infer<
  typeof ZChangePasswordFormSchema
>;

export const UpdatePasswordForm = () => {
  const form = useForm<TChangePasswordFormSchema>({
    values: {
      currentPassword: "",
      newPassword: "",
      repeatedPassword: "",
    },
    resolver: zodResolver(ZChangePasswordFormSchema),
  });

  const isSubmitting = form.formState.isSubmitting;
  const isDirty = form.formState.isDirty;

  const { mutateAsync } = api.security.updatePassword.useMutation({
    onSuccess: ({ success }) => {
      if (success) {
        toast("🎉 Password Updated");
        form.reset();
      }
    },
    onError: () => {
      toast("Uh oh! Something went wrong.");
    },
  });

  const onFormSubmit = async (data: TChangePasswordFormSchema) => {
    await mutateAsync({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <div className="grid w-full grid-cols-1 gap-5 p-8">
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onFormSubmit)}>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-3">
                    <FormLabel htmlFor="password">Current Password</FormLabel>
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
              name="newPassword"
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
                    <FormLabel htmlFor="password">Repeat Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        id="repeatPassword"
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
            <div className="mt-5 flex justify-end">
              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                disabled={isSubmitting || !isDirty}
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
