import { getPresignedGetUrl } from "@/server/file-uploads";
import { withAccessControl } from "@/trpc/api/trpc";
import { and, buckets, db, documents, eq } from "@captable/db";
import { TRPCError } from "@trpc/server";
import { ZodGetDocumentQuerySchema } from "../schema";

export const getDocumentProcedure = withAccessControl
  .input(ZodGetDocumentQuerySchema)
  .meta({ policies: { documents: { allow: ["read"] } } })
  .query(
    async ({
      ctx: {
        membership: { companyId },
      },
      input,
    }) => {
      const result = await db
        .select({
          bucketKey: buckets.key,
        })
        .from(documents)
        .innerJoin(buckets, eq(documents.bucketId, buckets.id))
        .where(
          and(
            eq(documents.publicId, input.publicId),
            eq(documents.companyId, companyId),
          ),
        )
        .limit(1);

      const data = result[0];
      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found",
        });
      }

      if (!data.bucketKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Document bucket key not found",
        });
      }

      return getPresignedGetUrl(data.bucketKey);
    },
  );
