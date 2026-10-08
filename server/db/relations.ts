// https://orm.drizzle.team/docs/relations
import { defineRelations } from 'drizzle-orm'
import * as schema from './schema'

export const relations = defineRelations(schema, (_r) => ({
  // add relations here as you need them, e.g.

  // usersTable: {
  //   posts: r.many.postsTable()
  // }
}))
