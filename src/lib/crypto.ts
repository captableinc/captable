import { scrypt, subtle } from "node:crypto";
import { constantTimeEqual } from "./buffer";
import { decodeHex, encodeHex } from "./hex";

export const createHash = async (key: string) => {
  const data = new TextEncoder().encode(key);
  const hash = await subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toString();
};

interface createSecureHashOptions {
  N?: number;
  r?: number;
  p?: number;
  dkLen?: number;
}
/// credits https://github.com/pilcrowOnPaper/oslo/blob/main/src/password/scrypt.ts
export function createSecureHash({
  N = 16384,
  dkLen = 64,
  p = 1,
  r = 16,
}: Partial<createSecureHashOptions>) {
  async function hash(password: string) {
    const salt = encodeHex(crypto.getRandomValues(new Uint8Array(16)));
    const key = await generateKey(password, salt);
    return `${salt}:${encodeHex(key)}`;
  }

  async function verify(hash: string, password: string) {
    const [salt, key] = hash.split(":");
    const targetKey = await generateKey(password, salt ?? "");
    return constantTimeEqual(targetKey, decodeHex(key ?? ""));
  }

  async function generateKey(
    password: string,
    salt: string,
  ): Promise<ArrayBuffer> {
    return await new Promise<ArrayBuffer>((resolve, reject) => {
      scrypt(
        password.normalize("NFKC"),
        salt,
        dkLen,
        {
          N: N,
          p: p,
          r: r,
          // errors when 128 * N * r > `maxmem` (approximately)
          maxmem: 128 * N * r * 2,
        },
        (err, buff) => {
          if (err) return reject(err);
          return resolve(buff);
        },
      );
    });
  }

  return {
    hash,
    verify,
  };
}
