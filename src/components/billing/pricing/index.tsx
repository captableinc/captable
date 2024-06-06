"use client";

import { getStripeClient } from "@/client-only/stripe";
import type { PricingPlanInterval, PricingType } from "@/prisma/enums";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";
import { useState } from "react";
import { EmptyPlans } from "./empty-plans";
import { PricingButton } from "./pricing-button";
import { PricingCard } from "./pricing-card";

type Products = RouterOutputs["billing"]["getProducts"]["products"];
type TSubscription =
  RouterOutputs["billing"]["getSubscription"]["subscription"];

interface PricingProps {
  products: Products;
  subscription: TSubscription;
}

interface handleStripeCheckoutOptions {
  priceId: string;
  priceType: PricingType;
}

function Plans({ products, subscription }: PricingProps) {
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval),
      ),
    ),
  );
  const [billingInterval, setBillingInterval] =
    useState<PricingPlanInterval>("month");

  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const { mutateAsync: checkoutWithStripe } = api.billing.checkout.useMutation({
    onSuccess: async ({ stripeSessionId }) => {
      const stripe = await getStripeClient();
      stripe?.redirectToCheckout({ sessionId: stripeSessionId });
    },
  });

  const handleBilling = (interval: PricingPlanInterval) => {
    setBillingInterval(interval);
  };

  const handleStripeCheckout = async (price: handleStripeCheckoutOptions) => {
    setPriceIdLoading(price.priceId);

    await checkoutWithStripe(price);

    setPriceIdLoading(undefined);
  };

  return (
    <div>
      <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        {intervals.includes("month") && (
          <PricingButton
            onClick={() => handleBilling("month")}
            active={billingInterval === "month"}
            label="monthly"
          />
        )}
        {intervals.includes("year") && (
          <PricingButton
            onClick={() => handleBilling("year")}
            active={billingInterval === "year"}
            label="yearly"
          />
        )}
      </div>

      <section className="flex flex-col sm:flex-row sm:flex-wrap gap-8 pt-8">
        {products.map((product) => {
          const price = product?.prices?.find(
            (price) => price.interval === billingInterval,
          );
          if (!price) return null;

          const unitAmount = Number(price?.unitAmount) ?? 0;

          const priceString = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: price.currency,
            minimumFractionDigits: 0,
          }).format(unitAmount / 100);

          return (
            <PricingCard
              key={product.id}
              title={product.name}
              description={product.description}
              price={priceString}
              interval={billingInterval}
              subscribed={!!subscription}
              onClick={() =>
                handleStripeCheckout({
                  priceId: price.id,
                  priceType: price.type,
                })
              }
              loading={priceIdLoading === price.id}
            />
          );
        })}
      </section>
    </div>
  );
}

export function Pricing({ products, subscription }: PricingProps) {
  return products.length ? (
    <Plans products={products} subscription={subscription} />
  ) : (
    <EmptyPlans />
  );
}
