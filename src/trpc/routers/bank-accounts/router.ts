import { generatePublicId } from "@/common/id";
import { createApiToken, createSecureHash } from "@/lib/crypto";
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
      // const {
      //   db,
      //   membership: { memberId, companyId },
      // } = ctx;
      // TODO // Implement delete mutation
    }),
});
