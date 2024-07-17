import { customAlphabet } from "nanoid";

const customId = customAlphabet(
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
  16,
);
const SEPARATOR = "_";
const PREFIX = "cap";

export class ApiKey {
  public isApiKey(key: string): boolean {
    const doesStartWithPrefix = key.startsWith(PREFIX + SEPARATOR);

    return doesStartWithPrefix;
  }
  public generateKey(): string {
    return [PREFIX, customId()].join(SEPARATOR);
  }
}
