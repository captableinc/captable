import { generateTokens, hashToken, verifyToken } from "./tokens";

export const generateAccessToken = () => generateTokens("pat");

interface hashApiKeyOptions {
  identifier: string;
  passkey: string;
}
export const hashAccessToken = ({ identifier, passkey }: hashApiKeyOptions) => {
  return hashToken(identifier + passkey);
};

export const verifyAccessToken = (
  { identifier, passkey }: hashApiKeyOptions,
  hash: string,
) => {
  return verifyToken(identifier + passkey, hash);
};
