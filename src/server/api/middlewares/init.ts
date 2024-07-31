import { Audit } from "@/server/audit";
import { db } from "@/server/db";
import { createMiddleware } from "hono/factory";
import { getConnInfo } from "hono/vercel";

export const initMiddleware = () =>
  createMiddleware(async (c, next) => {
    const req = c.req;
    const info = getConnInfo(c);

    c.set("services", { db, audit: Audit });

    c.set("info", {
      requestIp: info.remote.address ?? "Unknown IP",
      userAgent: req.header("User-Agent") || "",
    });

    await next();
  });
