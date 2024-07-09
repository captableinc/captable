import {
  createRoute as OpenApiCreateRoute,
  type createRoute as OpenApiCreateRouteType,
  type RouteHandler,
} from "@hono/zod-openapi";
import { ErrorResponses } from "../error";
import type { HonoEnv } from "../hono";

type RouteConfig = Parameters<typeof OpenApiCreateRouteType>[0];

type versions = "v1" | "v2";

const createApi = (version: versions) => {
  const createRoute = <
    T extends Omit<RouteConfig, "path">,
    P extends string,
    U extends T & { path: P },
  >(
    routeConfig: U,
  ) => {
    const route = OpenApiCreateRoute<P, U>({
      ...routeConfig,
      path: `/${version}${routeConfig.path}`,
      responses: {
        ...(routeConfig?.responses && { ...routeConfig.responses }),
        ...ErrorResponses,
      },
    });

    const handler = <R extends typeof route>(
      callback: RouteHandler<R, HonoEnv>,
    ) => {
      return { handler: callback, route: route };
    };

    return { handler };
  };

  return { createRoute };
};

export const v1Api = createApi("v1");
