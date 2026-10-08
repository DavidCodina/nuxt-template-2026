import db from '#server/db'
import { PostTable } from '#server/db/schema'

/* ========================================================================
                             GET: /api/posts
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Basic Usage:
//
//   const { data, error, status } = await useFetch<{ id: string; name: string }[]>('/api/posts')
//
// Test in PostMan Make sure to add cookie: better-auth.session_token=abc123; Path=/; HttpOnly;
// Or mimic authClient.signIn.email() by doing this in PostMan:
//
//   POST http://localhost:3000/api/auth/sign-in/email
//   { "email": "test@example.com", "password": "12345678" }
//
// Or use curl:
//
//   curl -b "better-auth.session_token=abc123" http://localhost:3000/api/posts
//
// But actually, GET calls to /api/posts are now public.
//
///////////////////////////////////////////////////////////////////////////

export default defineEventHandler(async (_event) => {
  // Omit try/catch here!
  // The most idiomatic/Nuxt way of writing API logic in Nuxt is to simply drop the try/catch.
  // Nitro already turns any unhandled error into a 500 response, and in production it
  // hides the internal message.
  return await db.select().from(PostTable)
})
