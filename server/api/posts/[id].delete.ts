import { z } from 'zod'
import { and, eq } from 'drizzle-orm'
import db from '#server/db'
import { PostTable } from '#server/db/schema'

type _Post = typeof PostTable.$inferSelect

const ParamsSchema = z.object({
  id: z.uuid()
})

/* ========================================================================
                          DELETE: /api/posts/:id
======================================================================== */

export default defineEventHandler(async (event) => {
  const session = getSessionFromContextOrThrow(event)
  const userId = session.user.id

  const validatedRouteParams = await getValidatedRouterParams(event, ParamsSchema.safeParse)

  if (!validatedRouteParams.success) {
    throw httpError({
      status: 400,
      message: 'Invalid route parameters', // i.e., "Invalid UUID"
      data: {
        code: codes.BAD_REQUEST,
        issues: z.flattenError(validatedRouteParams.error).fieldErrors
      }
    })
  }

  const postId = validatedRouteParams.data.id

  const [deletedPost] = await db
    .delete(PostTable)
    .where(and(eq(PostTable.id, postId), eq(PostTable.userId, userId)))
    .returning()

  if (!deletedPost) {
    const [existingPost] = await db
      .select({ id: PostTable.id })
      .from(PostTable)
      .where(eq(PostTable.id, postId))

    throw existingPost
      ? httpError({
          status: 403,
          message: 'Resource can only be deleted by the owner',
          data: { code: codes.FORBIDDEN }
        })
      : httpError({
          status: 404,
          message: 'Resource not found',
          data: { code: codes.NOT_FOUND }
        })
  }

  return deletedPost
})
