import { generatePublicId } from "@/common/id";
import { createApiToken, createSecureHash } from "@/lib/crypto";
import { Audit } from "@/server/audit";
import { createTRPCRouter, withAccessControl } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const bankAccountsRouter = createTRPCRouter({
  getAll: withAccessControl
    .meta({ policies: { "bank-accounts": { allow: ["read"] } } })
    .query(async ({ ctx }) => {
      const {
        db,
        membership: { companyId },
      } = ctx;

      const bankAccounts = await db.bankAccount.findMany({
        where: {
          companyId,
        },

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          bankName: true,
          accountNumber: true,
          primary: true,
          createdAt: true,
        },
      });

      return {
        bankAccounts,
      };
    }),

  create: withAccessControl
    .meta({ policies: { "bank-accounts": { allow: ["create"] } } })
    .mutation(async ({ ctx }) => {
      // const {
      //   db,
      //   membership: { companyId, memberId },
      // } = ctx;
      // TODO // Implement create mutation
    }),

  delete: withAccessControl
    .input(z.object({ id: z.string() }))
    .meta({ policies: { "bank-accounts": { allow: ["delete"] } } })
    .mutation(async ({ ctx, input }) => {
      const {
        db,
        membership: { memberId, companyId },
        session,
        requestIp,
        userAgent,
      } = ctx;

      const { id } = input;
      const { user } = session;

      try {
        const bankAccount = await db.bankAccount.delete({
          where: {
            id,
            companyId,
          },
        });

        await Audit.create(
          {
            action: "bankAccount.deleted",
            companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp,
            },
            target: [{ type: "bankAccount", id: bankAccount.id }],
            summary: `${user.name} deleted the bank account ${bankAccount.id}`,
          },
          db
        );
      } catch (error) {
        console.error("Error deleting bank account :", error);
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
