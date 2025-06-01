import { checkMembership } from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import {
  buckets,
  db,
  documents,
  eq,
  members,
  safes,
  stakeholders,
  users,
} from "@captable/db";

export interface SafeWithRelations {
  id: string;
  publicId: string;
  type: string;
  status: string;
  capital: number;
  safeTemplate: string | null;
  valuationCap: number | null;
  discountRate: number | null;
  mfn: boolean;
  proRata: boolean;
  additionalTerms: string | null;
  issueDate: Date;
  boardApprovalDate: Date;
  stakeholder: {
    name: string | null;
  };
  documents: Array<{
    id: string;
    name: string;
    uploader: {
      user: {
        name: string | null;
        image: string | null;
      };
    };
    bucket: {
      key: string | null;
      mimeType: string | null;
      size: number | null;
    };
  }>;
}

export const getSafesProcedure = withAuth.query(
  async ({ ctx: { session } }) => {
    const data = await db.transaction(async (tx) => {
      const { companyId } = await checkMembership({ tx, session });

      const data = await tx
        .select({
          id: safes.id,
          publicId: safes.publicId,
          type: safes.type,
          status: safes.status,
          capital: safes.capital,
          safeTemplate: safes.safeTemplate,
          valuationCap: safes.valuationCap,
          discountRate: safes.discountRate,
          mfn: safes.mfn,
          proRata: safes.proRata,
          additionalTerms: safes.additionalTerms,
          issueDate: safes.issueDate,
          boardApprovalDate: safes.boardApprovalDate,
          stakeholderName: stakeholders.name,
          // Document fields
          documentId: documents.id,
          documentName: documents.name,
          uploaderName: users.name,
          uploaderImage: users.image,
          bucketKey: buckets.key,
          bucketMimeType: buckets.mimeType,
          bucketSize: buckets.size,
        })
        .from(safes)
        .leftJoin(stakeholders, eq(safes.stakeholderId, stakeholders.id))
        .leftJoin(documents, eq(documents.safeId, safes.id))
        .leftJoin(members, eq(documents.uploaderId, members.id))
        .leftJoin(users, eq(members.userId, users.id))
        .leftJoin(buckets, eq(documents.bucketId, buckets.id))
        .where(eq(safes.companyId, companyId));

      // Group the results to match the original nested structure
      const groupedData = data.reduce(
        (acc, row) => {
          const safeId = row.id;

          if (!acc[safeId]) {
            acc[safeId] = {
              id: row.id,
              publicId: row.publicId,
              type: row.type,
              status: row.status,
              capital: row.capital,
              safeTemplate: row.safeTemplate,
              valuationCap: row.valuationCap,
              discountRate: row.discountRate,
              mfn: row.mfn,
              proRata: row.proRata,
              additionalTerms: row.additionalTerms,
              issueDate: row.issueDate,
              boardApprovalDate: row.boardApprovalDate,
              stakeholder: {
                name: row.stakeholderName,
              },
              documents: [],
            };
          }

          // Add document if it exists
          if (row.documentId) {
            acc[safeId].documents.push({
              id: row.documentId,
              name: row.documentName || "",
              uploader: {
                user: {
                  name: row.uploaderName,
                  image: row.uploaderImage,
                },
              },
              bucket: {
                key: row.bucketKey,
                mimeType: row.bucketMimeType,
                size: row.bucketSize,
              },
            });
          }

          return acc;
        },
        {} as Record<string, SafeWithRelations>,
      );

      return Object.values(groupedData);
    });

    return { data };
  },
);
