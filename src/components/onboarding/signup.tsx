"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { api } from "@/trpc/react";

const SignupForm = () => {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const emailRef = useRef<HTMLInputElement>(null);
  const addToWaitList = api.waitList.addToWaitList.useMutation({
    onError: () => {
      setEmail(undefined);
    },
  });
  const disabled = !!email;
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <div className="border-rounded grid w-full max-w-md grid-cols-1 gap-8 border bg-white p-10 shadow">
        <div className="grid w-full max-w-md grid-cols-1 gap-8 ">
          <div className="mb-5 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {email ? (
                <>Successfully Added to Waitlist!</>
              ) : (
                <>Get started with OpenCap</>
              )}
            </h1>
            <p className="text-sm text-muted-foreground">
              {email ? (
                <>
                  Thank you for joining our waitlist. We will notify you when
                  the product is available.{" "}
                </>
              ) : (
                <> Enter your email below to create an account</>
              )}
            </p>
          </div>

          {!email ? (
            <>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const value = emailRef.current?.value;

                  setEmail(value);
                  if (value) {
                    addToWaitList.mutate({ email: value });
                  }
                }}
              >
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="email">
                      Email
                    </Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      required
                      ref={emailRef}
                      disabled={disabled}
                    />
                  </div>
                  <Button disabled={disabled}>Sign up with Email</Button>
                </div>
              </form>

              <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <Link
                  className="underline underline-offset-4 hover:text-primary"
                  href="/terms"
                >
                  Terms of Service
                </Link>
                {" and "}
                <Link
                  className="underline underline-offset-4 hover:text-primary"
                  href="/privacy"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </>
          ) : (
            <Link href="/" className={buttonVariants()}>
              Return to Homepage
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
