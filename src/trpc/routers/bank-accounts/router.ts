import { Audit } from "@/server/audit";
import { createApiToken } from "@/lib/crypto";
import { createTRPCRouter, withAccessControl } from "@/trpc/api/trpc";
import { TRPCError } from "@trpc/server";
import { BankAccountTypeEnum } from "@/prisma/enums";

import z from "zod";
import { Prisma } from "@prisma/client";

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
    .input(
      z
        .object({
          beneficiaryName: z.string().min(1, {
            message: "Beneficiary Name is required",
          }),
          beneficiaryAddress: z.string().min(1, {
            message: "Beneficiary Address is required",
          }),
          bankName: z.string().min(1, {
            message: "Bank Name is required",
          }),
          bankAddress: z.string().min(1, {
            message: "Bank Address is required",
          }),
          accountNumber: z.string().min(1, {
            message: "Account Number is required",
          }),
          routingNumber: z.string().min(1, {
            message: "Routing Number is required",
          }),
          confirmRoutingNumber: z.string().min(1, {
            message: "Confirm Routing Number is required",
          }),
          accountType: z.nativeEnum(BankAccountTypeEnum).default("CHECKING"),
          isPrimary: z.boolean().default(false),
        })
        .refine((data) => data.routingNumber === data.confirmRoutingNumber, {
          path: ["confirmRoutingNumber"],
          message: "Routing Number does not match",
        })
    )
    .meta({ policies: { "bank-accounts": { allow: ["create"] } } })
    .mutation(async ({ ctx, input }) => {
      const {
        db,
        membership: { companyId, memberId },
        userAgent,
        requestIp,
        session,
      } = ctx;

      const token = createApiToken();
      const user = session.user;

      try {
        const newBankAccount = await db.bankAccount.create({
          data: {
            beneficiaryName: input.beneficiaryName,
            beneficiaryAddress: input.beneficiaryAddress,
            bankName: input.bankName,
            bankAddress: input.bankAddress,
            routingNumber: input.routingNumber,
            accountNumber: input.accountNumber,
            accountType: input.accountType,
            primary: input.isPrimary,
            companyId: companyId,
          },
        });
  
        await Audit.create(
          {
            action: "bankAccount.created",
            companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp,
            },
            target: [{ type: "bankAccount", id: newBankAccount.id }],
            summary: `${user.name} connected a new Bank Account ${newBankAccount.id}`,
          },
          db
        );
  
        return {
          id: newBankAccount.id,
          token,
          message: "Bank Account created!"
        };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError ) {
          if ( error.code === 'P2002' ) {
            return {
              success: false,
              message: "Looks like you have created both primary and non-primary accounts"
            }
            
          }
        }

        if (error instanceof TRPCError) {
          return {
            success: false,
            message: error.message,
          };
        }
        return {
          success: false,
          message: "Oops, looks like something went wrong!"
      }
    }}
  ),

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

        return {
          success: true,
          message: "Bank Account has been deleted"
        }
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
