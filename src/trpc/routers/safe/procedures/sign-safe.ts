import { uploadFile } from "@/common/uploads";
import { PostMoneyDiscount } from "@/components/safe/templates";
import { TAG } from "@/lib/tags";
import type { TPrismaOrTransaction } from "@/server/db";
import { withoutAuth } from "@/trpc/api/trpc";
import { renderToBuffer } from "@react-pdf/renderer";
import { createBucketHandler } from "../../bucket-router/procedures/create-bucket";
import { createDocumentHandler } from "../../document-router/procedures/create-document";
import { SignSafeSchema } from "../schema";

export const signSafeProcedure = withoutAuth
  .input(SignSafeSchema)
  .mutation(async ({ ctx, input }) => {
    const safe = await ctx.db.safe.findFirstOrThrow({
      where: {
        id: input.safeId,
      },
      select: {
        id: true,
        companyId: true,
        status: true,
        signerStakeholder: {
          select: {
            id: true,
            status: true,
            stakeholderId: true,
            fields: true,
          },
        },
        signerMember: {
          select: {
            id: true,
            status: true,
            memberId: true,
            fields: true,
          },
        },
      },
    });

    let safeSignerMemberStatus = safe.signerMember.status;
    let safeSignerStakeholderStatus = safe.signerStakeholder.status;

    let investorSignature =
      safe.signerStakeholder.fields[0]?.prefilledValue ?? undefined;
    let memberSignature =
      safe.signerMember.fields[0]?.prefilledValue ?? undefined;

    const token = await ctx.db.safeSigningToken.findFirstOrThrow({
      where: {
        token: input.token,
        OR: [
          { signerMemberId: safe.signerMember.id },
          {
            signerStakeholderId: safe.signerStakeholder.id,
          },
        ],
      },
      select: {
        signerMemberId: true,
        signerStakeholderId: true,
      },
    });

    if (token.signerMemberId) {
      const [signatureField] = await saveFieldValues(
        safe.signerMember.fields,
        input.data,
        ctx.db,
      );

      if (!signatureField) {
        throw new Error("signature filed not found");
      }

      memberSignature = signatureField;

      await ctx.db.safeSignerMember.update({
        where: { id: token.signerMemberId },
        data: {
          status: "SIGNED",
        },
      });
      safeSignerMemberStatus = "SIGNED";
    }

    if (token.signerStakeholderId) {
      const [signatureField] = await saveFieldValues(
        safe.signerStakeholder.fields,
        input.data,
        ctx.db,
      );

      if (!signatureField) {
        throw new Error("signature filed not found");
      }

      investorSignature = signatureField;

      await ctx.db.safeSignerStakeholder.update({
        where: { id: token.signerStakeholderId },
        data: {
          status: "SIGNED",
        },
      });
      safeSignerStakeholderStatus = "SIGNED";
    }

    const allStatus = [safeSignerMemberStatus, safeSignerStakeholderStatus];

    const hasUnSignedFields = allStatus.includes("PENDING");

    if (!hasUnSignedFields) {
      const { investor, company, sender } = await ctx.db.$transaction(
        async (tx) => {
          const investor = await tx.stakeholder.findFirstOrThrow({
            where: {
              id: safe.signerStakeholder.stakeholderId,
            },
            select: {
              name: true,
              streetAddress: true,
              email: true,
              currentRelationship: true,
            },
          });

          const company = await tx.company.findFirstOrThrow({
            where: {
              id: safe.companyId,
            },
            select: {
              name: true,
              state: true,
              streetAddress: true,
            },
          });

          const sender = await tx.member.findFirstOrThrow({
            where: {
              id: safe.signerMember.memberId,
            },
            select: {
              workEmail: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          });

          return { investor, company, sender };
        },
      );

      const documentBuffer = await renderToBuffer(
        PostMoneyDiscount({
          company: {
            name: company.name,
            state: company.state,
            address: company.streetAddress,
          },
          sender: {
            email: sender?.workEmail ?? sender?.user?.email ?? "unknown email",
            name: sender.user.name ?? "unknown member",
            title: "company representative",
            signature: memberSignature,
          },
          date: new Date().toISOString(),
          investment: 3434,
          discountRate: 21,
          investor: {
            name: investor.name,
            email: investor.email,
            address: investor.streetAddress,
            title: investor.currentRelationship,
            signature: investorSignature,
          },
          options: {
            author: "Y Combinator",
            creator: "Captable, Inc.",
            producer: "Captable, Inc.",
            title: "YC SAFE - Post Money Discount",
            subject: "YC SAFE - Post Money Discount",
            keywords: "YC, SAFE, Post Money, Discount",
          },
        }),
      );

      const file = {
        name: "safe",
        type: "application/pdf",
        arrayBuffer: async () => Promise.resolve(documentBuffer),
        size: 0,
      } as unknown as File;

      const { fileUrl, ...bucketData } = await uploadFile(file, {
        identifier: safe.companyId,
        keyPrefix: "new-safes",
      });

      const { id: bucketId, name } = await createBucketHandler({
        db: ctx.db,
        input: { ...bucketData, tags: [TAG.SAFE] },
        userAgent: ctx.userAgent,
        requestIp: ctx.requestIp,
      });

      await createDocumentHandler({
        input: { bucketId, name, safeId: safe.id },
        requestIp: ctx.requestIp,
        db: ctx.db,
        userAgent: ctx.userAgent,
        companyId: safe.companyId,
        uploaderName: "",
      });
    }

    return {};
  });

async function saveFieldValues(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  fields: Record<string, any>[],
  data: Record<string, string>,
  tx: TPrismaOrTransaction,
) {
  const values = [];

  for (const field of fields) {
    const value = data?.[field?.id];

    if (value) {
      await tx.documentCustomField.update({
        where: {
          id: field.id,
        },
        data: {
          prefilledValue: value,
        },
      });

      values.push(value);
    }
  }

  return values;
}
