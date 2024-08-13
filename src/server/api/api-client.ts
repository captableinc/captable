import { env } from "@/env";
import { hc } from "hono/client";
import type { APIType } from ".";

export const apiClient = hc<APIType>(env.NEXTAUTH_URL, {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      cache: "no-cache",
    }),
});
