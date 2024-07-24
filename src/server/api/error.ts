import { logger } from "@/lib/logger";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { StatusCode } from "hono/utils/http-status";
import type { ZodError } from "zod";

import { z } from "@hono/zod-openapi";

const log = logger.child({ module: "api-error" });

const ErrorCode = z.enum([
  "BAD_REQUEST",
  "FORBIDDEN",
  "INTERNAL_SERVER_ERROR",
  "NOT_FOUND",
  "NOT_UNIQUE",
  "RATE_LIMITED",
  "UNAUTHORIZED",
  "METHOD_NOT_ALLOWED",
]);

export type ErrorCodeType = z.infer<typeof ErrorCode>;

function errorSchemaFactory(code: z.ZodEnum<[z.infer<typeof ErrorCode>]>) {
  return z.object({
    error: z.object({
      code: code.openapi({
        description: "A machine readable error code.",
        example: code._def.values.at(0),
      }),

      message: z.string().openapi({
        description: "A human readable explanation of what went wrong",
      }),
    }),
  });
}

export const ErrorSchema = z.object({
  error: z.object({
    code: ErrorCode,

    message: z.string(),
  }),
});

interface generateErrorResponseOptions {
  description: string;
  status: StatusCode;
}

const errorRegistryMap: Record<z.infer<typeof ErrorCode>, string> = {
  BAD_REQUEST: "ErrBadRequest",
  FORBIDDEN: "ErrForbidden",
  INTERNAL_SERVER_ERROR: "ErrInternalServerError",
  RATE_LIMITED: "ErrRateLimited",
  METHOD_NOT_ALLOWED: "ErrMethodNotAllowed",
  NOT_FOUND: "ErrNotFound",
  NOT_UNIQUE: "ErrNotUnique",
  UNAUTHORIZED: "ErrUnauthorized",
};

const generateErrorResponse = (options: generateErrorResponseOptions) => {
  const { description, status } = options;
  return {
    [status]: {
      content: {
        "application/json": {
          schema: errorSchemaFactory(z.enum([statusToCode(status)])).openapi(
            errorRegistryMap[statusToCode(status)],
          ),
        },
      },
      description,
    },
  };
};

export const ErrorResponses: ReturnType<typeof generateErrorResponse> = {
  ...generateErrorResponse({
    status: 400,
    description: "Bad Request",
  }),
  ...generateErrorResponse({
    status: 401,
    description: "Unauthorized",
  }),
  ...generateErrorResponse({
    status: 404,
    description: "Not found",
  }),
  ...generateErrorResponse({
    status: 429,
    description: "Rate Limited",
  }),
  ...generateErrorResponse({
    status: 500,
    description: "Internal Server Error",
  }),
};

function codeToStatus(code: z.infer<typeof ErrorCode>): StatusCode {
  switch (code) {
    case "BAD_REQUEST":
      return 400;
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "METHOD_NOT_ALLOWED":
      return 405;
    case "NOT_UNIQUE":
      return 409;
    case "RATE_LIMITED":
      return 429;
    case "INTERNAL_SERVER_ERROR":
      return 500;
  }
}

function statusToCode(status: StatusCode): z.infer<typeof ErrorCode> {
  switch (status) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 405:
      return "METHOD_NOT_ALLOWED";
    case 409:
      return "NOT_UNIQUE";
    case 429:
      return "RATE_LIMITED";
    case 500:
      return "INTERNAL_SERVER_ERROR";
    default:
      return "INTERNAL_SERVER_ERROR";
  }
}

export function parseZodErrorMessage(err: z.ZodError): string {
  try {
    const arr = JSON.parse(err.message) as {
      message: string;
      path: Array<string>;
    }[];
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const { path, message } = arr[0]!;
    return `${path.join(".")}: ${message}`;
  } catch {
    return err.message;
  }
}

export function handleZodError(
  result:
    | {
        success: true;
        data: unknown;
      }
    | {
        success: false;
        error: ZodError;
      },
  c: Context,
) {
  if (!result.success) {
    return c.json<z.infer<typeof ErrorSchema>>(
      {
        error: {
          code: "BAD_REQUEST",
          message: parseZodErrorMessage(result.error),
        },
      },
      { status: 400 },
    );
  }
}

export class ApiError extends HTTPException {
  public readonly code: z.infer<typeof ErrorCode>;

  constructor({
    code,
    message,
  }: {
    code: z.infer<typeof ErrorCode>;
    message: string;
  }) {
    super(codeToStatus(code), { message });
    this.code = code;
  }
}

export function handleError(err: Error, c: Context): Response {
  if (err instanceof ApiError) {
    if (err.status >= 500) {
      log.error("ApiError", {
        name: err.name,
        code: err.code,
        status: err.status,
      });
    }
    return c.json(
      {
        error: {
          code: err.code,
          message: err.message,
        },
      },
      { status: err.status },
    );
  }

  if (err instanceof HTTPException) {
    if (err.status >= 500) {
      log.error("HTTPException", {
        name: err.name,
        status: err.status,
        message: err.message,
      });
    }
    const code = statusToCode(err.status);
    return c.json(
      {
        error: {
          code,
          message: err.message,
        },
      },
      { status: err.status },
    );
  }

  /**
   * This is a generic error, we should log it and return a 500
   */

  log.error("UnhandledError", {
    name: err.name,
    message: err.message,
    cause: err.cause,
    stack: err.stack,
  });

  return c.json(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong, our engineers have been notified.",
      },
    },
    { status: 500 },
  );
}

export const companyNotFound = () => {
  throw new ApiError({
    code: "NOT_FOUND",
    message: "Company not found",
  });
};
