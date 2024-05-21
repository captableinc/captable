import { NEXT_PUBLIC_BASE_URL } from "@/constants/common";
import { PASSKEY_TIMEOUT } from "@/constants/passkey";

/**
 * Extracts common fields to identify the RP (relying party)
 */
export const getAuthenticatorOptions = () => {
  const webAppBaseUrl = new URL(NEXT_PUBLIC_BASE_URL());
  const rpId = webAppBaseUrl.hostname;

  return {
    rpName: "Captable",
    rpId,
    origin: NEXT_PUBLIC_BASE_URL(),
    timeout: PASSKEY_TIMEOUT,
  };
};
