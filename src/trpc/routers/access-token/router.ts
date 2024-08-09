import { createSecureHash, initializeAccessToken } from "@/lib/crypto";
import { AccessTokenType } from "@/prisma/enums";
import { Audit } from "@/server/audit";
import { createTRPCRouter, withAccessControl } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { TagType } from "./../../../lib/tags";

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
    .meta({ policies: { developer: { allow: ["create"] } } })
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
    .input(z.object({ tokenId: z.string() }))
    .meta({ policies: { developer: { allow: ["update"] } } })
    .mutation(async ({ ctx, input }) => {
      try {
        const {
          db,
          membership: { userId, companyId },
          session,
          requestIp,
          userAgent,
        } = ctx;
        const { user } = session;
        const { tokenId } = input;

        const key = await db.$transaction(async (tx) => {
          const existingToken = await tx.accessToken.findUnique({
            where: {
              id: tokenId,
              userId,
              active: true,
            },
          });

          if (!existingToken) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Access token not found",
            });
          }

          const { clientId, clientSecret } = initializeAccessToken({
            prefix: existingToken.typeEnum,
          });
          const hashedClientSecret = await createSecureHash(clientSecret);

          const rotated = await tx.accessToken.update({
            where: {
              id: existingToken.id,
            },
            data: {
              clientId,
              clientSecret: hashedClientSecret,
            },
          });

          await Audit.create(
            {
              action: "accessToken.rotated",
              companyId,
              actor: { type: "user", id: user.id },
              context: {
                userAgent,
                requestIp,
              },
              target: [{ type: "accessToken", id: rotated.id }],
              summary: `${user.name} rotated the access-token of rowID : ${rotated.id}`,
            },
            tx,
          );
          return rotated;
        });

        return {
          success: true,
          token: `${key.clientId}:${key.clientSecret}`,
          clientId: key.clientId,
          createdAt: key.createdAt,
        };
      } catch (error) {
        console.error("Error rotating the api access token :", error);
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
