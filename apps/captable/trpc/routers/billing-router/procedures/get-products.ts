import { withAuth } from "@/trpc/api/trpc";
import { and, billingPrices, billingProducts, db, eq } from "@captable/db";

export const getProductsProcedure = withAuth.query(async ({ ctx: _ctx }) => {
  const { products } = await db.transaction(async (tx) => {
    const products = await tx
      .select({
        id: billingProducts.id,
        name: billingProducts.name,
        description: billingProducts.description,
        active: billingProducts.active,
        metadata: billingProducts.metadata,
      })
      .from(billingProducts)
      .where(eq(billingProducts.active, true));

    // Get prices for each product
    const productsWithPrices = await Promise.all(
      products.map(async (product) => {
        const prices = await tx
          .select({
            id: billingPrices.id,
            interval: billingPrices.interval,
            unitAmount: billingPrices.unitAmount,
            currency: billingPrices.currency,
            type: billingPrices.type,
          })
          .from(billingPrices)
          .where(
            and(
              eq(billingPrices.productId, product.id),
              eq(billingPrices.active, true),
            ),
          );

        return {
          ...product,
          prices,
        };
      }),
    );

    return { products: productsWithPrices };
  });

  return { products };
});
