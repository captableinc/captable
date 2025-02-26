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
import { zodResolver } from "@hookform/resolvers/zod";
import { RiDoorLockLine, RiGoogleFill } from "@remixicon/react";
import {
  browserSupportsWebAuthn,
  startAuthentication,
} from "@simplewebauthn/browser";
import { signIn } from "next-auth/react";
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

  console.log(
    "[SignInForm] Component rendering, Google Auth Enabled:",
    isGoogleAuthEnabled,
  );

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
    console.log("[SignInForm] Form submitted with values:", {
      email: values.email,
    });
    try {
      const email = values.email;
      const password = values.password;
      console.log("[SignInForm] Calling signIn with credentials");
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/onboarding",
        redirect: false,
      });

      console.log("[SignInForm] SignIn result:", result);

      if (result?.error) {
        console.error("[SignInForm] SignIn error:", result.error);
        toast.error("Incorrect email or password");
      } else if (result?.url) {
        console.log("[SignInForm] Redirecting to:", result.url);
        router.push(result.url);
      }
    } catch (error) {
      console.error("[SignInForm] Unexpected error during sign in:", error);
      toast.error("An unexpected error occurred");
    }
  }

  const onSignInWithPasskey = async () => {
    console.log("[SignInForm] Passkey sign-in initiated");
    if (!browserSupportsWebAuthn()) {
      console.error("[SignInForm] Browser does not support WebAuthn");
      toast.error("Passkeys are not supported on this browser");
      return;
    }

    try {
      setIsPasskeyLoading(true);
      console.log("[SignInForm] Creating passkey signin options");
      const options = await createPasskeySigninOptions();

      if (options) {
        console.log("[SignInForm] Starting authentication with options");
        const credential = await startAuthentication(options);
        console.log(
          "[SignInForm] Authentication completed, signing in with WebAuthn",
        );

        const result = await signIn("webauthn", {
          credential: JSON.stringify(credential),
          callbackUrl: "/onboarding",
          redirect: false,
        });

        console.log("[SignInForm] WebAuthn sign-in result:", result);

        if (!result?.url) {
          console.error(
            "[SignInForm] WebAuthn sign-in failed: No URL returned",
          );
          toast.error("Unauthorized error, invalid credentials.");
        } else {
          console.log(
            "[SignInForm] WebAuthn sign-in successful, redirecting to:",
            result.url,
          );
          router.push(result.url);
        }
      }
    } catch (_err) {
      const err = _err as Error;
      console.error("[SignInForm] Error during passkey sign-in:", err);
      toast(
        err.message ||
          "Something went wrong, please reload the page and try again.",
      );
    } finally {
      setIsPasskeyLoading(false);
    }
  };

  async function signInWithGoogle() {
    console.log("[SignInForm] Google sign-in initiated");
    try {
      await signIn("google", { callbackUrl: "/onboarding" });
      console.log("[SignInForm] Google sign-in callback completed");
    } catch (err) {
      console.error("[SignInForm] Google sign-in error:", err);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <div className="grid w-full max-w-md grid-cols-1 gap-5 rounded-xl border bg-white p-10 shadow">
        <AuthFormHeader page="signin" />
        <>
          <Button
            disabled={isSubmitting}
            loading={isPasskeyLoading}
            type="button"
            onClick={(e) => {
              console.log("[SignInForm] Passkey button clicked", e);
              onSignInWithPasskey();
            }}
          >
            <RiDoorLockLine className="h-5 w-5" />
            Login with <span className="font-bold">Passkey</span>
          </Button>

          {isGoogleAuthEnabled && (
            <Button
              disabled={isSubmitting}
              type="button"
              onClick={(e) => {
                console.log("[SignInForm] Google button clicked", e);
                signInWithGoogle();
              }}
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
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                console.log("[SignInForm] Form submit event triggered", e);
                form.handleSubmit(onSubmit)(e);
              }}
            >
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
                  className="text-right text-sm font-medium hover:text-gray-500"
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

          <span className="text-center text-sm text-gray-500">
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
