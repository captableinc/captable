import { createHash, timingSafeEqual } from "node:crypto";
import { customAlphabet } from "nanoid";

const customId = customAlphabet(
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
  24,
);
const SEPARATOR = "_";
const PREFIX = "cap";

export class ApiKey {
  static isApiKey(key: string): boolean {
    const doesStartWithPrefix = key.startsWith(PREFIX + SEPARATOR);

    return doesStartWithPrefix;
  }
  static generateKey() {
    const key = [PREFIX, customId()].join(SEPARATOR);
    const partialKey = `${key.slice(0, 3)}...${key.slice(-4)}`;
    return { key, partialKey };
  }

  public generateHash(key: string) {
    return this.sha256Hash(key);
  }

  public verifyHash(hash: string, password: string) {
    const hashBuffer = Buffer.from(hash);
    const passwordBuffer = Buffer.from(this.sha256Hash(password));
    try {
      return timingSafeEqual(hashBuffer, passwordBuffer);
    } catch (_e) {
      return false;
    }
  }

  private sha256Hash(key: string) {
    const hash = createHash("sha256");
    hash.update(key);
    return hash.digest("hex");
  }
}
