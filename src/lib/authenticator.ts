import { PASSKEY_TIMEOUT } from "@/constants/passkey";
import { env } from "@/env";

/**
 * Extracts common fields to identify the RP (relying party)
 */
export const getAuthenticatorOptions = () => {
  const webAppBaseUrl = new URL(env.BASE_URL);
  const rpId = webAppBaseUrl.hostname;

  return {
    rpName: "Captable",
    rpId,
    origin: env.BASE_URL,
    timeout: PASSKEY_TIMEOUT,
  };
};
