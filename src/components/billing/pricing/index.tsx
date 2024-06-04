"use client";

import type { PricingPlanInterval } from "@/prisma/enums";
import type { RouterOutputs } from "@/trpc/shared";
import { useState } from "react";
import { EmptyPlans } from "./empty-plans";
import { PricingButton } from "./pricing-button";
import { PricingCard } from "./pricing-card";

type Products = RouterOutputs["billing"]["getProducts"]["products"];
interface PricingProps {
  products: Products;
}

function Plans({ products }: PricingProps) {
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval),
      ),
    ),
  );
  const [billingPeriod, setBillingPeriod] =
    useState<PricingPlanInterval>("month");
  return (
    <div>
      <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        <PricingButton activeLabel={billingPeriod} label="monthly" />
        <PricingButton activeLabel={billingPeriod} label="yearly" />
      </div>

      <section className="flex flex-col sm:flex-row sm:flex-wrap gap-8 pt-8">
        <PricingCard
          title="Hobby"
          description="All the basics for starting a new business"
          price={25}
          interval="yearly"
        />
        <PricingCard
          title="Freelancer"
          description="All the basics for starting a new business"
          price={25}
          interval="yearly"
        />
        <PricingCard
          title="Startup"
          description="All the basics for starting a new business"
          price={25}
          interval="yearly"
        />
      </section>
    </div>
  );
}

export function Pricing({ products }: PricingProps) {
  return products.length ? <Plans products={products} /> : <EmptyPlans />;
}
