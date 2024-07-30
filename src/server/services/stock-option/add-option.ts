import { generatePublicId } from "@/common/id";
import type { TCreateOptionSchema } from "@/server/api/schema/option";
import { Audit } from "@/server/audit";
import { db } from "@/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { TUpdateOption } from "./update-option";

type AuditPromise = ReturnType<typeof Audit.create>;

type TAddOption = Omit<TUpdateOption, "data" | "optionId"> & {
  data: TCreateOptionSchema;
  memberId: string;
};

export const addOption = async (payload: TAddOption) => {
  try {
    const { data, user, memberId } = payload;
    const documents = data.documents;

    const newOption = await db.$transaction(async (tx) => {
      const _data = {
        grantId: data.grantId,
        quantity: data.quantity,
        exercisePrice: data.exercisePrice,
        type: data.type,
        status: data.status,
        cliffYears: data.cliffYears,
        vestingYears: data.vestingYears,
        issueDate: new Date(data.issueDate),
        expirationDate: new Date(data.expirationDate),
        vestingStartDate: new Date(data.vestingStartDate),
        boardApprovalDate: new Date(data.boardApprovalDate),
        rule144Date: new Date(data.rule144Date),

        stakeholderId: data.stakeholderId,
        equityPlanId: data.equityPlanId,
        companyId: payload.companyId,
      };

      const option = await tx.option.create({ data: _data });

      let auditPromises: AuditPromise[] = [];

      if (documents && documents.length > 0) {
        const bulkDocuments = documents.map((doc) => ({
          companyId: payload.companyId,
          uploaderId: memberId,
          publicId: generatePublicId(),
          name: doc.name,
          bucketId: doc.bucketId,
          optionId: option.id,
        }));

        const docs = await tx.document.createManyAndReturn({
          data: bulkDocuments,
          skipDuplicates: true,
        });

        auditPromises = docs.map((doc) =>
          Audit.create(
            {
              action: "document.created",
              companyId: payload.companyId,
              actor: { type: "user", id: user.id },
              context: {
                userAgent: payload.userAgent,
                requestIp: payload.requestIp,
              },
              target: [{ type: "document", id: doc.id }],
              summary: `${user.name} created a document while issuing a stock option : ${doc.name}`,
            },
            tx,
          ),
        );
      }

      auditPromises.push(
        Audit.create(
          {
            action: "option.created",
            companyId: payload.companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent: payload.userAgent,
              requestIp: payload.requestIp,
            },
            target: [{ type: "option", id: option.id }],
            summary: `${user.name} issued an option for stakeholder : ${option.stakeholderId}`,
          },
          tx,
        ),
      );

      await Promise.all(auditPromises);

      return option;
    });

    return {
      success: true,
      message: "🎉 Successfully issued an option.",
      data: newOption,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientKnownRequestError) {
      // Unique constraints error code in prisma
      // Only grantId column can throw this error code
      if (error.code === "P2002") {
        return {
          success: false,
          code: "BAD_REQUEST",
          message: "Please use unique grant Id",
        };
      }
    }
    return {
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again later or contact support.",
    };
  }
};
