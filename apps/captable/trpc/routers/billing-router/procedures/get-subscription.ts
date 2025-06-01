import { checkMembership } from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import {
  and,
  billingCustomers,
  billingPrices,
  billingProducts,
  billingSubscriptions,
  db,
  eq,
  inArray,
} from "@captable/db";

export const getSubscriptionProcedure = withAuth.query(async ({ ctx }) => {
  const { session } = ctx;

  const { subscription } = await db.transaction(async (tx) => {
    const { companyId } = await checkMembership({ session, tx });

    const customerResult = await tx
      .select({
        id: billingCustomers.id,
      })
      .from(billingCustomers)
      .where(eq(billingCustomers.companyId, companyId))
      .limit(1);

    const customer = customerResult[0];
    if (!customer) {
      return { subscription: null };
    }

    const subscriptionResult = await tx
      .select({
        id: billingSubscriptions.id,
        priceId: billingSubscriptions.priceId,
        quantity: billingSubscriptions.quantity,
        status: billingSubscriptions.status,
        cancelAtPeriodEnd: billingSubscriptions.cancelAtPeriodEnd,
        created: billingSubscriptions.created,
        currentPeriodStart: billingSubscriptions.currentPeriodStart,
        currentPeriodEnd: billingSubscriptions.currentPeriodEnd,
        endedAt: billingSubscriptions.endedAt,
        cancelAt: billingSubscriptions.cancelAt,
        canceledAt: billingSubscriptions.canceledAt,
        trialStart: billingSubscriptions.trialStart,
        trialEnd: billingSubscriptions.trialEnd,
        metadata: billingSubscriptions.metadata,
        customerId: billingSubscriptions.customerId,
        priceUnitAmount: billingPrices.unitAmount,
        productName: billingProducts.name,
      })
      .from(billingSubscriptions)
      .innerJoin(
        billingPrices,
        eq(billingSubscriptions.priceId, billingPrices.id),
      )
      .innerJoin(
        billingProducts,
        eq(billingPrices.productId, billingProducts.id),
      )
      .where(
        and(
          eq(billingSubscriptions.customerId, customer.id),
          inArray(billingSubscriptions.status, ["active", "trialing"]),
        ),
      )
      .limit(1);

    const rawSubscription = subscriptionResult[0];

    const subscription = rawSubscription
      ? {
          ...rawSubscription,
          price: {
            unitAmount: rawSubscription.priceUnitAmount,
            product: {
              name: rawSubscription.productName,
            },
          },
        }
      : null;

    return { subscription };
  });

  return { subscription };
});
