import { Audit } from "@/server/audit";
import { withAuth } from "@/trpc/api/trpc";
import { type DB, type DBTransaction, buckets } from "@captable/db";
import {
  type TypeZodCreateBucketMutationSchema,
  ZodCreateBucketMutationSchema,
} from "../schema";

interface createBucketHandlerOptions {
  input: TypeZodCreateBucketMutationSchema;
  db: DB | DBTransaction;
  userAgent: string;
  requestIp: string;
  user?: {
    name: string;
    companyId: string;
    id: string;
  };
}

export const createBucketHandler = async ({
  db,
  input,
  userAgent,
  requestIp,
  user,
}: createBucketHandlerOptions) => {
  const [bucket] = await db
    .insert(buckets)
    .values({
      ...input,
      updatedAt: new Date(),
    })
    .returning();

  if (!bucket) {
    throw new Error("Failed to create bucket");
  }

  await Audit.create(
    {
      action: "bucket.created",
      companyId: user?.companyId || "",
      actor: { type: "user", id: user?.id || "" },
      context: {
        userAgent,
        requestIp,
      },
      target: [{ type: "bucket", id: bucket.id }],
      summary: `${user?.name} created the bucket ${bucket.name}`,
    },
    db,
  );

  return bucket;
};

export const createBucketProcedure = withAuth
  .input(ZodCreateBucketMutationSchema)
  .mutation(async ({ ctx: { db, userAgent, requestIp, session }, input }) => {
    const { name, companyId, id } = session.user;

    return await createBucketHandler({
      input,
      db,
      userAgent,
      requestIp: requestIp || "",
      user: { name: name || "", companyId, id },
    });
  });
