import crypto from "node:crypto";

// Utility function to hash the key using SHA-256
function hashKey(key: string) {
  return crypto.createHash("sha256").update(key).digest();
}

// Utility function to generate a random nonce
function generateNonce() {
  return crypto.randomBytes(12);
}

export type EncryptedOptions = {
  key: string;
  data: string;
};

/**
 * Encrypts the given data using the provided key and the ChaCha20-Poly1305 algorithm.
 *
 * @param key Key used to encrypt the data. The key must be a string that will be hashed to 32 bytes.
 * @param data Data to be encrypted.
 * @returns Encrypted data as a hex string.
 */
export function Encrypted({ key, data }: EncryptedOptions): string {
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

  // console.log("Encryption successful");
  // console.log(`Nonce: ${nonce.toString("hex")}`);
  // console.log(`Auth Tag: ${authTag.toString("hex")}`);
  // console.log(`Encrypted: ${encrypted.toString("hex")}`);

  return result.toString("hex");
}

export type DecryptedOptions = {
  key: string;
  data: string;
};

/**
 * Decrypts the given encrypted data using the provided key and the ChaCha20-Poly1305 algorithm.
 *
 * @param key Key used to decrypt the data. The key must be a string that will be hashed to 32 bytes.
 * @param data Data to be decrypted. This should be a hex string.
 * @returns Decrypted data as a UTF-8 string.
 */
export function Decrypted({ key, data }: DecryptedOptions): string {
  const keyAsBytes = hashKey(key);
  const dataAsBytes = Buffer.from(data, "hex");

  const nonce = dataAsBytes.subarray(0, 12);
  const encrypted = dataAsBytes.subarray(12, dataAsBytes.length - 16);
  const authTag = dataAsBytes.subarray(dataAsBytes.length - 16);

  // console.log({ key, data });
  // console.log("Decryption process started");
  // console.log(`Nonce: ${nonce.toString("hex")}`);
  // console.log(`Auth Tag: ${authTag.toString("hex")}`);
  // console.log(`Encrypted: ${encrypted.toString("hex")}`);

  const decipher = crypto.createDecipheriv(
    "chacha20-poly1305",
    keyAsBytes,
    nonce,
    {
      authTagLength: 16,
    },
  );

  decipher.setAuthTag(authTag);

  let decrypted: Buffer;
  decrypted = decipher.update(encrypted);
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
