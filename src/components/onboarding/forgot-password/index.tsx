"use client";
import { CaptableLogo } from "@/components/common/logo";
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
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const ForgotPassword = () => {
  const inputSchema = z.object({ email: z.string().email() });

  const form = useForm<z.infer<typeof inputSchema>>({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      email: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const router = useRouter();

  const { mutateAsync } = api.auth.forgotPassword.useMutation({
    onSuccess: () => {
      toast.success("🎉 Reset password email sent.");
      router.replace("/email-sent");
    },
    onError: ({ message }) => {
      toast.error(`🔥 Error - ${message}`);
    },
  });
  const onSubmit = async (values: z.infer<typeof inputSchema>) => {
    await mutateAsync(values.email);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <div className="grid w-full max-w-md grid-cols-1 gap-5 rounded-xl border bg-white p-10 shadow">
        <div className="flex flex-col gap-y-2 text-center">
          <CaptableLogo className="mb-1 h-10 w-auto" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Forgot your password?
          </h1>
        </div>
        <div className="mb-2 text-center text-sm text-muted-foreground">
          Enter your email and we&apos;ll email you a special link to reset your
          password.
        </div>
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-4">
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
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
                <Button loading={isSubmitting} type="submit">
                  Reset Password
                </Button>
              </div>
            </form>
          </Form>
          <span className="text-center text-sm text-gray-500">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Login
            </Link>
          </span>
        </>
      </div>
    </div>
  );
};
export default ForgotPassword;
