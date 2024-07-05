import { env } from "@/env";
import { handleError } from "@/server/api/error";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";

/**
 * Initializes and configures the public API.
 *
 * This function sets up the public API using OpenAPIHono, including error handling,
 * OpenAPI documentation, and the Swagger UI.
 *
 * @returns {OpenAPIHono} The configured API instance.
 */
export function PublicAPI() {
  const api = new OpenAPIHono().basePath("/api");
  api.onError(handleError);

  /**
   * Provides the OpenAPI schema for the API.
   *
   * @route GET /v1/schema
   * @group Documentation
   * @description This route returns the OpenAPI schema for the Captable, Inc. API.
   * @returns {object} 200 - The OpenAPI schema
   * @returns {Error}  default - Unexpected error
   */
  api.doc("/v1/schema", () => ({
    openapi: "3.0.0",
    info: {
      version: "v1",
      title: "Captable, Inc. API",
    },
    servers: [{ url: `${env.NEXTAUTH_URL}/api` }],
  }));

  api.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
    type: "http",
    scheme: "bearer",
  });

  api.get("/v1/swagger", swaggerUI({ url: "/api/v1/schema" }));
  return api;
}

export type PublicAPI = ReturnType<typeof PublicAPI>;
