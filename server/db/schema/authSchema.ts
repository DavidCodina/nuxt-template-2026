import { defineRelationsPart, sql } from 'drizzle-orm'
import { check, sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'

///////////////////////////////////////////////////////////////////////////
//
// SQLite has no native enums, so there’s no pgEnum equivalent to doing this:
// export const UserRoleEnum = pgEnum('userRole', ['USER', 'ADMIN'])
// The idiomatic Drizzle approach is a text column with the enum option,
// which gives you TypeScript type safety (and you can add a CHECK constraint if you want DB-level enforcement).
//
// Consider the admin plugin:  Better Auth has an official admin plugin that gives you roles, banning, impersonation,
// and setRole/listUsers endpoints. It adds its own role field, so if you use it, remove your manual additionalFields.role
// or you’ll conflict. If you only need a simple USER/ADMIN flag and will write your own checks, your current approach is fine.
// If you think you’ll want user management later, switching now is cheaper than later. Check the current docs for the schema
// columns it requires (banned, banReason, banExpires on users, and impersonatedBy on sessions).
//
///////////////////////////////////////////////////////////////////////////

export const USER_ROLES = ['USER', 'ADMIN'] as const
export type UserRole = (typeof USER_ROLES)[number]

/* ======================

====================== */

// Was user / 'user'
export const UserTable = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).default(false).notNull(),
  role: text('role', { enum: USER_ROLES }).default('USER').notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
}, (table) => [
  check('users_role_check', sql`${table.role} in ('USER', 'ADMIN')`)
])

// Use this within a db.select to specify safe user fields.
// Note: This was originally created to protect against exposing the password field.
// However, in Better Auth, the password is not even stored on the user record.
export const safeUserFields = {
  id: UserTable.id,
  name: UserTable.name,
  email: UserTable.email,
  emailVerified: UserTable.emailVerified,
  role: UserTable.role,
  image: UserTable.image,
  createdAt: UserTable.createdAt,
  updatedAt: UserTable.updatedAt
}

// Use this within a db.query to specify safe user columns.
export const safeUserColumns = {
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  role: true,
  image: true,
  createdAt: true,
  updatedAt: true
}

/* ======================

====================== */

// Was session / 'session'
export const SessionTable = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => UserTable.id, { onDelete: 'cascade' })
}, (table) => [
  index('session_userId_idx').on(table.userId)
])

/* ======================

====================== */

// Was account / 'account'
export const AccountTable = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => UserTable.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp_ms' }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp_ms' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
}, (table) => [
  index('account_userId_idx').on(table.userId)
])

/* ======================

====================== */

// Was verification / 'verification'
export const VerificationTable = sqliteTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
}, (table) => [
  index('verification_identifier_idx').on(table.identifier)
])

/* ======================

====================== */

export const authRelations = defineRelationsPart({ UserTable, SessionTable, AccountTable, VerificationTable }, (r) => ({

  UserTable: {
    sessions: r.many.SessionTable({
      from: r.UserTable.id,
      to: r.SessionTable.userId
    }),
    accounts: r.many.AccountTable({
      from: r.UserTable.id,
      to: r.AccountTable.userId
    })
  },

  SessionTable: {
    user: r.one.UserTable({
      from: r.SessionTable.userId,
      to: r.UserTable.id
    })
  },

  AccountTable: {
    user: r.one.UserTable({
      from: r.AccountTable.userId,
      to: r.UserTable.id
    })
  }
}))
