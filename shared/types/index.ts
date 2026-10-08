import type { statusText } from '../utils/statusText'
import type { codes } from '../utils/codes'
import type { auth } from '#server/utils/auth'

///////////////////////////////////////////////////////////////////////////
//
// better-auth exports their own User and Session types, but
// they're the default versions (i.e., not inferred):
//
//  import { User, Session } from 'better-auth'
//
// Coding in Flow tutorial does something similar at 38:40.
//
///////////////////////////////////////////////////////////////////////////

export type InferredSession = typeof auth.$Infer.Session
export type Session = InferredSession['session']

///////////////////////////////////////////////////////////////////////////
//
// Note: One could also infer the User type directly from the Drizzle schema.
//
//   export type User = typeof UserTable.$inferSelect
//
// However, they are largely the same with one exception.
// The Drizzle version knows the exact types of the UserRoleEnum,
// While InferredSession['user'] only types it as string.
// Currently, that seems okay, and since 99% of the time we'll be
// betting user off of the session it makes more sense to use this version.
//
///////////////////////////////////////////////////////////////////////////

export type User = InferredSession['user']

export type Status = keyof typeof statusText
export type StatusText = (typeof statusText)[keyof typeof statusText]
export type Code = (typeof codes)[keyof typeof codes]

// Usage: useFetch<Posts[], NuxtError<ApiErrorData>>('/api/posts')
export type ApiErrorData = {
  code: Code,
  errors?: Record<string, string> | null
}
