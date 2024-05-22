import { env } from "next-runtime-env";

type TPublicEnvVar = "NEXT_PUBLIC_BASE_URL" | "NEXT_PUBLIC_UPLOAD_DOMAIN";

export const getPublicEnv = (envVar: TPublicEnvVar) => {
  return env(envVar) as string;
};
