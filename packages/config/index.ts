import { customAlphabet } from "nanoid";

/**
 * Generates a unique public ID for entities
 * @returns A random ID string
 */
export function generatePublicId(): string {
  const nanoid = customAlphabet("123456789abcdefghijklmnopqrstuvwxyz", 10);
  return nanoid();
}
