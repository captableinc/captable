import type { RegistrationResponseJSON } from "@simplewebauthn/types";
import { TRPCError } from "@trpc/server";

import { createPasskeyAuthenticationOptions } from "@/server/passkey/create-authentication-option";
import { createPasskey } from "@/server/passkey/create-passkey";
import { createPasskeyRegistrationOptions } from "@/server/passkey/create-registration-options";
import { deletePasskey } from "@/server/passkey/delete-passkey";
import { findPasskeys } from "@/server/passkey/find-passkeys";
import { updatePasskey } from "@/server/passkey/update-passkey";

import { createPasskeySigninOptions } from "@/server/passkey/create-signin-options";
import { createTRPCRouter, withAuth, withoutAuth } from "@/trpc/api/trpc";
import {
  ZCreatePasskeyAuthenticationOptionsMutationSchema,
  ZCreatePasskeyMutationSchema,
  ZDeletePasskeyMutationSchema,
  ZUpdatePasskeyMutationSchema,
} from "./schema";

export const passkeyRouter = createTRPCRouter({
  create: withAuth
    .input(ZCreatePasskeyMutationSchema)
    .mutation(async ({ ctx: { session }, input }) => {
      try {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const verificationResponse =
          input.verificationResponse as RegistrationResponseJSON;

        return await createPasskey({
          userId: session.user.id,
          verificationResponse,
          passkeyName: input.passkeyName,
        });
      } catch (err) {
        console.error(err);

        throw new Error("Error in creating passkey");
      }
    }),

  createAuthenticationOptions: withAuth
    .input(ZCreatePasskeyAuthenticationOptionsMutationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await createPasskeyAuthenticationOptions({
          userId: ctx.session.user.id,
          preferredPasskeyId: input?.preferredPasskeyId,
        });
      } catch (err) {
        console.error(err);

        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "We were unable to create the authentication options for the passkey. Please try again later.",
        });
      }
    }),

  createRegistrationOptions: withAuth.mutation(async ({ ctx }) => {
    try {
      return await createPasskeyRegistrationOptions({
        userId: ctx.session.user.id,
      });
    } catch (err) {
      console.error(err);

      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "We were unable to create the registration options for the passkey. Please try again later.",
      });
    }
  }),

  createSigninOptions: withoutAuth.mutation(async ({ ctx }) => {
    const cookies = ctx.headers.get("cookie");
    const sessionIdToken = cookies?.substring(21);
    if (!sessionIdToken) {
      throw new Error("Missing CSRF token");
    }
    const [sessionId] = decodeURI(sessionIdToken).split("|");
    try {
      if (sessionId) {
        return await createPasskeySigninOptions({ sessionId });
      }
    } catch (err) {
      console.error(err);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "We were unable to create the options for passkey signin. Please try again later.",
      });
    }
  }),

  delete: withAuth
    .input(ZDeletePasskeyMutationSchema)
    .mutation(async ({ ctx: { session }, input }) => {
      try {
        const { passkeyId } = input;

        await deletePasskey({
          userId: session.user.id,
          passkeyId,
        });
      } catch (err) {
        console.error(err);

        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "We were unable to delete this passkey. Please try again later.",
        });
      }
    }),

  find: withAuth.query(async ({ ctx }) => {
    try {
      return await findPasskeys({
        userId: ctx.session.user.id,
      });
    } catch (err) {
      console.error(err);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "We were unable to find . Please try again later.",
      });
    }
  }),

  update: withAuth
    .input(ZUpdatePasskeyMutationSchema)
    .mutation(async ({ ctx: { session }, input }) => {
      try {
        const { passkeyId, name } = input;
        await updatePasskey({
          userId: session.user.id,
          passkeyId,
          name,
        });
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "We were unable to update this passkey. Please try again later.",
        });
      }
    }),
});
