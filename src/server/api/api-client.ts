import { env } from "@/env";
import type {
  RouteConfigToTypedResponse,
  createRoute,
  z,
} from "@hono/zod-openapi";

import ky from "ky";

const api = ky.create({
  cache: "no-cache",
});

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type ExtractParams<T> = T extends { params: z.ZodType<any, any, any> }
  ? z.infer<T["params"]>
  : never;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type ExtractQuery<T> = T extends { query: z.ZodType<any, any, any> }
  ? z.infer<T["query"]>
  : never;

type ExtractRequestBody<T> = T extends {
  body: {
    content: {
      "application/json": {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        schema: z.ZodType<any, any, any>;
      };
    };
  };
}
  ? z.infer<T["body"]["content"]["application/json"]["schema"]>
  : never;

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type IfNever<T, Obj> = [T] extends [never] ? {} : Obj;

export type APIClientParams<T extends RouteConfig> = IfNever<
  ExtractParams<T["request"]>,
  { urlParams: ExtractParams<T["request"]> }
> &
  IfNever<
    ExtractQuery<T["request"]>,
    { searchParams: ExtractQuery<T["request"]> }
  > &
  IfNever<
    ExtractRequestBody<T["request"]>,
    { json: ExtractRequestBody<T["request"]> }
  >;

type RouteConfig = Parameters<typeof createRoute>[0];

export function createClient<
  T extends Omit<RouteConfig, "path">,
  P extends string,
  U extends T & { path: P },
>(handler: U, params: APIClientParams<U>) {
  const path = interpolatePath(
    `${env.NEXT_PUBLIC_BASE_URL}/api${handler.path}`,
    "urlParams" in params ? params.urlParams : {},
  );

  const req = api(path, {
    method: handler.method,
    ...("json" in params && { json: params.json }),
    ...("searchParams" in params && { searchParams: params.searchParams }),
  });
  handler.request?.body;
  return req.json<RouteConfigToTypedResponse<U>["_data"]>();
}

function interpolatePath(
  path: string,
  params: Record<string, string | number>,
): string {
  return path.replace(/{([^}]+)}/g, (_, key) =>
    encodeURIComponent(String(params[key])),
  );
}
