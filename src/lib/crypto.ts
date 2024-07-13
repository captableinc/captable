import crypto from "node:crypto";

// Utility function to hash the key using SHA-256
function hashKey(key: string) {
  return crypto.createHash("sha256").update(key).digest();
}

// Utility function to generate a random nonce
function generateNonce() {
  return crypto.randomBytes(12);
}

/**
 *
 * @param text Value to be encrypted
 * @param key Key used to encrypt value must be 32 bytes for AES256 encryption algorithm
 *
 * @returns Encrypted value using key
 */
export type EncryptedOptions = {
  key: string;
  data: string;
};

export function Encrypted({ key, data }: EncryptedOptions) {
  const keyAsBytes = hashKey(key);
  const dataAsBytes = Buffer.from(data, "utf8");
  const nonce = generateNonce();

  const cipher = crypto.createCipheriv("chacha20-poly1305", keyAsBytes, nonce, {
    authTagLength: 16,
  });

  let encrypted = cipher.update(dataAsBytes);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const authTag = cipher.getAuthTag();
  const result = Buffer.concat([nonce, encrypted, authTag]);

  return result.toString("hex");
}

/**
 *
 * @param text Value to decrypt
 * @param key Key used to decrypt value must be 32 bytes for AES256 encryption algorithm
 */
export type DecryptedOptions = {
  key: string;
  data: string;
};
export function Decrypted({ key, data }: DecryptedOptions) {
  const keyAsBytes = hashKey(key);
  const dataAsBytes = Buffer.from(data, "hex");

  const nonce = dataAsBytes.slice(0, 12);
  const encrypted = dataAsBytes.slice(12, -16);
  const authTag = dataAsBytes.slice(-16);

  const decipher = crypto.createDecipheriv(
    "chacha20-poly1305",
    keyAsBytes,
    nonce,
    {
      authTagLength: 16,
    },
  );

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString("utf8");
}

export const createHash = async (key: string) => {
  const data = new TextEncoder().encode(key);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toString();
};

export const createApiToken = () => {
  return crypto.randomBytes(32).toString("base64url");
};

export const createSecureHash = (key: string) => {
  const data = new TextEncoder().encode(key);
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(data, salt, 64);

  return `${salt}:${derivedKey.toString("hex")}`;
};

export const verifySecureHash = (key: string, hash: string) => {
  const data = new TextEncoder().encode(key);
  const [salt, storedHash] = hash.split(":");
  const derivedKey = crypto.scryptSync(data, String(salt), 64);

  return storedHash === derivedKey.toString("hex");
};
