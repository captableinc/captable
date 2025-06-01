import { checkMembership } from "@/server/member";
import { withAuth } from "@/trpc/api/trpc";
import {
  buckets,
  db,
  documents,
  eq,
  members,
  options,
  stakeholders,
  users,
} from "@captable/db";

export interface OptionWithRelations {
  id: string;
  grantId: string;
  quantity: number;
  exercisePrice: number;
  type: string;
  status: string;
  cliffYears: number;
  vestingYears: number;
  issueDate: Date;
  expirationDate: Date;
  vestingStartDate: Date;
  boardApprovalDate: Date;
  rule144Date: Date;
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

export const getOptionsProcedure = withAuth.query(
  async ({ ctx: { session } }) => {
    const data = await db.transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx });

      const data = await tx
        .select({
          id: options.id,
          grantId: options.grantId,
          quantity: options.quantity,
          exercisePrice: options.exercisePrice,
          type: options.type,
          status: options.status,
          cliffYears: options.cliffYears,
          vestingYears: options.vestingYears,
          issueDate: options.issueDate,
          expirationDate: options.expirationDate,
          vestingStartDate: options.vestingStartDate,
          boardApprovalDate: options.boardApprovalDate,
          rule144Date: options.rule144Date,
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
        .from(options)
        .leftJoin(stakeholders, eq(options.stakeholderId, stakeholders.id))
        .leftJoin(documents, eq(documents.optionId, options.id))
        .leftJoin(members, eq(documents.uploaderId, members.id))
        .leftJoin(users, eq(members.userId, users.id))
        .leftJoin(buckets, eq(documents.bucketId, buckets.id))
        .where(eq(options.companyId, companyId));

      // Group the results to match the original nested structure
      const groupedData = data.reduce(
        (acc, row) => {
          const optionId = row.id;

          if (!acc[optionId]) {
            acc[optionId] = {
              id: row.id,
              grantId: row.grantId,
              quantity: row.quantity,
              exercisePrice: row.exercisePrice,
              type: row.type,
              status: row.status,
              cliffYears: row.cliffYears,
              vestingYears: row.vestingYears,
              issueDate: row.issueDate,
              expirationDate: row.expirationDate,
              vestingStartDate: row.vestingStartDate,
              boardApprovalDate: row.boardApprovalDate,
              rule144Date: row.rule144Date,
              stakeholder: {
                name: row.stakeholderName,
              },
              documents: [],
            };
          }

          // Add document if it exists
          if (row.documentId) {
            acc[optionId].documents.push({
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
        {} as Record<string, OptionWithRelations>,
      );

      return Object.values(groupedData);
    });

    return { data };
  },
);
