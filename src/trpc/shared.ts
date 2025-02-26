import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { env } from "@/env";
import type { AppRouter } from "@/trpc/api/root";

export const transformer = superjson;

function getBaseUrl() {
  if (typeof window !== "undefined") {
    // In the browser, return an empty string (relative URL)
    console.log("[TRPC] Using browser relative URL");
    return "";
  }

  // In server-side code, use the environment variable
  if (env.NEXT_PUBLIC_BASE_URL) {
    console.log("[TRPC] Using NEXT_PUBLIC_BASE_URL:", env.NEXT_PUBLIC_BASE_URL);
    return env.NEXT_PUBLIC_BASE_URL;
  }

  // Fallback for Vercel deployments
  if (process.env.VERCEL_URL) {
    console.log(
      "[TRPC] Using VERCEL_URL:",
      `https://${process.env.VERCEL_URL}`,
    );
    return `https://${process.env.VERCEL_URL}`;
  }

  // Local development fallback
  console.log("[TRPC] Using default localhost URL");
  return "http://localhost:3000";
}

export function getUrl() {
  const baseUrl = getBaseUrl();
  console.log("[TRPC] Final API URL:", `${baseUrl}/api/trpc`);
  return `${baseUrl}/api/trpc`;
}

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
