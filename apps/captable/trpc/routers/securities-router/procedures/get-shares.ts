import { checkMembership } from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import {
  buckets,
  db,
  documents,
  eq,
  members,
  shareClasses,
  shares,
  stakeholders,
  users,
} from "@captable/db";

export interface ShareWithRelations {
  id: string;
  certificateId: string;
  quantity: number;
  pricePerShare: number | null;
  capitalContribution: number | null;
  ipContribution: number | null;
  debtCancelled: number | null;
  otherContributions: number | null;
  cliffYears: number;
  vestingYears: number;
  companyLegends: string[];
  status: string;
  issueDate: Date;
  rule144Date: Date | null;
  vestingStartDate: Date | null;
  boardApprovalDate: Date;
  stakeholder: {
    name: string | null;
  };
  shareClass: {
    classType: string | null;
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

export const getSharesProcedure = withAuth.query(
  async ({ ctx: { session } }) => {
    const data = await db.transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      const data = await tx
        .select({
          id: shares.id,
          certificateId: shares.certificateId,
          quantity: shares.quantity,
          pricePerShare: shares.pricePerShare,
          capitalContribution: shares.capitalContribution,
          ipContribution: shares.ipContribution,
          debtCancelled: shares.debtCancelled,
          otherContributions: shares.otherContributions,
          cliffYears: shares.cliffYears,
          vestingYears: shares.vestingYears,
          companyLegends: shares.companyLegends,
          status: shares.status,
          issueDate: shares.issueDate,
          rule144Date: shares.rule144Date,
          vestingStartDate: shares.vestingStartDate,
          boardApprovalDate: shares.boardApprovalDate,
          stakeholderName: stakeholders.name,
          shareClassType: shareClasses.classType,
          // Document fields
          documentId: documents.id,
          documentName: documents.name,
          uploaderName: users.name,
          uploaderImage: users.image,
          bucketKey: buckets.key,
          bucketMimeType: buckets.mimeType,
          bucketSize: buckets.size,
        })
        .from(shares)
        .leftJoin(stakeholders, eq(shares.stakeholderId, stakeholders.id))
        .leftJoin(shareClasses, eq(shares.shareClassId, shareClasses.id))
        .leftJoin(documents, eq(documents.shareId, shares.id))
        .leftJoin(members, eq(documents.uploaderId, members.id))
        .leftJoin(users, eq(members.userId, users.id))
        .leftJoin(buckets, eq(documents.bucketId, buckets.id))
        .where(eq(shares.companyId, companyId));

      // Group the results to match the original nested structure
      const groupedData = data.reduce(
        (acc, row) => {
          const shareId = row.id;

          if (!acc[shareId]) {
            acc[shareId] = {
              id: row.id,
              certificateId: row.certificateId,
              quantity: row.quantity,
              pricePerShare: row.pricePerShare,
              capitalContribution: row.capitalContribution,
              ipContribution: row.ipContribution,
              debtCancelled: row.debtCancelled,
              otherContributions: row.otherContributions,
              cliffYears: row.cliffYears,
              vestingYears: row.vestingYears,
              companyLegends: row.companyLegends,
              status: row.status,
              issueDate: row.issueDate,
              rule144Date: row.rule144Date,
              vestingStartDate: row.vestingStartDate,
              boardApprovalDate: row.boardApprovalDate,
              stakeholder: {
                name: row.stakeholderName,
              },
              shareClass: {
                classType: row.shareClassType,
              },
              documents: [],
            };
          }

          // Add document if it exists
          if (row.documentId) {
            acc[shareId].documents.push({
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
        {} as Record<string, ShareWithRelations>,
      );

      return Object.values(groupedData);
    });

    return { data };
  },
);
