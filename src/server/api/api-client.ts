import { env } from "@/env";
import type {
  RouteConfigToTypedResponse,
  createRoute,
  z,
} from "@hono/zod-openapi";

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
  > & {
    headers?: Headers;
  };

type RouteConfig = Parameters<typeof createRoute>[0];

export async function createClient<U extends RouteConfig>(
  method: U["method"],
  url: U["path"],
  params: APIClientParams<U>,
) {
  const path = buildPath(url, params);
  const headers = buildHeaders(params.headers);
  const requestOptions = buildRequestOptions(method, headers, params);

  const response = await fetch(path, requestOptions);

  return response.json() as RouteConfigToTypedResponse<U>["_data"];
}

function interpolatePath(
  path: string,
  params: Record<string, string | number>,
): string {
  return path.replace(/{([^}]+)}/g, (_, key) =>
    encodeURIComponent(String(params[key])),
  );
}

function buildHeaders(customHeaders?: HeadersInit): Headers {
  const headers = new Headers(customHeaders);
  headers.set("Content-Type", "application/json");
  return headers;
}

function buildPath<U extends RouteConfig>(
  url: string,
  params: APIClientParams<U>,
): string {
  let path = interpolatePath(
    `${"http://localhost:3000"}/api${url}`,
    "urlParams" in params ? params.urlParams : {},
  );

  if ("searchParams" in params) {
    const queryString = new URLSearchParams(params.searchParams).toString();
    path += `?${queryString}`;
  }

  return path;
}

function buildRequestOptions<U extends RouteConfig>(
  method: string,
  headers: Headers,
  params: APIClientParams<U>,
): RequestInit {
  const requestOptions: RequestInit = {
    method: method.toUpperCase(),
    credentials: "include",
    headers,
    cache: "no-store",
  };

  if ("json" in params) {
    requestOptions.body = JSON.stringify(params.json);
  }

  return requestOptions;
}
