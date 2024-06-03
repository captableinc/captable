import { env } from "@/env";

export const IS_BILLING_ENABLED = !!(
  env.STRIPE_API_KEY && env.STRIPE_WEBHOOK_SECRET
);
