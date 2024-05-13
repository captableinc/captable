import { env } from "@/env";

export const IS_GOOGLE_AUTH_ENABLED = !!(
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
);
