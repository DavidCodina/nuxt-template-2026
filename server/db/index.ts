// ? There should be no need for this since we're using env from env.ts
// ? import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import env from '../utils/env'
import { relations } from './relations'

const db = drizzle({
  connection: {
    url: env.TURSO_DATABASE_URL, // url: process.env.TURSO_DATABASE_URL!,
    authToken: env.TURSO_AUTH_TOKEN //  authToken: process.env.TURSO_AUTH_TOKEN!
  },

  ///////////////////////////////////////////////////////////////////////////
  //
  // In older version of drizzle-orm, we imported schema into this file and
  // passed it here. This is clearly shown in the Syntax tutorial at 1:16:30.
  // https://www.youtube.com/watch?v=DK93dqmJJYg
  //
  //  ❌ schema
  //
  // However, with the new rc version we use relations.
  // In v1, schema served two purposes: it registered your tables with db.query and carried any relations()
  // you’d exported. In v2, defineRelations(schema, ...) does both. Even with an empty callback,
  //  it registers every table in schema, so db.query.usersTable.findMany() works the same as before.
  // You only need to fill in the callback when you want with: { posts: true }-style joins.
  //
  ///////////////////////////////////////////////////////////////////////////
  relations
})

export default db
