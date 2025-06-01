import fs from "node:fs";
import path from "node:path";
import { generatePublicId } from "@/lib/common/id";
import { uploadFile } from "@/lib/common/uploads";
import { invariant } from "@/lib/error";
import { TAG } from "@/lib/tags";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import { type SafeTemplateEnum, db, safes } from "@captable/db";
import type { Safe } from "@captable/db";
import { createBucketHandler } from "../../bucket-router/procedures/create-bucket";
import { createTemplateHandler } from "../../template-router/procedures/create-template";
import { ZodCreateSafeMutationSchema } from "../schema";

export const createSafeProcedure = withAuth
  .input(ZodCreateSafeMutationSchema)
  .mutation(async ({ ctx, input }) => {
    const { userAgent, requestIp, session } = ctx;
    const user = ctx.session.user;
    const safeTemplate = input.safeTemplate;

    const { orderedDelivery, recipients, ...inputRest } = input;

    try {
      let uploadData: Awaited<ReturnType<typeof uploadFile>> | null = null;
      let document: { name: string; bucketId: string } | null = null;

      if (input.safeTemplate !== "CUSTOM") {
        const pdfPath = path.join(
          process.cwd(),
          "public",
          "yc",
          `${safeTemplate}.pdf`,
        );
        const pdfBuffer = fs.readFileSync(pdfPath);

        const file = {
          name: safeTemplate,
          type: "application/pdf",
          arrayBuffer: async () => Promise.resolve(pdfBuffer),
          size: pdfBuffer.byteLength,
        } as unknown as File;

        uploadData = await uploadFile(
          file,
          {
            identifier: "templates",
            keyPrefix: "new-safes",
          },
          "privateBucket",
        );
      }

      const { template } = await db.transaction(async (tx) => {
        const { companyId, memberId } = await checkMembership({
          session,
          tx,
        });

        if (uploadData) {
          const { fileUrl: _fileUrl, ...rest } = uploadData;
          const { name: bucketName, id: bucketId } = await createBucketHandler({
            db: tx,
            input: { ...rest, tags: [TAG.SAFE] },
            userAgent,
            requestIp: requestIp || "",
            user: {
              companyId: user.companyId,
              id: user.id,
              name: user.name || "",
            },
          });

          document = { name: bucketName, bucketId };
        }

        if (input.safeTemplate === "CUSTOM") {
          document = input.document;
        }

        invariant(document, "document not found");

        const partialUser = {
          name: user.name || "",
          id: user.id,
          companyId: user.companyId,
        };
        const template = await createTemplateHandler({
          ctx: {
            db: tx,
            userAgent,
            requestIp: requestIp || "",
            user: partialUser,
          },
          input: {
            ...document,
            uploaderId: memberId,
            companyId,
            orderedDelivery,
            recipients,
          },
        });

        let safeData: Omit<Safe, "id" | "createdAt">;

        if (inputRest.safeTemplate === "CUSTOM") {
          const { document, ...rest } = inputRest;

          safeData = {
            ...rest,
            publicId: generatePublicId(),
            companyId,
            boardApprovalDate: new Date(rest.boardApprovalDate),
            issueDate: new Date(rest.issueDate),
            updatedAt: new Date(),
            type: "POST_MONEY",
            status: "DRAFT",
            mfn: false,
            additionalTerms: null,
            discountRate: rest.discountRate ?? null,
          };
        } else {
          safeData = {
            ...inputRest,
            publicId: generatePublicId(),
            companyId,
            boardApprovalDate: new Date(inputRest.boardApprovalDate),
            issueDate: new Date(inputRest.issueDate),
            updatedAt: new Date(),
            type: "POST_MONEY",
            status: "DRAFT",
            mfn: false,
            additionalTerms: null,
            discountRate: inputRest.discountRate ?? null,
            safeTemplate: inputRest.safeTemplate as SafeTemplateEnum,
          };
        }

        await tx.insert(safes).values(safeData);

        await Audit.create(
          {
            action: "safe.created",
            companyId: user.companyId,
            actor: { type: "user", id: ctx.session.user.id },
            context: { requestIp: requestIp || "", userAgent },
            target: [{ type: "company", id: user.companyId }],
            summary: `${ctx.session.user.name} created a new SAFE agreement with YC template.`,
          },
          tx,
        );

        return { template };
      });

      return {
        success: true as const,
        message: "Created SAFEs agreement with custom template.",
        template,
      };
    } catch (error) {
      console.error("Error creating safe:", error);
      return {
        success: false as const,
        message: "Oops ! Something went wrong. Please try again later",
      };
    }
  });
