"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiGoogleFill } from "@remixicon/react";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginFormHeader } from "./login-form-header";

const loginSchema = z.object({
  email: z.string().email(),
});

interface LoginFormProps {
  isGoogleAuthEnabled: boolean;
}

const LoginForm = ({ isGoogleAuthEnabled }: LoginFormProps) => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: process.env.NODE_ENV === "development" ? "ceo@example.com" : "",
    },
  });

  const [email, setEmail] = useState<undefined | string>(undefined);
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const email = values.email;

    await signIn("email", {
      email,
      callbackUrl: "/onboarding",
      redirect: false,
    });

    setEmail(values.email);
  }

  async function signInWithGoogle() {
    await signIn("google", { callbackUrl: "/onboarding" });
  }
  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <div className="border-rounded grid w-full max-w-md grid-cols-1 gap-8 border bg-white p-10 shadow">
        <LoginFormHeader email={email} />

        {!email && (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid gap-1">
                          <FormLabel className="sr-only" htmlFor="email">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              placeholder="name@example.com"
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
                  <Button
                    loading={isSubmitting}
                    loadingText="Logging in..."
                    type="submit"
                  >
                    Login with Email
                  </Button>
                </div>
              </form>
            </Form>

            {isGoogleAuthEnabled && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  disabled={isSubmitting}
                  variant="outline"
                  type="button"
                  onClick={signInWithGoogle}
                >
                  <RiGoogleFill className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
