import { z } from 'zod'
import db from '#server/db'
import { PostTable } from '#server/db/schema'

const createPostSchema = z.object({
  title: z.string().trim().min(1, 'Title must be a non-empty string'),
  body: z.string().trim().min(1, 'Body must be a non-empty string')
})

type _Post = typeof PostTable.$inferSelect
type CreatePostInput = typeof PostTable.$inferInsert

// type ZodData = z.infer<typeof createPostSchema>
// type ZodError = Partial<Record<keyof ZodData, string>>

/* ========================================================================
                            POST: /api/posts
======================================================================== */

export default defineEventHandler(async (event) => {
  const session = getSessionFromContextOrThrow(event)
  const userId = session.user.id

  const {
    data: zodData,
    error: zodError,
    success: zodSuccess
    // Same as: (data) => createPostSchema.safeParse(data)
  } = await readValidatedBody(event, createPostSchema.safeParse)

  if (zodSuccess === false) {
    const formattedZodErrors = formatZodErrors(zodError)

    throw httpError({
      status: 400,
      message: 'Invalid data',
      data: {
        code: codes.BAD_REQUEST,
        errors: formattedZodErrors
      }
    })
  }

  const createPostInput: CreatePostInput = {
    title: zodData.title,
    body: zodData.body,
    userId: userId
  }

  const [newPost] = await db
    .insert(PostTable)
    .values(createPostInput)
    // .returning(): This works on PostgreSQL and SQLite (and recent MariaDB). Your UUID user ID
    // suggests Postgres, so you’re fine. MySQL doesn’t support it, so there you’d insert and
    // then select the row back.
    .returning()

  if (!newPost) {
    throw httpError({
      status: 500,
      message: 'Failed to create post',
      data: { code: codes.INTERNAL_SERVER_ERROR }
    })
  }

  setResponseStatus(event, 201)
  return newPost
})
