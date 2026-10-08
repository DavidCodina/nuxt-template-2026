/* ========================================================================
                              PATCH: /api/users/:id
======================================================================== */

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<UpdateUserInput>(event)
  const user = users.find((u) => u.id === id)
  const errors: {
    name?: string, email?: string
  } = {}

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

  if (!isPlainObject(body)) {
    throw httpError({
      status: 400,
      message: 'Invalid request body.',
      data: {
        code: codes.BAD_REQUEST
      }
    })
  }

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

  const hasName = typeof body?.name !== 'undefined'
  const hasEmail = typeof body?.email !== 'undefined'

  if (!hasName && !hasEmail) {
    throw httpError({
      status: 400,
      message: 'No updatable fields provided',
      data: {
        code: codes.BAD_REQUEST,
        errors: { body: 'Provide at least one of: `name`, `email`' }
      }
    })
  }

  // Simple validation: This expects the consumer to not accidentally send ''.
  if (typeof body?.name !== 'undefined') {
    if (typeof body.name !== 'string' || !body.name.trim()) {
      errors.name = 'Name must be a non-empty string'
    }
  }

  if (typeof body?.email !== 'undefined') {
    if (typeof body.email !== 'string' || !body.email.includes('@')) {
      errors.email = 'Email must be a valid email address'
    }
  }

  if (Object.keys(errors).length > 0) {
    throw httpError({
      status: 400,
      message: 'Invalid data',
      data: {
        code: codes.BAD_REQUEST,
        errors: errors
      }
    })
  }

  // Validation passed, so it's safe to apply the changes
  if (typeof body?.name !== 'undefined') {
    user.name = body.name.trim()
  }

  if (typeof body?.email !== 'undefined') {
    user.email = body.email.trim().toLocaleLowerCase()
  }

  return user
})
