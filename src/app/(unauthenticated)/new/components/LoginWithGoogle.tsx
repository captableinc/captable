"use client";

import { Button } from "@/components/ui/button";
import { RiGoogleFill as GoogleIcon } from "@remixicon/react";
import { signIn } from "next-auth/react";

async function signInWithGoogle() {
  await signIn("google", { callbackUrl: "/onboarding" });
}

const LoginWithGoogle = () => {
  return (
    <Button
      type="button"
      size="xl"
      onClick={signInWithGoogle}
      className="rounded-xl"
    >
      <GoogleIcon className="mr-2 h-6 w-6" />
      <span className="text-lg">
        Continue with <span className="font-bold">Google</span>
      </span>
    </Button>
  );
};

export default LoginWithGoogle;
