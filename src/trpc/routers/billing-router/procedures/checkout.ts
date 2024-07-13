import { env } from "@/env";
import { invariant } from "@/lib/error";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/auth";
import { createOrRetrieveCustomer, stripe } from "@/server/stripe";
import { withAuth } from "@/trpc/api/trpc";
import type Stripe from "stripe";
import { ZodCheckoutMutationSchema } from "../schema";

export const checkoutProcedure = withAuth
  .input(ZodCheckoutMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { priceId, priceType } = input;
    const { db, session, userAgent, requestIp } = ctx;

    const { stripeSessionId } = await db.$transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      let customer: string;
      try {
        customer = await createOrRetrieveCustomer({
          tx,
          companyId,
          email: "",
        });
      } catch (err) {
        console.error(err);
        throw new Error("Unable to access customer record.");
      }

      const params: Stripe.Checkout.SessionCreateParams = {
        allow_promotion_codes: true,
        billing_address_collection: "required",
        customer,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: priceType === "recurring" ? "subscription" : "payment",
        success_url: `${env.NEXT_PUBLIC_BASE_URL}/${session.user.companyPublicId}/settings/billing`,
      };

      let stripeSession: Stripe.Checkout.Session | undefined;
      try {
        stripeSession = await stripe.checkout.sessions.create(params);
      } catch (err) {
        console.error(err);
        throw new Error("Unable to create checkout session.");
      }

      invariant(stripeSession, "session not found");

      const user = session.user;

      await Audit.create(
        {
          action: "stripe.session.created",
          companyId: user.companyId,
          actor: { type: "user", id: user.id },
          context: {
            userAgent,
            requestIp,
          },
          target: [{ type: "stripeSession", id: stripeSession.id }],
          summary: `Stripe Session is created for ${user.name}`,
        },
        tx,
      );

      return { stripeSessionId: stripeSession.id };
    });

    return { stripeSessionId };
  });
