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
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { api } from "@/trpc/react";
import { ZCurrentPasswordSchema } from "@/trpc/routers/auth/schema";
import { signIn } from "@captable/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiDoorLockLine, RiGoogleFill } from "@remixicon/react";
import {
  browserSupportsWebAuthn,
  startAuthentication,
} from "@simplewebauthn/browser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { AuthFormHeader } from "../auth-form-header";

const loginSchema = z.object({
  email: z.string().email(),
  password: ZCurrentPasswordSchema,
});

interface LoginFormProps {
  isGoogleAuthEnabled: boolean;
}

const SignInForm = ({ isGoogleAuthEnabled }: LoginFormProps) => {
  const router = useRouter();
  const [isPasskeyLoading, setIsPasskeyLoading] = useState<boolean>(false);

  const { mutateAsync: createPasskeySigninOptions } =
    api.passkey.createSigninOptions.useMutation();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: process.env.NODE_ENV === "development" ? "ceo@example.com" : "",
      password: process.env.NODE_ENV === "development" ? "P@ssw0rd!" : "",
    },
  });
  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const email = values.email;
    const password = values.password;
    const result = await signIn.email({
      email,
      password,
      callbackURL: "/onboarding",
    });

    if (result?.error) {
      toast.error("Incorrect email or password");
    }
  }

  const onSignInWithPasskey = async () => {
    if (!browserSupportsWebAuthn()) {
      toast.error("Passkeys are not supported on this browser");
      return;
    }

    try {
      setIsPasskeyLoading(true);

      const options = await createPasskeySigninOptions();

      if (options) {
        const _credential = await startAuthentication(options);

        // const result = await signIn("webauthn", {
        //   credential: JSON.stringify(credential),
        //   callbackUrl: "/onboarding",
        //   redirect: false,
        // });
        const result = {} as { url: string };

        if (!result?.url) {
          toast.error("Unauthorized error, invalid credentials.");
        } else {
          router.push(result.url);
        }
      }
    } catch (_err) {
      const err = _err as Error;
      toast(
        err.message ||
          "Something went wrong, please reload the page and try again.",
      );
    } finally {
      setIsPasskeyLoading(false);
    }
  };

  async function signInWithGoogle() {
    await signIn.social({
      provider: "google",
      callbackURL: "/onboarding",
    });
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="grid w-full max-w-md grid-cols-1 gap-5 rounded-xl border bg-card p-10 shadow">
        <AuthFormHeader page="signin" />
        <>
          <Button
            disabled={isSubmitting}
            loading={isPasskeyLoading}
            type="button"
            onClick={onSignInWithPasskey}
          >
            <RiDoorLockLine className="h-5 w-5" />
            Login with <span className="font-bold">Passkey</span>
          </Button>

          {isGoogleAuthEnabled && (
            <Button
              disabled={isSubmitting}
              type="button"
              onClick={signInWithGoogle}
            >
              <RiGoogleFill className="mr-2 h-4 w-4" />
              Login with <span className="font-bold">Google</span>
            </Button>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
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
                            placeholder="work@email.com"
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-1">
                        <FormLabel className="sr-only" htmlFor="password">
                          Password
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            id="password"
                            placeholder="*******"
                            autoCapitalize="none"
                            autoComplete="password"
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
                <Link
                  href="/forgot-password"
                  className="text-right text-sm font-medium hover:text-muted-foreground"
                >
                  Forgot your password?
                </Link>
                <Button
                  loading={isSubmitting}
                  loadingText="Signing in..."
                  type="submit"
                >
                  Login with Email
                </Button>
              </div>
            </form>
          </Form>

          <span className="text-center text-sm text-muted-foreground">
            Don{`'`}t have an account?{" "}
            <Link
              href="/signup"
              className="underline underline-offset-4 hover:text-primary"
            >
              Signup
            </Link>
          </span>
        </>
      </div>
    </div>
  );
};

export default SignInForm;
