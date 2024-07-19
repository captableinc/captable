import { env } from "@/env";
import type { Roles } from "@/prisma/enums";
import { handleError, handleZodError } from "@/server/api/error";
import type { TPrisma } from "@/server/db";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { Context as GenericContext, MiddlewareHandler } from "hono";
import { SECURITY_SCHEME_NAME } from "./const";

type TMembership = {
  role: Roles | null;
  customRoleId: string | null;
  companyId: string;
  memberId: string;
};

export type HonoEnv = {
  Bindings: {
    NODE_ENV: (typeof env)["NODE_ENV"];
  };

  Variables: {
    db: TPrisma;
    membership: TMembership;
  };
};

export function PublicAPI() {
  const api = new OpenAPIHono<HonoEnv>({
    defaultHook: handleZodError,
  }).basePath("/api");

  api.onError(handleError);

  api.doc("/v1/schema", () => ({
    openapi: "3.0.0",
    info: {
      version: "v1",
      title: "Captable, Inc. API",
    },
    servers: [{ url: `${env.NEXTAUTH_URL}/api` }],
  }));

  api.openAPIRegistry.registerComponent(
    "securitySchemes",
    SECURITY_SCHEME_NAME,
    {
      type: "http",
      scheme: "bearer",
    },
  );

  api.get("/v1/swagger", swaggerUI({ url: "/api/v1/schema" }));
  return api;
}

export type PublicAPI = ReturnType<typeof PublicAPI>;
export type Context = GenericContext<HonoEnv>;
export type Middleware = MiddlewareHandler<HonoEnv>;
