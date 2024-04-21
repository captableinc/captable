"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { AuthFormHeader } from "../auth-form-header";
import { Button } from "@/components/ui/button";
import { RiGoogleFill } from "@remixicon/react";
import { ZPasswordSchema } from "@/trpc/routers/auth/schema";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";

const ZSignUpFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: ZPasswordSchema,
});

interface SignUpFormProps {
  isGoogleAuthEnabled: boolean;
}

const SignUpForm = ({ isGoogleAuthEnabled }: SignUpFormProps) => {
  const form = useForm<z.infer<typeof ZSignUpFormSchema>>({
    resolver: zodResolver(ZSignUpFormSchema),
    defaultValues: {
      email: process.env.NODE_ENV === "development" ? "ceo@example.com" : "",
      password: "",
    },
  });
  const router = useRouter();

  const { mutateAsync } = api.auth.signup.useMutation({
    onSuccess: async ({ message }) => {
      toast({
        variant: "default",
        title: "🎉 Registration Successfull",
        description: message,
      });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: err.message,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof ZSignUpFormSchema>) {
    try {
      await mutateAsync(values);
      router.replace(`/check-email?email=${values.email}`);
    } catch (err) {
      console.error(err);
    }
  }

  async function signInWithGoogle() {
    await signIn("google", { callbackUrl: "/onboarding" });
  }
  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <div className="grid w-full max-w-md grid-cols-1 gap-5 rounded-xl border bg-white p-10 shadow">
        <AuthFormHeader page="signup" />
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-1">
                        <FormLabel className="sr-only" htmlFor="name">
                          Full name
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="fullname"
                            placeholder="Full Name"
                            type="text"
                            autoCapitalize="none"
                            autoComplete="name"
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
                <Button
                  loading={isSubmitting}
                  loadingText="Signing up..."
                  type="submit"
                >
                  Sign Up
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
          <span className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="underline underline-offset-4 hover:text-primary "
            >
              Sign In
            </Link>
          </span>
        </>
      </div>
    </div>
  );
};

export default SignUpForm;
