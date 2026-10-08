import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { UserTable } from './authSchema'

/* ========================================================================

======================================================================== */

export const PostTable = sqliteTable('posts', {
  ///////////////////////////////////////////////////////////////////////////
  //
  // Originally, I used this for SQLite ids:
  //
  //   id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  //
  // $defaultFn runs in JavaScript inside Drizzle’s query builder when you call
  // db.insert(...). It isn’t part of the table definition in the database.
  //
  // Drizzle Studio inserts rows straight into SQLite, so your function never runs.
  // The created_at and updated_at columns did fill in because those use .default(sql...),
  // which is a real SQL default stored in the table.
  //
  // Solution: a database-level default/ This is the commonly used expression for v4 UUIDs in SQLite.
  // It produces a valid version 4 UUID when tested against z.uuid().
  // This is also true of the crypto.randomUUID() used in auth.ts for ids.
  //
  // The SQLite version here may not be 100% as collision proof, but with 122 random bits,
  // collisions are not a practical concern for either method.
  //
  ///////////////////////////////////////////////////////////////////////////
  id: text('id')
    .primaryKey()
    .notNull()
    .default(sql`(lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-' || substr('89ab', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6))))`),

  ///////////////////////////////////////////////////////////////////////////
  //
  // Column type: It must be text, matching UserTable.id.
  // A SQL foreign key is declared only on the child table, here.
  // In other words, there's no circular improt such that authSchema.ts doesn’t import from generalSchema.ts
  // This is merely the SQL-level relationship, and has nothing to do with Drizzle relations.
  // Note: in some examples you may see people use authorId, but it's better to be consistent and just
  // call it what it is: userId.
  //
  ///////////////////////////////////////////////////////////////////////////
  userId: text('user_id')
    .notNull()
    .references(() => UserTable.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  body: text('body').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
},
(table) => [
  index('post_userId_idx').on(table.userId)
])
