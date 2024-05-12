import { generatePublicId } from '@/common/id'
import { withAuth } from '@/trpc/api/trpc'
import { UpdateMutationSchema } from '../schema'

export const cloneUpdateProcedure = withAuth
  .input(UpdateMutationSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const authorId = ctx.session.user.memberId
      const companyId = ctx.session.user.companyId
      const publicId = generatePublicId()
      const { title, content, html } = input

      if (title.length === 0 || content.length === 0) {
        return {
          success: false,
          message: 'Title and content cannot be empty.',
        }
      } else {
        await ctx.db.$transaction(async (tx) => {
          await tx.update.create({
            data: {
              html,
              title: `Copy of - ${title}`,
              content,
              publicId,
              companyId,
              authorId,
            },
          })
        })

        return {
          publicId,
          success: true,
          message: 'Successfully cloned an update.',
        }
      }
    } catch (error) {
      console.error('Error cloning an update:', error)
      return {
        success: false,
        message: 'Oops, something went wrong. Please try again later.',
      }
    }
  })
