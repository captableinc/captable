import { randomBytes, scrypt, subtle } from "node:crypto";

export const createHash = async (key: string) => {
  const data = new TextEncoder().encode(key);
  const hash = await subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toString();
};

export const createApiSecret = async () => {
  return await randomBytes(32).toString("hex");
};

export const createSecureHash = async (key: string) => {
  const data = new TextEncoder().encode(key);

  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString("hex");

    scrypt(data, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
};

export const verifySecureHash = async (key: string, hash: string) => {
  const data = new TextEncoder().encode(key);

  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    scrypt(data, String(salt), 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString("hex"));
    });
  });
};
