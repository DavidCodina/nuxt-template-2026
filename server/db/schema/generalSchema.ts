import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

/* ========================================================================

======================================================================== */

export const usersTable = sqliteTable('users', {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  // Unlike 'drizzle-orm/pg-core' which exports a timestamp helper,
  // sqlite-core has no timestamp helper, because SQLite has no native date type.
  // You store timestamps as an integer (or text) and tell Drizzle how to map it.
  // ❌ createdAt: timestamp('created_at').defaultNow().notNull()

  //
  createdAt: int('createdAt', { mode: 'timestamp' })
    .notNull()
    // This lives in the database. Any insert, whether from Drizzle, a raw SQL migration,
    // the Turso shell, a seed script, or another service, gets a timestamp. $defaultFn
    // only runs inside Drizzle’s insert path.
    .default(sql`(unixepoch())`) // ❌ .$defaultFn(() => new Date()),

  // Syntax CJ at 1:24:15 uses int().notNull().$default(() => Date.now())
})
