import { env } from "@/env";
import { handleError, handleZodError } from "@/server/api/error";
import type { TPrisma } from "@/server/db";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { Audit } from "../audit";
import type { checkMembership } from "../auth";
import { SECURITY_SCHEME_NAME } from "./const";

declare module "hono" {
  interface ContextVariableMap {
    services: {
      db: TPrisma;
      audit: typeof Audit;
      client: {
        requestIp: string;
        userAgent: string;
      };
    };
    session: {
      membership: Awaited<ReturnType<typeof checkMembership>>;
    };
  }
}

export function PublicAPI() {
  const api = new OpenAPIHono({
    defaultHook: handleZodError,
  }).basePath("/api");

  api.onError(handleError);

  api.doc("/v1/schema", () => ({
    openapi: "3.1.0",
    info: {
      version: "v1",
      title: "Captable, Inc. API (v1)",
    },
    servers: [{ url: `${env.NEXTAUTH_URL}` }],
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
