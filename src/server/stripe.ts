import { env } from "@/env";
import Stripe from "stripe";

export const stripe = new Stripe(env.STRIPE_API_KEY ?? "", {
  typescript: true,
  apiVersion: "2024-04-10",
});

export { Stripe };
