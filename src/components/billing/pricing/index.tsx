"use client";

import type { PricingPlanInterval } from "@/prisma/enums";
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

  const handleBilling = (interval: PricingPlanInterval) => {
    setBillingInterval(interval);
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
