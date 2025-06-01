import { env } from "@/env";
import { PASSKEY_TIMEOUT } from "@/lib/constants/passkey";

/**
 * Extracts common fields to identify the RP (relying party)
 */
export const getAuthenticatorOptions = () => {
  const webAppBaseUrl = new URL(env.NEXT_PUBLIC_BASE_URL);
  const rpId = webAppBaseUrl.hostname;

  return {
    rpName: "Captable",
    rpId,
    origin: env.NEXT_PUBLIC_BASE_URL,
    timeout: PASSKEY_TIMEOUT,
  };
};
