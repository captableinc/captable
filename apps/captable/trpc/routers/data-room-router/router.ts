import { env } from "@/env";
import {
  ShareDataRoomEmailJob,
  type ShareDataRoomEmailPayloadType,
} from "@/jobs/share-data-room-email";
import { generatePublicId } from "@/lib/common/id";
import { encode } from "@/lib/jwt";
import { ShareRecipientSchema } from "@/schema/contacts";
import { Audit } from "@/server/audit";
import { checkMembership } from "@/server/member";
import { createTRPCRouter, withAuth } from "@/trpc/api/trpc";
import {
  type DataRoom,
  and,
  buckets,
  companies,
  dataRoomDocuments,
  dataRoomRecipients,
  dataRooms,
  db,
  documents,
  eq,
  inArray,
} from "@captable/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { DataRoomSchema } from "./schema";

export const dataRoomRouter = createTRPCRouter({
  getDataRoom: withAuth
    .input(
      z.object({
        dataRoomPublicId: z.string(),
        include: z.object({
          company: z.boolean().optional().default(false),
          documents: z.boolean().optional().default(false),
          recipients: z.boolean().optional().default(false),
        }),
      }),
    )
    .query(async ({ ctx, input }) => {
      const response = {
        dataRoom: {},
        documents: [],
        recipients: [],
        company: {},
      } as {
        dataRoom: object;
        documents: object[];
        recipients: object[];
        company: object;
      };

      const { session } = ctx;
      const { dataRoomPublicId, include } = input;

      await db.transaction(async (tx) => {
        const { companyId } = await checkMembership({ session, tx });

        const dataRoomResult = await tx
          .select()
          .from(dataRooms)
          .where(
            and(
              eq(dataRooms.publicId, dataRoomPublicId),
              eq(dataRooms.companyId, companyId),
            ),
          )
          .limit(1);

        const dataRoom = dataRoomResult[0];
        if (!dataRoom) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Data room not found",
          });
        }

        response.dataRoom = dataRoom;

        if (include.documents) {
          const dataRoomDocs = await tx
            .select()
            .from(dataRoomDocuments)
            .where(eq(dataRoomDocuments.dataRoomId, dataRoom.id));

          const documentIds = dataRoomDocs.map((doc) => doc.documentId);

          if (documentIds.length > 0) {
            const documentsWithBuckets = await tx
              .select({
                bucketId: buckets.id,
                bucketName: buckets.name,
                bucketKey: buckets.key,
                bucketMimeType: buckets.mimeType,
                bucketSize: buckets.size,
                bucketCreatedAt: buckets.createdAt,
                bucketUpdatedAt: buckets.updatedAt,
              })
              .from(documents)
              .innerJoin(buckets, eq(documents.bucketId, buckets.id))
              .where(inArray(documents.id, documentIds));

            response.documents = documentsWithBuckets.map((doc) => ({
              id: doc.bucketId,
              name: doc.bucketName,
              key: doc.bucketKey,
              mimeType: doc.bucketMimeType,
              size: doc.bucketSize,
              createdAt: doc.bucketCreatedAt,
              updatedAt: doc.bucketUpdatedAt,
            }));
          }
        }

        if (include.recipients) {
          const recipients = await tx
            .select()
            .from(dataRoomRecipients)
            .where(eq(dataRoomRecipients.dataRoomId, dataRoom.id));

          response.recipients = await Promise.all(
            recipients.map(async (recipient) => ({
              ...recipient,
              token: await encode({
                companyId,
                dataRoomId: dataRoom.id,
                recipientId: recipient.id,
              }),
            })),
          );
        }

        if (include.company) {
          const companyResult = await tx
            .select()
            .from(companies)
            .where(eq(companies.id, companyId))
            .limit(1);

          const company = companyResult[0];
          if (company) {
            response.company = company;
          }
        }
      });

      return response;
    }),

  save: withAuth.input(DataRoomSchema).mutation(async ({ ctx, input }) => {
    try {
      let room = {} as DataRoom;
      const { session, userAgent, requestIp } = ctx;

      const { publicId } = input;

      await db.transaction(async (tx) => {
        const { companyId } = await checkMembership({ tx, session });
        const { user } = session;
        if (!publicId) {
          const [newRoom] = await tx
            .insert(dataRooms)
            .values({
              name: input.name,
              companyId,
              publicId: generatePublicId(),
              updatedAt: new Date(),
            })
            .returning();

          if (!newRoom) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create data room",
            });
          }

          room = newRoom;

          await Audit.create(
            {
              action: "dataroom.created",
              companyId: user.companyId,
              actor: { type: "user", id: user.id },
              context: {
                userAgent,
                requestIp: requestIp || "",
              },
              target: [{ type: "dataroom", id: room.id }],
              summary: `${user.name} created the data room ${room.name}`,
            },
            tx,
          );
        } else {
          const [updatedRoom] = await tx
            .update(dataRooms)
            .set({
              name: input.name,
              updatedAt: new Date(),
            })
            .where(eq(dataRooms.publicId, publicId))
            .returning();

          if (!updatedRoom) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Data room not found",
            });
          }

          room = updatedRoom;

          await Audit.create(
            {
              action: "dataroom.updated",
              companyId: user.companyId,
              actor: { type: "user", id: user.id },
              context: {
                userAgent,
                requestIp: requestIp || "",
              },
              target: [{ type: "dataroom", id: room.id }],
              summary: `${user.name} updated the data room ${room.name}`,
            },
            tx,
          );

          const { documents, recipients } = input;

          if (documents && documents.length > 0) {
            await tx.insert(dataRoomDocuments).values(
              documents.map((document) => ({
                dataRoomId: room.id,
                documentId: document.documentId,
              })),
            );
          }

          if (recipients && recipients.length > 0) {
            await tx.insert(dataRoomRecipients).values(
              recipients.map((recipient) => ({
                dataRoomId: room.id,
                email: recipient.email,
                memberId: recipient.memberId,
                stakeholderId: recipient.stakeholderId,
                updatedAt: new Date(),
              })),
            );
          }
        }
      });

      return {
        success: true,
        message: "Successfully updated data room",
        data: room,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message:
          "Oops, something went wrong while saving data room. Please try again.",
      };
    }
  }),

  share: withAuth
    .input(
      z.object({
        dataRoomId: z.string(),
        others: z.array(ShareRecipientSchema),
        selectedContacts: z.array(ShareRecipientSchema),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { session, requestIp, userAgent } = ctx;
      const { dataRoomId, others, selectedContacts } = input;
      const { name: senderName, email: _senderEmail, companyId } = session.user;
      const { user } = session;

      const dataRoomResult = await db
        .select()
        .from(dataRooms)
        .innerJoin(companies, eq(dataRooms.companyId, companies.id))
        .where(
          and(eq(dataRooms.id, dataRoomId), eq(dataRooms.companyId, companyId)),
        )
        .limit(1);

      const dataRoomData = dataRoomResult[0];
      if (!dataRoomData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Data room not found",
        });
      }

      const { data_rooms: dataRoom } = dataRoomData;
      const company = dataRoomData.companies;

      const upsertManyRecipients = async () => {
        const baseUrl = env.NEXT_PUBLIC_BASE_URL;
        const recipients = [...others, ...selectedContacts];

        for (const recipient of recipients) {
          const email = (recipient.email || recipient.value).trim();
          if (!email) {
            throw new Error("Email is required");
          }

          const memberOrStakeholderId =
            recipient.type === "member"
              ? { memberId: recipient.id }
              : recipient.type === "stakeholder"
                ? { stakeholderId: recipient.id }
                : {};

          const { recipientRecord } = await db.transaction(async (tx) => {
            // Check if recipient already exists
            const existingRecipient = await tx
              .select()
              .from(dataRoomRecipients)
              .where(
                and(
                  eq(dataRoomRecipients.dataRoomId, dataRoomId),
                  eq(dataRoomRecipients.email, email),
                ),
              )
              .limit(1);

            let recipientRecord: typeof dataRoomRecipients.$inferSelect;
            if (existingRecipient[0]) {
              // Update existing recipient
              const [updated] = await tx
                .update(dataRoomRecipients)
                .set({
                  name: recipient.name,
                  ...memberOrStakeholderId,
                  updatedAt: new Date(),
                })
                .where(eq(dataRoomRecipients.id, existingRecipient[0].id))
                .returning();

              if (!updated) {
                throw new TRPCError({
                  code: "INTERNAL_SERVER_ERROR",
                  message: "Failed to update recipient",
                });
              }
              recipientRecord = updated;
            } else {
              // Create new recipient
              const [created] = await tx
                .insert(dataRoomRecipients)
                .values({
                  dataRoomId,
                  name: recipient.name,
                  email,
                  ...memberOrStakeholderId,
                  updatedAt: new Date(),
                })
                .returning();

              if (!created) {
                throw new TRPCError({
                  code: "INTERNAL_SERVER_ERROR",
                  message: "Failed to create recipient",
                });
              }
              recipientRecord = created;
            }

            return { recipientRecord };
          });

          if (!recipientRecord) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to upsert recipient",
            });
          }

          const token = await encode({
            companyId,
            dataRoomId,
            recipientId: recipientRecord.id,
          });

          const link = `${baseUrl}/data-rooms/${dataRoom.publicId}?token=${token}`;

          const payload: ShareDataRoomEmailPayloadType = {
            to: email,
            senderName: `${senderName}`,
            recipientName: recipient.name,
            companyName: company.name,
            dataRoom: dataRoom.name,
            link,
          };

          await new ShareDataRoomEmailJob().emit(payload);

          await db.transaction(async (tx) => {
            await Audit.create(
              {
                action: "dataroom.shared",
                companyId: user.companyId,
                actor: { type: "user", id: user.id },
                context: {
                  userAgent,
                  requestIp: requestIp || "",
                },
                target: [{ type: "dataroom", id: dataRoom.id }],
                summary: `${user.name} shared the data room ${dataRoom.name}`,
              },
              tx,
            );
          });
        }
      };

      await upsertManyRecipients();

      return {
        success: true,
        message: "Data room successfully shared!",
      };
    }),

  unShare: withAuth
    .input(
      z.object({
        dataRoomId: z.string(),
        recipientId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { session, requestIp, userAgent } = ctx;
      const { dataRoomId, recipientId } = input;
      const companyId = session.user.companyId;
      const { user } = session;

      const dataRoomResult = await db
        .select()
        .from(dataRooms)
        .where(
          and(eq(dataRooms.id, dataRoomId), eq(dataRooms.companyId, companyId)),
        )
        .limit(1);

      const dataRoom = dataRoomResult[0];
      if (!dataRoom) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Data room not found",
        });
      }

      await db.transaction(async (tx) => {
        await tx
          .delete(dataRoomRecipients)
          .where(
            and(
              eq(dataRoomRecipients.id, recipientId),
              eq(dataRoomRecipients.dataRoomId, dataRoomId),
            ),
          );

        await Audit.create(
          {
            action: "dataroom.deleted",
            companyId: user.companyId,
            actor: { type: "user", id: user.id },
            context: {
              userAgent,
              requestIp: requestIp || "",
            },
            target: [{ type: "dataroom", id: dataRoom.id }],
            summary: `${user.name} deleted the data room ${dataRoom.name}`,
          },
          tx,
        );
      });

      return {
        success: true,
        message: "Successfully removed access to data room!",
      };
    }),
});
