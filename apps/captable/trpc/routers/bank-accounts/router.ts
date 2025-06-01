import { createTRPCRouter, withAccessControl } from "@/trpc/api/trpc";
import { bankAccounts, db, desc, eq } from "@captable/db";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const bankAccountsRouter = createTRPCRouter({
  getAll: withAccessControl
    .meta({ policies: { "bank-accounts": { allow: ["read"] } } })
    .query(async ({ ctx }) => {
      const {
        membership: { companyId },
      } = ctx;

      const bankAccountsData = await db
        .select({
          id: bankAccounts.id,
          bankName: bankAccounts.bankName,
          accountNumber: bankAccounts.accountNumber,
          primary: bankAccounts.primary,
          createdAt: bankAccounts.createdAt,
        })
        .from(bankAccounts)
        .where(eq(bankAccounts.companyId, companyId))
        .orderBy(desc(bankAccounts.createdAt));

      return {
        bankAccounts: bankAccountsData,
      };
    }),

  create: withAccessControl
    .meta({ policies: { "bank-accounts": { allow: ["create"] } } })
    .mutation(({ ctx: _ctx }) => {
      // const {
      //   db,
      //   session: { user },
      // } = ctx;

      // TODO: Implement bank account creation
      throw new TRPCError({
        code: "NOT_IMPLEMENTED",
        message: "Bank account creation not yet implemented",
      });
    }),

  delete: withAccessControl
    .input(z.object({ id: z.string() }))
    .meta({ policies: { "bank-accounts": { allow: ["delete"] } } })
    .mutation(({ ctx: _ctx, input: _input }) => {
      // const {
      //   db,
      //   membership: { memberId, companyId },
      // } = ctx;
      // TODO // Implement delete mutation
    }),
});
