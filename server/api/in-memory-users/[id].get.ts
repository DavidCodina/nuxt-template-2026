/* ========================================================================
                             GET: /api/users/:id
======================================================================== */
// # CJ talks about getValidatedRouterParams here at 35:40
// # https://www.youtube.com/watch?v=RhZZ0whiuT8

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const user = users.find((u) => u.id === id)

  if (!user) {
    // Custom uitility at server/utils/httpError.ts to minimize eventual migration impact to Nitro 3.
    throw httpError({
      status: 404,
      message: 'Resource not found.',
      data: {
        code: codes.NOT_FOUND
      }
    })
  }

  return user
})
