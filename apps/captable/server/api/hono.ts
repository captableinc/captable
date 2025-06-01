import { env } from "@/env";
import { handleError, handleZodError } from "@/server/api/error";
import type { Audit } from "@/server/audit";
import type { checkMembership } from "@/server/member";
import type { DB } from "@captable/db";
import { OpenAPIHono } from "@hono/zod-openapi";
import { SECURITY_SCHEME_NAME } from "./const";

declare module "hono" {
  interface ContextVariableMap {
    services: {
      db: DB;
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
    servers: [{ url: `${process.env.NEXT_PUBLIC_BASE_URL}` }],
  }));

  api.openAPIRegistry.registerComponent(
    "securitySchemes",
    SECURITY_SCHEME_NAME,
    {
      type: "http",
      scheme: "bearer",
    },
  );

  return api;
}

export type PublicAPI = ReturnType<typeof PublicAPI>;
