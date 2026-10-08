import { defineRelationsPart, sql } from 'drizzle-orm'
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'

/* ======================

====================== */

// Was user / 'user'
export const UserTable = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).default(false).notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
})

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
