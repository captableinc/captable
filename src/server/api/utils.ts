import type { HonoRequest } from "hono";

export const getIp = (req: HonoRequest) => {
  return (
    req.header("x-forwarded-for") || req.header("remoteAddr") || "Unknown IP"
  );
};

export const getHonoUserAgent = (req: HonoRequest) => {
  return req.header("User-Agent") || "";
};
