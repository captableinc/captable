import { withAuth } from "@/trpc/api/trpc";

export const getProductsProcedure = withAuth.query(async ({ ctx }) => {
  const { db } = ctx;

  const { products } = await db.$transaction(async (tx) => {
    const products = await tx.product.findMany({
      where: {
        active: true,
      },
      include: {
        prices: {
          where: {
            active: true,
          },
          select: {
            id: true,
            interval: true,
            unitAmount: true,
            currency: true,
            type: true,
          },
        },
      },
    });

    return { products };
  });

  return { products };
});
