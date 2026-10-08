/* ========================================================================
                            POSTS: /api/posts
======================================================================== */

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<Pick<Post, 'title' | 'body'>>>(event)

  if (!body?.title?.trim() || !body?.body?.trim()) {
    throw httpError({
      status: 400,
      message: 'Both "title" and "body" are required',
      data: {
        test: 'Testing 123...',
        code: codes.BAD_REQUEST
      }
    })
  }

  const post: Post = {
    id: crypto.randomUUID(),
    title: body.title.trim(),
    body: body.body.trim(),
    createdAt: new Date().toISOString()
  }
  posts.unshift(post)

  setResponseStatus(event, 201)
  return post
})
