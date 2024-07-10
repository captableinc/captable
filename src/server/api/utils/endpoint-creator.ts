import {
  createRoute as OpenApiCreateRoute,
  type createRoute as OpenApiCreateRouteType,
  type RouteHandler,
} from "@hono/zod-openapi";
import { ErrorResponses } from "../error";
import type { HonoEnv } from "../hono";

type RouteConfig = Parameters<typeof OpenApiCreateRouteType>[0];

type Version = "v1" | "v2";

const createApi = <V extends Version>(_version: V) => {
  const createRoute = <
    T extends Omit<RouteConfig, "path">,
    P extends `/${V}/${string}`,
    U extends T & { path: P },
  >(
    routeConfig: U,
  ) => {
    const updatedRouteConfig: U = {
      ...routeConfig,
      responses: {
        ...(routeConfig?.responses && { ...routeConfig.responses }),
        ...ErrorResponses,
      },
    };

    const route = OpenApiCreateRoute<P, U>(updatedRouteConfig);

    const handler = <R extends typeof route>(
      callback: RouteHandler<R, HonoEnv>,
    ) => ({
      handler: callback,
      route: route,
    });

    return { handler };
  };

  return { createRoute };
};

export const v1Api = createApi("v1");
