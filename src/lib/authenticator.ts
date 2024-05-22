import { PASSKEY_TIMEOUT } from "@/constants/passkey";
import { getPublicEnv } from "@/lib/env";

/**
 * Extracts common fields to identify the RP (relying party)
 */
export const getAuthenticatorOptions = () => {
  const webAppBaseUrl = new URL(getPublicEnv("NEXT_PUBLIC_BASE_URL"));
  const rpId = webAppBaseUrl.hostname;

  return {
    rpName: "Captable",
    rpId,
    origin: getPublicEnv("NEXT_PUBLIC_BASE_URL"),
    timeout: PASSKEY_TIMEOUT,
  };
};
