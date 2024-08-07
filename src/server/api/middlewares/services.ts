import { Audit } from "@/server/audit";
import { db } from "@/server/db";
import { createMiddleware } from "hono/factory";
import { getConnInfo } from "hono/vercel";

export const middlewareServices = () =>
  createMiddleware(async (c, next) => {
    const req = c.req;
    const info = getConnInfo(c);
    const client = {
      requestIp: info.remote.address ?? "Unknown IP",
      userAgent: req.header("User-Agent") || "",
    };

    c.set("services", { db, audit: Audit, client });

    await next();
  });
