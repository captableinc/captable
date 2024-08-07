import { createSecureHash, initializeAccessToken } from "@/lib/crypto";
import { AccessTokenType } from "@/prisma/enums";
import { Audit } from "@/server/audit";
import { createTRPCRouter, withAccessControl } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const accessTokenRouter = createTRPCRouter({
  listAll: withAccessControl
    .input(z.object({ typeEnum: z.nativeEnum(AccessTokenType) }))
    .query(async ({ ctx, input }) => {
      const {
        db,
        membership: { userId },
      } = ctx;

      const { typeEnum } = input;

      const accessTokens = await db.accessToken.findMany({
        where: {
          active: true,
          userId,
          typeEnum,
        },

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          clientId: true,
          createdAt: true,
          lastUsed: true,
        },
      });

      return {
        accessTokens,
      };
    }),

  create: withAccessControl
    .input(z.object({ typeEnum: z.nativeEnum(AccessTokenType) }))
    .mutation(async ({ ctx, input }) => {
      const {
        db,
        membership: { userId, companyId },
        userAgent,
        requestIp,
        session,
      } = ctx;

      const { typeEnum } = input;

      const { clientId, clientSecret } = initializeAccessToken({
        prefix: typeEnum,
      });

      const user = session.user;
      const hashedClientSecret = await createSecureHash(clientSecret);

      const key = await db.accessToken.create({
        data: {
          userId,
          typeEnum,
          clientId,
          clientSecret: hashedClientSecret,
        },
      });

      await Audit.create(
        {
          action: "accessToken.created",
          companyId,
          actor: { type: "user", id: user.id },
          context: {
            userAgent,
            requestIp,
          },
          target: [{ type: "accessToken", id: key.id }],
          summary: `${user.name} created an access token - ${clientId}`,
        },
        db,
      );

      return {
        token: `${clientId}:${clientSecret}`,
        partialKey: clientId,
        createdAt: key.createdAt,
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
    .input(z.object({ tokenId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const {
        db,
        membership: { userId, companyId },
        session,
        requestIp,
        userAgent,
      } = ctx;
      const { tokenId } = input;
      const { user } = session;
      try {
        const key = await db.accessToken.delete({
          where: {
            id: tokenId,
            userId,
          },
        });

        await Audit.create(
          {
            action: "accessToken.deleted",
            companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp,
            },
            target: [{ type: "accessToken", id: key.id }],
            summary: `${user.name} deleted an access token - ${key.clientId}`,
          },
          db,
        );

        return {
          success: true,
          message: "Key deleted Successfully.",
        };
      } catch (error) {
        console.error("Error deleting the access token :", error);
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
