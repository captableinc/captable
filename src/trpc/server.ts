import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";

import { cookies } from "next/headers";
import { appRouter } from "./api/root";
import { createCallerFactory, createTRPCContext } from "./api/trpc";
import { makeQueryClient } from "./shared";

const createContext = cache(() => {
  return createTRPCContext({
    headers: new Headers({
      cookie: cookies().toString(),
      "x-trpc-source": "rsc",
    }),
  });
});

export const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(appRouter)(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<
  typeof appRouter
>(caller, getQueryClient);
