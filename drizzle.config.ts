// ? There should be no need for this since we're using env from env.ts
// ? import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import env from './server/utils/env'

export default defineConfig({
  out: './server/db/migrations',
  schema: './server/db/schema/index.ts',
  dialect: 'turso',
  dbCredentials: {

    ///////////////////////////////////////////////////////////////////////////
    //
    // Note: Nuxt 4 splits TypeScript into separate projects. The root
    // tsconfig.json just  references the generated configs:
    //
    //   {
    //     "files": [],
    //     "references": [
    //       { "path": "./.nuxt/tsconfig.app.json" },
    //       { "path": "./.nuxt/tsconfig.server.json" },
    //       { "path": "./.nuxt/tsconfig.shared.json" },
    //       { "path": "./.nuxt/tsconfig.node.json" }
    //     ]
    //   }
    //
    // drizzle.config.ts sits in the root and isn’t included in any of those projects.
    // VSCode then has no knowledge of the types from within this file.
    // Solution: add this in nuxt.config.ts:
    //
    //   typescript: {
    //     nodeTsConfig: { include: ['../drizzle.config.ts'] }
    //   }
    //
    ///////////////////////////////////////////////////////////////////////////
    url: env.TURSO_DATABASE_URL,
    // When we start the local Turso database turso dev --db-file local.db
    // sqld listens on the local port 8080. By default, no auth token is required
    // when sqld is running locally. Syntax tutorial handles this at 1:19:00
    // https://www.youtube.com/watch?v=DK93dqmJJYg
    authToken: env.NODE_ENV === 'development' ? undefined : env.TURSO_AUTH_TOKEN
  },

  verbose: true,
  strict: true
  // breakpoints: true,
})
