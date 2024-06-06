import { env } from "@/env";
import { type Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripeClient = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(env.STRIPE_PUBLISHABLE_KEY ?? "");
  }

  return stripePromise;
};
