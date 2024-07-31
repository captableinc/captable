import {
  createRoute as OpenApiCreateRoute,
  type createRoute as OpenApiCreateRouteType,
  type RouteHandler,
  z,
} from "@hono/zod-openapi";
import { some } from "hono/combine";
import { ErrorResponses } from "../error";

import type { Env } from "hono";

import {
  accessTokenAuthMiddleware,
  type accessTokenAuthMiddlewareOptions,
} from "../middlewares/access-token-auth-middleware";
import { sessionCookieAuthMiddleware } from "../middlewares/session-cookie-auth-middleware";

type RouteConfig = Parameters<typeof OpenApiCreateRouteType>[0];

export const SECURITY_SCHEME_NAME = "Bearer";

type Version = "v1" | "v2";

const ZAuthHeader = z.object({
  authorization: z
    .string()
    .regex(/^Bearer [a-zA-Z0-9_]+/)
    .openapi({
      description: "A key to authorize the request",
      example: "Bearer cap_1234",
    }),
});

type AuthHeaders = {
  headers: typeof ZAuthHeader;
};

const createApi = <V extends Version, L extends boolean>(
  _version: V,
  authRequired?: L,
) => {
  const createRoute = <
    T extends Omit<RouteConfig, "path">,
    P extends `/${V}/${string}`,
    U extends T & { path: P },
  >(
    routeConfig: U,
  ) => {
    type Request = Omit<U["request"], "headers"> & AuthHeaders;

    const request = {
      ...(routeConfig?.request && { ...routeConfig?.request }),
      ...(authRequired && {
        headers: routeConfig.request?.headers
          ? // @ts-expect-error
            ZAuthHeader.merge(routeConfig.request.headers)
          : ZAuthHeader,
      }),
    } as Request;

    const updatedRouteConfig: U = {
      ...routeConfig,
      ...(authRequired
        ? {
            security: [
              {
                [SECURITY_SCHEME_NAME]: [],
              },
            ],
          }
        : {}),
      request,
      responses: {
        ...(routeConfig?.responses && { ...routeConfig.responses }),
        ...ErrorResponses,
      },
    };

    const route = OpenApiCreateRoute<P, U>(updatedRouteConfig);

    const handler = <R extends typeof route>(
      callback: RouteHandler<R, Env>,
    ) => ({
      handler: callback,
      route: route,
    });

    return { handler };
  };

  return { createRoute };
};

export const authMiddleware = (option?: accessTokenAuthMiddlewareOptions) =>
  some(accessTokenAuthMiddleware(option), sessionCookieAuthMiddleware());

export const ApiV1 = createApi("v1");

export const withAuthApiV1 = createApi("v1", true);
