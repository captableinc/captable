import { env } from "@/env";
import { invariant } from "@/lib/error";
import Stripe from "stripe";
import { type TPrismaOrTransaction, db } from "./db";

const toDateTime = (secs: number) => {
  const t = new Date(+0); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

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

  await db.billingProduct.upsert({
    create: productData,
    update: productData,
    where: {
      id: product.id,
    },
  });
}

export async function deleteProductRecord(product: Stripe.Product) {
  await db.billingProduct.delete({
    where: {
      id: product.id,
    },
  });
}

export async function deletePriceRecord(price: Stripe.Price) {
  await db.billingPrice.delete({
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

  await db.billingPrice.upsert({
    create: priceData,
    update: priceData,
    where: {
      id: price.id,
    },
  });
}

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false,
) => {
  const customer = await db.billingCustomer.findFirst({
    where: { id: customerId },
  });

  invariant(customer?.id, "Customer lookup failed");

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });

  const item = subscription.items.data[0];

  invariant(item, "item not found");

  const id = subscription.id;

  const data = {
    customerId: customer.id,
    metadata: subscription.metadata,
    status: subscription.status,
    priceId: item.price.id,
    quantity: item.quantity ?? 1,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    cancelAt: subscription.cancel_at
      ? toDateTime(subscription.cancel_at)
      : undefined,
    canceledAt: subscription.canceled_at
      ? toDateTime(subscription.canceled_at)
      : undefined,
    currentPeriodStart: subscription.current_period_start
      ? toDateTime(subscription.current_period_start)
      : undefined,
    currentPeriodEnd: subscription.current_period_end
      ? toDateTime(subscription.current_period_end)
      : undefined,
    created: toDateTime(subscription.created),
    endedAt: subscription.ended_at
      ? toDateTime(subscription.ended_at)
      : undefined,
    trialStart: subscription.trial_start
      ? toDateTime(subscription.trial_start)
      : undefined,
    trialEnd: subscription.trial_end
      ? toDateTime(subscription.trial_end)
      : undefined,
  };

  await db.billingSubscription.upsert({
    create: { ...data, id },
    update: data,
    where: {
      id,
    },
  });
};

interface upsertCustomerOptions {
  customerId: string;
  companyId: string;
  tx: TPrismaOrTransaction;
}

async function upsertCustomer({
  tx,
  companyId,
  customerId,
}: upsertCustomerOptions) {
  const data = { companyId, id: customerId };
  const customer = await tx.billingCustomer.upsert({
    where: data,
    update: data,
    create: data,
  });

  return customer.id;
}

interface createCustomerInStripeOptions {
  companyId: string;
  email: string;
}

const createCustomerInStripe = async ({
  email,
  companyId,
}: createCustomerInStripeOptions) => {
  const customerData = { metadata: { companyId }, email: email };
  const newCustomer = await stripe.customers.create(customerData);

  invariant(newCustomer, "Stripe customer creation failed.");

  return newCustomer.id;
};

interface createOrRetrieveCustomerOptions {
  companyId: string;
  tx: TPrismaOrTransaction;
  email: string;
}

export async function createOrRetrieveCustomer({
  companyId,
  tx,
  email,
}: createOrRetrieveCustomerOptions) {
  const existingCustomer = await tx.billingCustomer.findFirst({
    where: { companyId },
  });
  let stripeCustomerId: string | undefined;

  if (existingCustomer?.id) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingCustomer.id,
    );
    stripeCustomerId = existingStripeCustomer.id;
  } else {
    const stripeCustomers = await stripe.customers.list({ email: email });

    stripeCustomerId = stripeCustomers?.data?.[0]
      ? stripeCustomers.data[0].id
      : undefined;
  }

  const stripeId = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe({ email, companyId });

  if (existingCustomer && stripeCustomerId) {
    await tx.billingCustomer.update({
      where: {
        id: existingCustomer.id,
      },
      data: {
        id: stripeCustomerId,
      },
    });

    return stripeCustomerId;
  }
  const upsertedStripeCustomer = await upsertCustomer({
    tx,
    companyId,
    customerId: stripeId,
  });

  return upsertedStripeCustomer;
}
