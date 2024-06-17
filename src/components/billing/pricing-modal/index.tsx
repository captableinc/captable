"use client";

import { getStripeClient } from "@/client-only/stripe";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PricingPlanInterval, PricingType } from "@/prisma/enums";
import { api } from "@/trpc/react";
import type { TypeZodStripePortalMutationSchema } from "@/trpc/routers/billing-router/schema";
import type { RouterOutputs } from "@/trpc/shared";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  const router = useRouter();
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval),
      ),
    ),
  );
  const [billingInterval, setBillingInterval] =
    useState<PricingPlanInterval>("month");

  const { mutateAsync: checkoutWithStripe, isLoading: checkoutLoading } =
    api.billing.checkout.useMutation({
      onSuccess: async ({ stripeSessionId }) => {
        const stripe = await getStripeClient();
        await stripe?.redirectToCheckout({ sessionId: stripeSessionId });
      },
    });

  const { mutateAsync: stripePortal, isLoading: stripePortalLoading } =
    api.billing.stripePortal.useMutation({
      onSuccess: ({ url }) => {
        router.push(url);
      },
    });

  const handleBilling = (interval: PricingPlanInterval) => {
    setBillingInterval(interval);
  };

  const handleStripeCheckout = async (price: handleStripeCheckoutOptions) => {
    await checkoutWithStripe(price);
  };

  const handleBillingPortal = async (
    data: TypeZodStripePortalMutationSchema,
  ) => {
    await stripePortal(data);
  };

  const isSubmitting = checkoutLoading || stripePortalLoading;

  return (
    <div className="flex flex-col items-center justify-center">
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
        <PricingCard
          title="Free"
          description=""
          price="$0"
          interval="month"
          subscribedUnitAmount={subscription?.price.unitAmount}
          unitAmount={0}
          isSubmitting={isSubmitting}
          {...(subscription && {
            handleClick: () => {
              return handleBillingPortal({
                type: "cancel",
                subscription: subscription.id,
              });
            },
          })}
        />
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

          const active = subscription?.priceId === price.id;
          return (
            <PricingCard
              key={product.id}
              title={product.name}
              description={product.description}
              price={priceString}
              interval={billingInterval}
              handleClick={() => {
                if (subscription) {
                  return handleBillingPortal({
                    ...(active
                      ? {
                          type: "cancel",
                          subscription: subscription.id,
                        }
                      : {
                          type: "update",
                          subscription: subscription.id,
                        }),
                  });
                }
                return handleStripeCheckout({
                  priceId: price.id,
                  priceType: price.type,
                });
              }}
              subscribedUnitAmount={subscription?.price.unitAmount}
              unitAmount={unitAmount}
              isSubmitting={isSubmitting}
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

export type PricingModalProps = PricingProps;

export function PricingModal({ products, subscription }: PricingModalProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgrade = searchParams.get("upgrade");
  useEffect(() => {
    const isOpen = upgrade === "true";
    if (isOpen) {
      setOpen(true);
    }
  }, [upgrade]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        router.back();
      }}
    >
      <DialogContent className="max-w-[95vw]">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle>Upgrade or manage plans</DialogTitle>
        </DialogHeader>
        <div className="overflow-scroll no-scrollbar max-h-[80vh]">
          <Pricing products={products} subscription={subscription} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
