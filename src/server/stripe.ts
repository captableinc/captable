import { env } from "@/env";
import Stripe from "stripe";
import { db } from "./db";

export const stripe = new Stripe(env.STRIPE_API_KEY ?? "", {
  typescript: true,
  apiVersion: "2024-04-10",
});

export { Stripe };

export async function upsertProductRecord(product: Stripe.Product) {
  const productData = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description,
    metadata: product.metadata,
  };

  await db.product.upsert({
    create: productData,
    update: productData,
    where: {
      id: product.id,
    },
  });
}

export async function deleteProductRecord(product: Stripe.Product) {
  await db.product.delete({
    where: {
      id: product.id,
    },
  });
}

export async function deletePriceRecord(price: Stripe.Price) {
  await db.price.delete({
    where: {
      id: price.id,
    },
  });
}

const TRIAL_PERIOD_DAYS = 0;

export async function upsertPriceRecord(price: Stripe.Price) {
  const priceData = {
    id: price.id,
    productId: typeof price.product === "string" ? price.product : "",
    active: price.active,
    currency: price.currency,
    type: price.type,
    unitAmount: price.unit_amount,
    interval: price.recurring?.interval,
    intervalCount: price.recurring?.interval_count,
    trialPeriodDays: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
  };

  await db.price.upsert({
    create: priceData,
    update: priceData,
    where: {
      id: price.id,
    },
  });
}
