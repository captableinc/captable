"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@captable/auth/client";
import { RiGoogleFill as GoogleIcon } from "@remixicon/react";

async function signInWithGoogle() {
  await signIn.social({
    provider: "google",
    callbackURL: "/onboarding",
  });
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
