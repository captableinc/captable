export const runtime = "edge";
import { api } from "@/server/api";
import { handle } from "hono/vercel";

export const GET = handle(api);
export const POST = handle(api);
export const PUT = handle(api);
export const DELETE = handle(api);
