import { env } from "@/env";
import { invariant } from "@/lib/error";
import { checkMembership } from "@/server/auth";
import { createOrRetrieveCustomer, stripe } from "@/server/stripe";
import { withAuth } from "@/trpc/api/trpc";
import { ZodStripePortalMutationSchema } from "../schema";

export const stripePortalProcedure = withAuth
  .input(ZodStripePortalMutationSchema)
  .mutation(async ({ ctx, input }) => {
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
      console.log({ input });

      try {
        const { url } = await stripe.billingPortal.sessions.create({
          customer,
          return_url: `${env.NEXT_PUBLIC_BASE_URL}/${session.user.companyPublicId}/settings/billing`,
          flow_data: {
            ...(input.type === "cancel"
              ? {
                  type: "subscription_cancel",
                  subscription_cancel: {
                    subscription: input.subscription,
                  },
                }
              : {
                  type: "subscription_update",
                  subscription_update: {
                    subscription: input.subscription,
                  },
                }),
          },
        });

        return { url };
      } catch (_error) {
        console.log({ _error });

        throw new Error("Could not create billing portal.");
      }
    });

    return { url };
  });
