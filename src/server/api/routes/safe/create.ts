import { customId, generatePublicId } from "@/common/id";
import { safeSigningEmailJob } from "@/jobs/safe-signing-email";
import {
  CreateStakeholderSchema,
  StakeholderSchema,
} from "@/server/api/schema/stakeholder";
import {
  authMiddleware,
  withAuthApiV1,
} from "@/server/api/utils/endpoint-creator";
import { z } from "@hono/zod-openapi";
import {
  CreateSafeSchema,
  SafeSchema,
  type TSafeSchema,
} from "../../schema/safe";

const ResponseSchema = z.object({
  message: z.string(),
  data: SafeSchema,
});

const ParamsSchema = z.object({
  companyId: z.string().openapi({
    param: {
      name: "companyId",
      in: "path",
    },
    description: "Company ID",
    type: "string",
    example: "clxwbok580000i7nge8nm1ry0",
  }),
});

export const create = withAuthApiV1
  .createRoute({
    method: "post",
    path: "/v1/{companyId}/safes",
    summary: "Create SAFEs",
    description: "Add one or more SAFEs to a company.",
    tags: ["SAFEs"],
    middleware: [authMiddleware()],
    request: {
      params: ParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: CreateSafeSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: ResponseSchema,
          },
        },
        description:
          "Confirmation of stakeholder created with relevant details.",
      },
    },
  })
  .handler(async (c) => {
    const { db } = c.get("services");
    const { membership } = c.get("session");

    const body = c.req.valid("json");

    const { safe, emailList } = await db.$transaction(async (tx) => {
      const stakeholder = await tx.stakeholder.findFirstOrThrow({
        where: {
          id: body.signerStakeholderId,
          companyId: membership.companyId,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      const member = await tx.member.findFirstOrThrow({
        where: {
          id: body.signerMemberId,
          companyId: membership.companyId,
        },
        select: {
          id: true,
          workEmail: true,
          user: {
            select: {
              email: true,
              name: true,
            },
          },
          company: {
            select: {
              name: true,
            },
          },
        },
      });

      const bankAccount = await tx.bankAccount.findFirstOrThrow({
        where: {
          id: body.bankAccountId,
        },
        select: {
          id: true,
        },
      });

      const signerMember = await tx.safeSignerMember.create({
        data: {
          memberId: member.id,
          fields: {
            create: {
              type: "SIGNATURE",
              name: "Signature",
              required: true,
            },
          },
        },
        select: {
          id: true,
        },
      });

      const signerStakeholder = await tx.safeSignerStakeholder.create({
        data: {
          stakeholderId: stakeholder.id,
          fields: {
            create: {
              type: "SIGNATURE",
              name: "Signature",
              required: true,
            },
          },
        },
        select: {
          id: true,
        },
      });

      const signerStakeholderToken = await tx.safeSigningToken.create({
        data: {
          token: generatePublicId(),
          signerStakeholderId: signerStakeholder.id,
        },
        select: {
          token: true,
        },
      });

      const signerMemberToken = await tx.safeSigningToken.create({
        data: {
          token: generatePublicId(),
          signerMemberId: signerMember.id,
        },
        select: {
          token: true,
        },
      });

      const { signerMemberId, signerStakeholderId, ...rest } = body;

      const safe = await tx.safe.create({
        data: {
          ...rest,
          publicId: generatePublicId(),
          signerMemberId: signerMember.id,
          signerStakeholderId: signerStakeholder.id,
          companyId: membership.companyId,
          bankAccountId: bankAccount.id,
          issueDate: new Date(rest.issueDate),
        },
      });

      const emailList = [
        {
          data: {
            email: stakeholder.email,
            token: signerStakeholderToken.token,
            name: stakeholder.name,
          },
        },
        {
          data: {
            email: member.workEmail ?? (member.user.email as string),
            token: signerMemberToken.token,
            name: member.user.name ?? "Unknown user",
          },
        },
      ].map((item) => ({
        data: {
          ...item.data,
          type: body.type === "POST_MONEY" ? "Post money" : "Pre Money",
          companyName: member.company.name,
          investmentAmount: String(body.capital),
        },
      }));

      return { safe, emailList };
    });

    const data: TSafeSchema = {
      ...safe,
      createdAt: new Date(safe.createdAt).toISOString(),
      updatedAt: new Date(safe.updatedAt).toISOString(),
      issueDate: new Date(safe.issueDate).toISOString(),
      boardApprovalDate: safe.boardApprovalDate
        ? new Date(safe.boardApprovalDate).toISOString()
        : safe.boardApprovalDate,
    };

    await safeSigningEmailJob.bulkEmit(emailList);

    return c.json({ data, message: "safe created successfully" });
  });
