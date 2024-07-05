import { randomBytes, scryptSync, subtle } from "node:crypto";

export const createHash = async (key: string) => {
  const data = new TextEncoder().encode(key);
  const hash = await subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toString();
};

export const createApiToken = async () => {
  return await randomBytes(32).toString("base64url");
};

export const createSecureHash = (key: string) => {
  const data = new TextEncoder().encode(key);
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(data, salt, 64);

  return `${salt}:${derivedKey.toString("hex")}`;
};

export const verifySecureHash = (key: string, hash: string) => {
  const data = new TextEncoder().encode(key);
  const [salt, storedHash] = hash.split(":");
  const derivedKey = scryptSync(data, String(salt), 64);

  return storedHash === derivedKey.toString("hex");
};
