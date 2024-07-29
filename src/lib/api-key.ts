import { generateTokens, hashToken, verifyToken } from "./tokens";

export const generateApiKey = () => generateTokens("api");

interface hashApiKeyOptions {
  identifier: string;
  passkey: string;
}
export const hashApiKey = ({ identifier, passkey }: hashApiKeyOptions) => {
  return hashToken(identifier + passkey);
};

export const verifyApiKey = (
  { identifier, passkey }: hashApiKeyOptions,
  hash: string,
) => {
  return verifyToken(identifier + passkey, hash);
};
