import { checkMembership } from '@/server/auth'
import { withAuth } from '@/trpc/api/trpc'

export const getAllDocumentsProcedure = withAuth.query(
  async ({ ctx: { session, db } }) => {
    const data = await db.$transaction(async (tx) => {
      const { companyId } = await checkMembership({ session, tx })

      const data = await tx.document.findMany({
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
          createdAt: 'desc',
        },
      })
      return data
    })

    return data
  },
)
