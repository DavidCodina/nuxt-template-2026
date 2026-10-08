import { z } from 'zod'
import { and, eq } from 'drizzle-orm'
import db from '#server/db'
import { PostTable } from '#server/db/schema'

const ParamsSchema = z.object({
  id: z.uuid()
})

const UpdatePostSchema = z
  .object({
    title: z.string().trim().min(1, 'Title must be a non-empty string').optional(),
    body: z.string().trim().min(1, 'Body must be a non-empty string').optional()
  })

  ///////////////////////////////////////////////////////////////////////////
  //
  // Some teams may prefer to treat this case as a valid no-op, which
  // would follow the letter of PATCH semantics: “apply these changes,”
  // and there are no changes to apply. It’s also idempotent and harmless.
  // However, here I'm sending back a 400 just for the sake of example.
  //
  //   if (Object.keys(body).length === 0) { ... }
  //
  // But actualy, a better approach is to check for specific properties.
  // This mitigates potential typos on the client side.
  //
  ///////////////////////////////////////////////////////////////////////////
  .refine((data) => data.title !== undefined || data.body !== undefined, {
    message: 'At least one of `title` or `body` must be provided'
  })

type _Post = typeof PostTable.$inferSelect
type UpdatePostInput = Partial<Pick<typeof PostTable.$inferInsert, 'title' | 'body'>>

/* ========================================================================
                              PATCH: /api/posts/:id
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

  const {
    data: zodData,
    error: zodError,
    success: zodSuccess
  } = await readValidatedBody(event, UpdatePostSchema.safeParse)

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

  // Only include the fields that were actually sent
  const updatePostInput: UpdatePostInput = {}
  if (zodData.title !== undefined) updatePostInput.title = zodData.title
  if (zodData.body !== undefined) updatePostInput.body = zodData.body

  const [updatedPost] = await db
    .update(PostTable)
    .set(updatePostInput)

  ///////////////////////////////////////////////////////////////////////////
  //
  // Ownership Enforcement: 404 vs 403
  //
  // Ownership is enforced in the WHERE clause. Matching on both id and userId means a user can only
  // update their own posts, and it happens atomically in one query (no separate select-then-update race).
  // If the post doesn’t exist or belongs to someone else, you get the same 404, so you don’t leak which
  // post IDs exist. If you’d rather distinguish the two cases (404 vs 403), you’d need to select first.
  //
  // The “atomic” part means the ownership check and the update happen in a single statement. The alternative would be:
  //
  //   const post = await db.select().from(PostTable).where(eq(PostTable.id, postId))
  //   if (post.userId !== userId) throw ... (403 Forbidden)
  //   await db.update(PostTable).set(...).where(eq(PostTable.id, postId))
  //
  // Which Approach Is Better?
  //
  //   Hiding which IDs exist matters less here. Blog posts are typically public, so anyone can already see which
  //   posts exist via your GET endpoints. There’s nothing secret to protect. The 404-vs-403 concern matters more
  //   for private resources, like someone’s invoices or messages, where knowing an ID exists is itself information.
  //   Your IDs are also random UUIDs, so they aren’t enumerable anyway.
  //
  // The stronger reasons to prefer this pattern:
  //
  //   1. Secure by construction. Ownership is part of the query itself, so there’s no separate if to forget,
  //      reorder, or break in a later refactor. The select-then-check version fails open if someone drops the
  //      check; this one can’t.
  //
  //   2. Atomic. There’s no gap between checking and writing, so nothing can change in between.
  //
  //   3. One query instead of two. Fewer round trips and less code.
  //
  // The tradeoff is client experience. A user who tries to edit someone else’s post gets “Post not found,” which is slightly
  // misleading, since the post exists and they’re just not allowed to touch it. For a blog where posts are public, returning
  // 403 is arguably more honest and more helpful, and leaking existence costs you nothing.
  //
  // That said, it's unlikely that someone would try to update a post that doesn't belong to them unless they were
  // intentionally being malicious.
  //
  ///////////////////////////////////////////////////////////////////////////

    .where(and(eq(PostTable.id, postId), eq(PostTable.userId, userId)))
    .returning()

  if (!updatedPost) {
    throw httpError({
      status: 404,
      message: 'Post not found',
      data: { code: codes.NOT_FOUND }
    })
  }
  // setResponseStatus(event, 200)
  return updatedPost
})
