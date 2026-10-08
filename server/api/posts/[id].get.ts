import { z } from 'zod'
import { eq } from 'drizzle-orm'
import db from '#server/db'
import { PostTable } from '#server/db/schema'

/* ========================================================================
                             GET: /api/posts/:id
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Note: Because Nuxt/Nitro uses a convention of throwing, rather than returning
// errors, having an explicit try/catch can result in some weird logic structuring
// just to work around a try/catch.
//
//   export default defineEventHandler(async (event) => {
//     const id = getRouterParam(event, 'id')
//     if (!id) {  throw httpError(...) }
//     let post
//
//     try {
//       const [result] = await db.select().from(PostTable).where(eq(PostTable.id, id)).limit(1)
//       post = result
//     } catch (_err) {
//       throw httpError( ... )
//     }
//     if (!post) { throw httpError(...) }
//     return post
//   })
//
// Notice how we had to initialize let post outside of the try/catch in order to later
// conditionally throw if !post. This is super awkward. In theory, we could return httpError
// rather than throwing it, and it should work exactly the same. However, it’s not something
// the docs promote.
//
//
// Another solution is to rethrow.
//
//   export default defineEventHandler(async (event) => {
//     const id = getRouterParam(event, 'id') as string
//
//     try {
//       const [post] = await db.select().from(PostTable).where(eq(PostTable.id, id)).limit(1)
//       if (!post) {
//         throw httpError({ status: 404, message: 'Post not found', data: { code: codes.NOT_FOUND } })
//       }
//
//       return post
//     } catch (err) {
//       // No no need to explicitly import this.
//       // import { isError } from 'h3'
//       if (isError(err)) throw err
//
//       throw httpError({
//         status: 500,
//         message: 'Server Error',
//         data: { code: codes.INTERNAL_SERVER_ERROR }
//       })
//     }
//   })
//
// The most idiomatic/Nuxt way of writing API logic is to simply drop the try/catch.
// Nitro already turns any unhandled error into a 500 response, and in production it
// hides the internal message. This allows for a simplification of API logic, but it
// also means that there's one case where the user will not be getting back a custom
//
//   data: { code: codes.INTERNAL_SERVER_ERROR  }
//
// In production, an unhandled error will essentially look like this:
//
//   {
//     "error": true,
//     "url": "http://localhost:3000/api/posts/60a9fe44-013f-4960-9663-349c06b44d91",
//     "statusCode": 500,
//     "statusMessage": "Server Error",
//     "message": "Server Error"
//   }
//
// If you want a consistent error shape (like your codes.INTERNAL_SERVER_ERROR) for unexpected
// failures across the whole API, set it up once instead of per route. A Nitro plugin with an
// error hook, or a custom errorHandler, applies to every endpoint, so individual routes stay
// as clean as the one you just wrote.
//
///////////////////////////////////////////////////////////////////////////

const ParamsSchema = z.object({
  id: z.uuid()
})

export default defineEventHandler(async (event) => {
  // const id = getRouterParam(event, 'id')
  // CJ talks about getValidatedRouterParams here at 35:40
  // https://www.youtube.com/watch?v=RhZZ0whiuT8

  const validatedRouteParams = await getValidatedRouterParams(event, ParamsSchema.safeParse)

  ///////////////////////////////////////////////////////////////////////////
  //
  // An id check is redundant because the file is [id].get.ts.
  // However, it's still useful to validate the specifics
  //
  //    if (!id) {
  //     throw httpError({
  //       status: 400,
  //       message: 'Missing post id',
  //       data: { code: codes.BAD_REQUEST }
  //     })
  //   }
  //
  ///////////////////////////////////////////////////////////////////////////

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

  const [post] = await db.select().from(PostTable).where(eq(PostTable.id, validatedRouteParams.data.id)).limit(1)

  if (!post) {
    throw httpError({
      status: 404,
      message: 'Resource not found',
      data: { code: codes.NOT_FOUND }
    })
  }

  return post
})
