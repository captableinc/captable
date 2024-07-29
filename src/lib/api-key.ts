import { customId } from "@/common/id";
import bcrypt from "bcryptjs";
import { base58 } from "./base-58";

const SEPARATOR = "_";
const SPLITTER = ":";

type TPrefix = "api";

const generateKey = (prefix: TPrefix) => {
  const identifier = customId(16);
  const passkey = customId(16);
  const encodedKey = base58.encode(
    Buffer.from(identifier + SPLITTER + passkey, "utf8"),
  );
  const keyWithPrefix = [prefix, encodedKey].join(SEPARATOR);
  const partialKey = `${keyWithPrefix.slice(0, 3)}...${keyWithPrefix.slice(
    -4,
  )}`;
  return {
    encodedKey,
    partialKey,
    identifier,
    keyWithPrefix,
    passkey,
  };
};

export const generateApiKey = () => generateKey("api");

interface hashApiKeyOptions {
  identifier: string;
  passkey: string;
}
export const hashApiKey = ({ identifier, passkey }: hashApiKeyOptions) => {
  return hashKey(identifier + passkey);
};

export const verifyApiKey = (
  { identifier, passkey }: hashApiKeyOptions,
  hash: string,
) => {
  return bcrypt.compare(identifier + passkey, hash);
};

export const hashKey = async (key: string) => {
  const salt = await bcrypt.genSalt(10);

  return bcrypt.hash(key, salt);
};

export const verifyKey = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const decodeKey = (key: string) => {
  const decodeValue = Buffer.from(base58.decode(key)).toString("utf-8");

  const splittedKey = decodeValue.split(SPLITTER);
  return { identifier: splittedKey[0] ?? "", passkey: splittedKey[1] ?? "" };
};
