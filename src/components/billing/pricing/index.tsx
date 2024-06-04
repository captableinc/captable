"use client";

import { useState } from "react";
import { PricingButton } from "./pricing-button";
import { PricingCard } from "./pricing-card";

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly",
  );
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
