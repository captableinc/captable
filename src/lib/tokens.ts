import { customId } from "@/common/id";
import { base58 } from "./base-58";
import { createSecureHash } from "./crypto";

// tkn = Access token
// sin = eSign token
// upd = Investor update
// wbk = webhook token
type TTokenPrefixes = "tkn" | "sin" | "upd" | "wbk";

const SEPARATOR = "_";
const SPLITTER = ":";

const secureHash = createSecureHash({});

export const generateTokens = (prefix: TTokenPrefixes) => {
  const identifier = customId(16);
  const tokenPasskey = customId(16);
  const encodedToken = base58.encode(
    Buffer.from(identifier + SPLITTER + tokenPasskey, "utf8"),
  );
  const tokenWithPrefix = [prefix, encodedToken].join(SEPARATOR);
  const partialToken = `${tokenWithPrefix.slice(
    0,
    3,
  )}...${tokenWithPrefix.slice(-4)}`;
  return {
    encodedToken,
    partialToken,
    identifier,
    tokenWithPrefix,
    tokenPasskey,
  };
};

export const hashToken = (key: string) => {
  return secureHash.hash(key);
};

export const verifyToken = (hash: string, password: string) => {
  return secureHash.verify(hash, password);
};

export const decodeToken = (key: string) => {
  const decodeValue = Buffer.from(base58.decode(key)).toString("utf-8");

  const splittedKey = decodeValue.split(SPLITTER);
  return { identifier: splittedKey[0] ?? "", passkey: splittedKey[1] ?? "" };
};
