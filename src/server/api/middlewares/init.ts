import { Audit } from "@/server/audit";
import { db } from "@/server/db";
import type { Middleware } from "../hono";
import { getHonoUserAgent, getIp } from "../utils";

export function initMiddleware(): Middleware {
  return async (c, next) => {
    const req = c.req;

    c.set("services", { db, audit: Audit });

    c.set("info", {
      requestIp:
        req.header("x-forwarded-for") ||
        req.header("remoteAddr") ||
        "Unknown IP",
      userAgent: req.header("User-Agent") || "",
    });

    await next();
  };
}
