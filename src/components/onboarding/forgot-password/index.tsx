"use client";
import { CaptableLogo } from "@/components/shared/logo";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
const ForgotPassword = () => {
  const inputSchema = z.object({ email: z.string().email() });

  const form = useForm<z.infer<typeof inputSchema>>({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      email: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = (values: z.infer<typeof inputSchema>) => {
    console.log(values);
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
            </form>
          </Form>
          <Button loading={isSubmitting} type="submit">
            Reset Password
          </Button>
          <span className="text-center text-sm text-gray-500">
            Remembered your password?{" "}
            <Link
              href="/signin"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign In
            </Link>
          </span>
        </>
      </div>
    </div>
  );
};
export default ForgotPassword;
