import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().trim().min(1, 'Name must be a non-empty string'),
  email: z.string().trim().pipe(z.email('Email must be a valid email address'))
})

// type ZodData = z.infer<typeof createUserSchema>
// type ZodError = Partial<Record<keyof ZodData, string>>

/* ========================================================================
                            POST: /api/users
======================================================================== */

export default defineEventHandler(async (event) => {
  const {
    data: zodData,
    error: zodError,
    success: zodSuccess
    // Same as: (data) => createUserSchema.safeParse(data)
  } = await readValidatedBody(event, createUserSchema.safeParse)

  if (zodSuccess === false) {
    const formattedZodErrors = formatZodErrors(zodError)

    throw httpError({
      status: 400,
      message: 'Invalid data',
      data: {
        code: codes.BAD_REQUEST,
        // errors: z.flattenError(validationResult.error).fieldErrors
        errors: formattedZodErrors
      }
    })
  }

  // Already trimmed and typed as CreateUserInput.
  const { name, email } = zodData

  const newUser: User = {
    // Web Crypto API, available as a global.
    // Not the same as: import { randomUUID } from 'node:crypto'
    // Note: In browsers, crypto.randomUUID() only works in
    // secure contexts (HTTPS or localhost).
    id: crypto.randomUUID(),
    name: name,
    email: email,
    createdAt: new Date().toISOString()
  }
  users.unshift(newUser)

  setResponseStatus(event, 201)
  return newUser
})

/* ========================================================================
              Old Verbose Version -  Still interesting for reference
===========================================================================

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateUserInput>(event)
  const errors: {
    name?: string, email?: string
  } = {}

  if (!isPlainObject(body)) {
    // Custom uitility at server/utils/httpError.ts to minimize eventual migration impact to Nitro 3.
    throw httpError({
      status: 400,
      message: 'Invalid request body.',
      data: {
        code: codes.BAD_REQUEST
      }
    })
  }

  if (typeof body?.name !== 'string' || !body.name.trim()) {
    errors.name = 'Name must be a non-empty string'
  }

  if (typeof body?.email !== 'string' || !body.email.includes('@')) {
    errors.email = 'Email must be a valid email address'
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

  const newUser: User = {
    // Web Crypto API, available as a global.
    // Not the same as: import { randomUUID } from 'node:crypto'
    // Note: In browsers, crypto.randomUUID() only works in
    // secure contexts (HTTPS or localhost).
    id: crypto.randomUUID(),
    name: body.name.trim(),
    email: body.email.trim(),
    createdAt: new Date().toISOString()
  }
  users.unshift(newUser)

  setResponseStatus(event, 201)
  return newUser
})

*/
