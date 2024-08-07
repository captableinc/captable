import { randomBytes, scryptSync, subtle } from "node:crypto";
import { customId } from "@/common/id";

export const createHash = async (key: string) => {
  const data = new TextEncoder().encode(key);
  const hash = await subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toString();
};

export const initializeAccessToken = ({
  prefix = "api",
}: { prefix?: string }) => {
  const clientId = `${prefix}_${customId(8)}`;
  const clientSecret = randomBytes(24)
    .toString("base64url")
    .replace(/[+/=_-]/g, customId(1));

  return {
    clientId,
    clientSecret,
  };
};

export const createSecureHash = (secret: string) => {
  const data = new TextEncoder().encode(secret);
  const salt = randomBytes(32).toString("hex");
  const derivedKey = scryptSync(data, salt, 64);

  return `${salt}:${derivedKey.toString("hex")}`;
};

export const verifySecureHash = (secret: string, hash: string) => {
  const data = new TextEncoder().encode(secret);
  const [salt, storedHash] = hash.split(":");
  const derivedKey = scryptSync(data, String(salt), 64);

  return storedHash === derivedKey.toString("hex");
};
