import { env } from "@/env";
import {
  type JWTPayload,
  type JWTVerifyResult,
  SignJWT,
  jwtVerify,
} from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.BETTER_AUTH_SECRET ?? "secret",
);

export const encode = async (data: JWTPayload) => {
  return await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .sign(JWT_SECRET);
};

export const decode = async (data: string) => {
  return await jwtVerify(data, JWT_SECRET);
};

export type { JWTPayload, JWTVerifyResult };
