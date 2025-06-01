import { env } from "@/env";
import { serverSideSession } from "@captable/auth/server";
import { RiCheckboxCircleFill as CheckIcon } from "@remixicon/react";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import LoginWithGoogle from "./components/LoginWithGoogle";

export default async function CapPage() {
  if (
    process.env.NEXT_PUBLIC_BASE_URL &&
    !process.env.NEXT_PUBLIC_BASE_URL.includes("captable.inc")
  ) {
    return notFound();
  }

  try {
    const session = await serverSideSession({ headers: await headers() });

    if (session?.user) {
      return redirect("/company/new");
    }
  } catch (_error) {
    // No session, continue to the page
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="grid w-full max-w-lg grid-cols-1 gap-5 rounded-xl border bg-card/10 p-10 shadow-sm hover:shadow-md">
        <h3 className="-mt-5">
          cap.<span className="text-2xl text-muted-foreground">new</span>
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
