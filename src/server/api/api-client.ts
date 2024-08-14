import { env } from "@/env";
import { hc } from "hono/client";
import type { APIType } from ".";

export const apiClient = hc<APIType>(env.NEXT_PUBLIC_BASE_URL, {
  init: {
    cache: "no-cache",
  },
});
