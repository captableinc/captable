import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { env } from "@/env";
import type { AppRouter } from "@/trpc/api/root";
import {
  QueryClient,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";

export const transformer = superjson;

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return env.NEXT_PUBLIC_BASE_URL;
}

export function getUrl() {
  const baseUrl = getBaseUrl();
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

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        serializeData: transformer.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: transformer.deserialize,
      },
    },
  });
}
