import { env } from "@/env";
import { invariant } from "@/lib/error";
import { checkMembership } from "@/server/auth";
import { createOrRetrieveCustomer, stripe } from "@/server/stripe";
import { withAuth } from "@/trpc/api/trpc";

export const stripePortalProcedure = withAuth.mutation(async ({ ctx }) => {
  const { db, session } = ctx;

  const { url } = await db.$transaction(async (tx) => {
    const { companyId } = await checkMembership({ session, tx });

    let customer: string;
    try {
      customer = await createOrRetrieveCustomer({
        tx,
        companyId,
        email: "",
      });
    } catch (_error) {
      throw new Error("Unable to access customer record.");
    }

    invariant(customer, "Could not get customer.");

    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: `${env.NEXT_PUBLIC_BASE_URL}/${session.user.companyPublicId}/settings/billing`,
      });

      return { url };
    } catch (_error) {
      throw new Error("Could not create billing portal.");
    }
  });

  return { url };
});
