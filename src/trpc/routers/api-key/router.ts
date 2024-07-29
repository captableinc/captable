import { generateApiKey, hashApiKey } from "@/lib/api-key";
import { Audit } from "@/server/audit";

import { createTRPCRouter, withAccessControl } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const apiKeyRouter = createTRPCRouter({
  listAll: withAccessControl
    .meta({ policies: { "api-keys": { allow: ["read"] } } })
    .query(async ({ ctx }) => {
      const {
        db,
        membership: { companyId, memberId },
      } = ctx;

      const apiKeys = await db.apiKey.findMany({
        where: {
          active: true,
          companyId,
          membershipId: memberId,
        },

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          partialKey: true,
          createdAt: true,
          lastUsed: true,
        },
      });

      return {
        apiKeys,
      };
    }),
  create: withAccessControl
    .meta({ policies: { "api-keys": { allow: ["create"] } } })
    .mutation(async ({ ctx }) => {
      const {
        db,
        membership: { companyId, memberId },
        userAgent,
        requestIp,
        session,
      } = ctx;

      const {
        partialToken: partialKey,
        identifier,
        tokenWithPrefix: keyWithPrefix,
        tokenPasskey: passkey,
      } = generateApiKey();

      const hashedKey = await hashApiKey({ identifier, passkey });
      const user = session.user;

      const key = await db.apiKey.create({
        data: {
          id: identifier,
          companyId,
          membershipId: memberId,
          hashedKey,
          partialKey,
        },
      });

      await Audit.create(
        {
          action: "apiKey.created",
          companyId,
          actor: { type: "user", id: user.id },
          context: {
            userAgent,
            requestIp,
          },
          target: [{ type: "apiKey", id: key.id }],
          summary: `${user.name} created the apiKey ${key.name}`,
        },
        db,
      );

      return {
        token: keyWithPrefix,
        partialKey,
        createdAt: key.createdAt,
      };
    }),

  delete: withAccessControl
    .input(z.object({ keyId: z.string() }))
    .meta({ policies: { "api-keys": { allow: ["delete"] } } })
    .mutation(async ({ ctx, input }) => {
      const {
        db,
        membership: { memberId, companyId },
        session,
        requestIp,
        userAgent,
      } = ctx;
      const { keyId } = input;
      const { user } = session;
      try {
        const key = await db.apiKey.delete({
          where: {
            id: keyId,
            membershipId: memberId,
            companyId,
          },
        });
        await Audit.create(
          {
            action: "apiKey.deleted",
            companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp,
            },
            target: [{ type: "apiKey", id: key.id }],
            summary: `${user.name} deleted the apiKey ${key.name}`,
          },
          db,
        );

        return {
          success: true,
          message: "Key deleted Successfully.",
        };
      } catch (error) {
        console.error("Error deleting the api key :", error);
        if (error instanceof TRPCError) {
          return {
            success: false,
            message: error.message,
          };
        }
        return {
          success: false,
          message: "Oops, something went wrong. Please try again later.",
        };
      }
    }),
});
