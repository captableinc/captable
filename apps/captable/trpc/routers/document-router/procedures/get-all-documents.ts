import { withAccessControl } from "@/trpc/api/trpc";
import { buckets, db, desc, documents, eq, members, users } from "@captable/db";

export const getAllDocumentsProcedure = withAccessControl
  .meta({ policies: { documents: { allow: ["read"] } } })
  .query(
    async ({
      ctx: {
        membership: { companyId },
      },
    }) => {
      const rawData = await db
        .select({
          id: documents.id,
          name: documents.name,
          companyId: documents.companyId,
          uploaderId: documents.uploaderId,
          bucketId: documents.bucketId,
          createdAt: documents.createdAt,
          updatedAt: documents.updatedAt,
          uploaderUserName: users.name,
          bucketDetailId: buckets.id,
          bucketKey: buckets.key,
          bucketMimeType: buckets.mimeType,
          bucketSize: buckets.size,
          bucketName: buckets.name,
        })
        .from(documents)
        .leftJoin(members, eq(documents.uploaderId, members.id))
        .leftJoin(users, eq(members.userId, users.id))
        .leftJoin(buckets, eq(documents.bucketId, buckets.id))
        .where(eq(documents.companyId, companyId))
        .orderBy(desc(documents.createdAt));

      const data = rawData.map((row) => ({
        id: row.id,
        name: row.name,
        companyId: row.companyId,
        uploaderId: row.uploaderId,
        bucketId: row.bucketId,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        uploader: {
          user: {
            name: row.uploaderUserName,
          },
        },
        bucket: {
          id: row.bucketDetailId,
          key: row.bucketKey,
          mimeType: row.bucketMimeType,
          size: row.bucketSize,
          name: row.bucketName,
        },
      }));

      return data;
    },
  );
