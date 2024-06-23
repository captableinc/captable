import { checkMembership } from "@/server/auth";
import { withAuth } from "@/trpc/api/trpc";

export const getSubscriptionProcedure = withAuth.query(async ({ ctx }) => {
  const { db, session } = ctx;

  const { subscription } = await db.$transaction(async (tx) => {
    const { companyId } = await checkMembership({ session, tx });

    const customer = await tx.billingCustomer.findFirst({
      where: {
        companyId,
      },
      select: {
        id: true,
      },
    });

    if (!customer) {
      return { subscription: null };
    }

    const subscription = await tx.billingSubscription.findFirst({
      where: {
        customerId: customer.id,
        status: {
          in: ["active", "trialing"],
        },
      },
      include: {
        price: {
          select: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return { subscription };
  });

  return { subscription };
});
