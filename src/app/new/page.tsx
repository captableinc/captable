import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { getServerAuthSession } from "@/server/auth";
import {
  RiCheckboxCircleFill as CheckIcon,
  RiGoogleFill as GoogleIcon,
} from "@remixicon/react";

import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import LoginWithGoogle from "./components/LoginWithGoogle";

export default async function CapPage() {
  if (env.NEXT_PUBLIC_BASE_URL !== "https://cloud.captable.inc") {
    // if (env.NEXT_PUBLIC_BASE_URL !== "http://localhost:3000") {
    return notFound();
  }

  const session = await getServerAuthSession();

  if (session?.user) {
    return redirect("/onboarding");
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <div className="grid w-full max-w-lg grid-cols-1 gap-5 rounded-xl border bg-white/10 p-10 shadow-sm hover:shadow-md">
        <h3 className="-mt-5">
          cap.<span className="text-2xl text-gray-600">new</span>
        </h3>
        <ul>
          <li className="mb-1">
            <CheckIcon className="inline-block w-5 h-5 mb-1 text-green-500" />
            <span className="ml-2">Manage your Cap table, issue options</span>
          </li>
          <li className="mb-1">
            <CheckIcon className="inline-block w-5 h-5 mb-1 text-green-500" />
            <span className="ml-2">
              Collaborate with investors with Data rooms
            </span>
          </li>
          <li className="mb-1">
            <CheckIcon className="inline-block w-5 h-5 mb-1 text-green-500" />
            <span className="ml-2">eSign NDAs, SAFEs and other documents</span>
          </li>
          <li className="mb-1">
            <CheckIcon className="inline-block w-5 h-5 mb-1 text-green-500" />
            <span className="ml-2">
              Delight your investors by sending updates
            </span>
          </li>
        </ul>
        <span className="text-xl">Login to get started</span>
        <LoginWithGoogle />
      </div>
    </div>
  );
}
