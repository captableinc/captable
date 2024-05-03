import { JWT_SECRET } from "@/server/auth";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const encode = async (data: JWTPayload) => {
  return await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .sign(JWT_SECRET);
};

export const decode = async (data: string) => {
  return await jwtVerify(data, JWT_SECRET);
};
