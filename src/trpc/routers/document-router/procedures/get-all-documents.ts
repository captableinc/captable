import { withAccessControl } from "@/trpc/api/trpc";

export const getAllDocumentsProcedure = withAccessControl
  .meta({ policies: { documents: { allow: ["read"] } } })
  .query(
    async ({
      ctx: {
        db,
        membership: { companyId },
      },
    }) => {
      const data = await db.document.findMany({
        where: {
          companyId,
        },
        include: {
          uploader: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          bucket: {
            select: {
              id: true,
              key: true,
              mimeType: true,
              size: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return data;
    },
  );
