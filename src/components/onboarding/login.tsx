"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiGoogleFill } from "@remixicon/react";

const LoginForm = () => {
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <div className="grid grid-cols-1 gap-8 max-w-md w-full p-10 border border-rounded bg-white shadow">

        <div className="text-center mb-5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Login to OpenCap
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to login with a magic link
          </p>
        </div>
          

        <form onSubmit={
          async (e) => {
            e.preventDefault();
            setLoading(true)
            const email = (e.currentTarget.elements as any).email.value as string; // eslint-disable-line
            await signIn("email", { email, callbackUrl: "/onboarding" })
          }
        } >
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
                disabled={loading}
              />
            </div>
            <Button >
              Login with Email
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button variant="outline" type="button" onClick={
          async () => {
            setLoading(true)
            await signIn("google", { callbackUrl: "/onboarding" })
            setLoading(false)
          }
        }>
          <RiGoogleFill className="mr-2 h-4 w-4" />
          Google
        </Button>

        <span className="text-gray-500 text-center text-sm">
          Don{`'`}t have an account? {" "}
          <Link
            href="/signup"
            className="underline underline-offset-4 hover:text-primary "
          >
            Sign up
          </Link>
        </span>
      </div>
    </div>
  )
};

export default LoginForm;
