"use client";

import { api } from "@/trpc/react";
import { ZCurrentPasswordSchema } from "@/trpc/routers/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { CaptableLogo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OtpStyledInput } from "@/components/ui/extension/otp-input";
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
import {
  RiDoorLockLine,
  RiEyeFill,
  RiEyeOffLine,
  RiGoogleFill,
  RiRotateLockFill,
} from "@remixicon/react";
import {
  browserSupportsWebAuthn,
  startAuthentication,
} from "@simplewebauthn/browser";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { AuthFormHeader } from "../auth-form-header";

const INPUT_NUM = 6;

const loginSchema = z.object({
  email: z.string().email(),
  password: ZCurrentPasswordSchema,
  totpCode: z.string().optional(),
  recoveryCode: z.string().optional(),
});

interface LoginFormProps {
  isGoogleAuthEnabled: boolean;
}

enum OtpInputType {
  password = "password",
  text = "text",
}

const SignInForm = ({ isGoogleAuthEnabled }: LoginFormProps) => {
  const router = useRouter();

  const [isPassword, setIsPassword] = useState<OtpInputType>(
    OtpInputType.password,
  );
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [is2faModalOpen, setIs2faModalOpen] = useState<boolean>(false);
  const [twoFactorAuthMethod, setTwoFactorMethod] = useState<
    "totp" | "recovery"
  >("totp");

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

  async function onFormSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const { email, password, totpCode, recoveryCode } = values;
      const credentials: Record<string, string> = {
        email,
        password,
      };

      if (totpCode) {
        credentials.totpCode = totpCode;
      }

      if (recoveryCode) {
        credentials.recoveryCode = recoveryCode;
      }

      if (
        is2faModalOpen &&
        !credentials.totpCode &&
        !credentials.recoveryCode
      ) {
        toast.error("OTP or recovery code required.");
        return;
      }

      const result = await signIn("credentials", {
        ...credentials,
        callbackUrl: "/onboarding",
        redirect: false,
      });

      if (result?.error === "Two factor missing credentials") {
        setIs2faModalOpen(true);
        return;
      }

      if (result?.error) {
        toast.error(result.error);
      }

      if (result?.ok) {
        router.push("/onboarding");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unknown error occured");
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
        const credential = await startAuthentication(options);

        const result = await signIn("webauthn", {
          credential: JSON.stringify(credential),
          callbackUrl: "/onboarding",
          redirect: false,
        });

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
    await signIn("google", { callbackUrl: "/onboarding" });
  }

  const onToggle2FAMethod = () => {
    const newMethod = twoFactorAuthMethod === "recovery" ? "totp" : "recovery";
    newMethod === "recovery"
      ? form.setValue("totpCode", "")
      : form.setValue("recoveryCode", "");
    setTwoFactorMethod(newMethod);
  };

  const onCloseTwoFactorAuthDialog = () => {
    form.setValue("recoveryCode", "");
    form.setValue("totpCode", "");
    setIs2faModalOpen(false);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <div className="grid w-full max-w-md grid-cols-1 gap-5 rounded-xl border bg-white p-10 shadow">
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
            <form
              id="login-form"
              onSubmit={form.handleSubmit(onFormSubmit)}
              className="space-y-8"
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
                  form="login-form"
                  type="submit"
                >
                  Login with Email
                </Button>
              </div>
            </form>

            <form
              id="otp-submit-form"
              onSubmit={form.handleSubmit(onFormSubmit)}
            >
              <Dialog
                open={is2faModalOpen}
                onOpenChange={onCloseTwoFactorAuthDialog}
              >
                <DialogContent
                  className={`${
                    twoFactorAuthMethod === "recovery"
                      ? "max-w-2xl w-xl"
                      : "max-w-lg w-lg"
                  }`}
                >
                  <header className="border-b border-gray-200 py-5 px-5">
                    <DialogHeader>
                      <div className="flex justify-center">
                        <CaptableLogo className="mb-3 h-8 w-8 rounded" />
                      </div>
                      <DialogTitle className="mb-4 text-center">
                        {twoFactorAuthMethod === "totp"
                          ? "OTP code"
                          : "Backup code"}
                      </DialogTitle>
                      <DialogDescription className="mx-auto text-center">
                        {twoFactorAuthMethod === "totp"
                          ? "Please provide a token from the authenticator app,"
                          : "Please provide your backup code."}
                      </DialogDescription>
                    </DialogHeader>
                  </header>

                  <form onSubmit={form.handleSubmit(onFormSubmit)}>
                    <fieldset disabled={isSubmitting}>
                      {twoFactorAuthMethod === "totp" && (
                        <FormField
                          control={form.control}
                          name="totpCode"
                          render={({ field }) => (
                            <FormControl>
                              <>
                                <FormItem className="flex space-y-0 gap-x-2">
                                  <OtpStyledInput
                                    numInputs={INPUT_NUM}
                                    inputType={isPassword}
                                    {...field}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-9"
                                    type="button"
                                    onClick={() => {
                                      setIsPassword(
                                        isPassword === OtpInputType.password
                                          ? OtpInputType.text
                                          : OtpInputType.password,
                                      );
                                    }}
                                  >
                                    {isPassword === OtpInputType.password ? (
                                      <RiEyeFill />
                                    ) : (
                                      <RiEyeOffLine />
                                    )}
                                    <span className="sr-only">
                                      {isPassword}
                                    </span>
                                  </Button>
                                </FormItem>
                                <FormMessage />
                              </>
                            </FormControl>
                          )}
                        />
                      )}

                      {twoFactorAuthMethod === "recovery" && (
                        <FormField
                          control={form.control}
                          name="recoveryCode"
                          render={({ field }) => (
                            <OtpStyledInput
                              numInputs={9}
                              inputType="text"
                              {...field}
                            />
                          )}
                        />
                      )}

                      <DialogFooter className="mt-4">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={onToggle2FAMethod}
                        >
                          <RiRotateLockFill />
                          {twoFactorAuthMethod === "totp"
                            ? "Use Backup Code"
                            : "Use Authenticator"}
                        </Button>

                        <Button
                          form="otp-submit-form"
                          type="submit"
                          loading={isSubmitting}
                        >
                          {isSubmitting ? "Signing in..." : "Sign In"}
                        </Button>
                      </DialogFooter>
                    </fieldset>
                  </form>
                </DialogContent>
              </Dialog>
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
