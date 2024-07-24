import { createHash, timingSafeEqual } from "node:crypto";
import { customAlphabet } from "nanoid";

const customId = customAlphabet(
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
  24,
);
const SEPARATOR = "_";

type TPrefix = "api";

const generateKey = (prefix: TPrefix) => {
  const key = [prefix, customId()].join(SEPARATOR);
  const partialKey = `${key.slice(0, 3)}...${key.slice(-4)}`;
  return { key, partialKey };
};

export const generateApiKey = () => generateKey("api");

export const hashKey = (key: string) => {
  const hash = createHash("sha256");
  hash.update(key);
  return hash.digest("hex");
};

export const verifyKey = (password: string, hash: string) => {
  const hashBuffer = Buffer.from(hash);
  const passwordBuffer = Buffer.from(hashKey(password));
  try {
    return timingSafeEqual(hashBuffer, passwordBuffer);
  } catch (_e) {
    return false;
  }
};
