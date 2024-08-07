import { generatePublicId } from "@/common/id";
import { createApiToken, createSecureHash } from "@/lib/crypto";
import { Audit } from "@/server/audit";
import type { TPrismaOrTransaction } from "@/server/db";
import { createTRPCRouter, withAccessControl } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import z from "zod";

interface createApiKeyHandlerOptions {
  tx: TPrismaOrTransaction;
  companyId: string;
  memberId: string;
}

export const createApiKeyHandler = async ({
  tx,
  ...rest
}: createApiKeyHandlerOptions) => {
  const token = createApiToken();
  const keyId = generatePublicId();
  const hashedToken = createSecureHash(token);

  return await tx.apiKey.create({
    data: {
      keyId,
      companyId: rest.companyId,
      membershipId: rest.memberId,
      hashedToken,
    },
  });
};

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
          keyId: true,
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

      const { user } = session;

      const newKey = await db.$transaction(async (tx) => {
        const key = await createApiKeyHandler({ tx, companyId, memberId });
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
          tx,
        );
        return key;
      });

      return {
        token: newKey.hashedToken,
        keyId: newKey.keyId,
        createdAt: newKey.createdAt,
      };
    }),

  rotate: withAccessControl
    .input(z.object({ keyId: z.string() }))
    .meta({ policies: { "api-keys": { allow: ["update"] } } })
    .mutation(async ({ ctx, input }) => {
      try {
        const {
          db,
          membership: { memberId, companyId },
          session,
          requestIp,
          userAgent,
        } = ctx;
        const { user } = session;

        const key = await db.$transaction(async (tx) => {
          const existingKey = await tx.apiKey.findUnique({
            where: {
              keyId: input.keyId,
              active: true,
            },
          });

          if (!existingKey) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Api key not found",
            });
          }

          const token = createApiToken();
          const keyId = generatePublicId();
          const hashedToken = createSecureHash(token);

          const newKey = await tx.apiKey.update({
            where: {
              id: existingKey.id,
              membershipId: memberId,
            },
            data: {
              keyId,
              hashedToken,
              active: true,
            },
          });

          await Audit.create(
            {
              action: "apikey.rotated",
              companyId,
              actor: { type: "user", id: user.id },
              context: {
                userAgent,
                requestIp,
              },
              target: [{ type: "apiKey", id: newKey.id }],
              summary: `${user.name} rotated the apiKey ${newKey.name}`,
            },
            tx,
          );
          return newKey;
        });

        return {
          token: key.hashedToken,
          keyId: key.keyId,
          createdAt: key.createdAt,
        };
      } catch (error) {
        console.error("Error rotating the api key :", error);
        if (error instanceof TRPCError) {
          return {
            success: false,
            message: error.message,
          };
        }
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Oops, something went wrong. Please try again later.",
        };
      }
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
            keyId,
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
