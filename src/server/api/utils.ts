import type { Context, HonoRequest } from "hono";

function escapeUnicode(str: string) {
  //  biome-ignore lint/style/useTemplate lint/suspicious/noExplicitAny: <fine here>
  return str.replace(
    /[^\0-~]/g,
    (ch: any) => "\\u" + ("0000" + ch.charCodeAt().toString(16)).slice(-4),
  );
}

function removeTrailingCommas(str: string) {
  return str.replace(/,\s*([}\]])/g, "$1");
}

export async function getParsedJson(c: Context) {
  const body = await c.req.parseBody();
  const key = Object.keys(body)[0] as string;
  const escaped = escapeUnicode(key);
  const removed = removeTrailingCommas(escaped);
  return await JSON.parse(removed);
}

export const getIp = (req: HonoRequest) => {
  return (
    req.header("x-forwarded-for") || req.header("remoteAddr") || "Unknown IP"
  );
};
