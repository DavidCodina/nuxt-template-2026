/* ========================================================================
                          DELETE: /api/users/:id
======================================================================== */

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const index = users.findIndex((u) => u.id === id)

  if (index === -1) {
    // Custom uitility at server/utils/httpError.ts to minimize eventual migration impact to Nitro 3.
    throw httpError({
      status: 404,
      message: 'Resource not found.',
      data: {
        code: codes.NOT_FOUND
      }
    })
  }

  // Why splice instead of filter: users is an imported const,
  // so you can’t reassign it (users = users.filter(...) won’t work).
  // Mutating the array in place with splice does.
  // splice returns an array of removed items; we removed exactly one
  const [deletedUser] = users.splice(index, 1)

  return deletedUser
})
