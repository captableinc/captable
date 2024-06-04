import { withAuth } from "@/trpc/api/trpc";

export const getProductsProcedure = withAuth.query(async ({ ctx }) => {
  const { db } = ctx;

  const { products } = await db.$transaction(async (tx) => {
    const products = await db.product.findMany({
      include: {
        prices: {
          select: {
            interval: true,
            unitAmount: true,
          },
        },
      },
    });

    return { products };
  });

  return { products };
});
