import {
  type BinaryLike,
  randomBytes,
  scrypt,
  subtle,
  timingSafeEqual,
} from "node:crypto";
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

const scryptAsync = (
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
};

export const createSecureHash = async (secret: string) => {
  const data = new TextEncoder().encode(secret);
  const salt = randomBytes(32).toString("hex");
  const derivedKey = await scryptAsync(data, salt, 64);

  return `${salt}:${derivedKey.toString("hex")}`;
};

export const verifySecureHash = async (secret: string, hash: string) => {
  try {
    const data = new TextEncoder().encode(secret);
    const [salt, storedHash] = hash.split(":");

    const derivedKey = await scryptAsync(data, salt ?? "", 64);

    const derivedKeyBuffer = Buffer.from(derivedKey);
    const storedHashBuffer = Buffer.from(storedHash ?? "", "hex");
    return timingSafeEqual(derivedKeyBuffer, storedHashBuffer);
  } catch (_error) {
    return false;
  }
};
