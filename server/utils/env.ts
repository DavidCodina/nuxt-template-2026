///////////////////////////////////////////////////////////////////////////
//
// The idea for this was taken from:
// Syntax CJ: https://github.com/w3cj/nuxt-travel-log/blob/main/lib/env.ts
// This version is a little cleaner.
//
// At 1:08:28 of the Syntax tutorial: https://www.youtube.com/watch?v=DK93dqmJJYg
// They also set up this rule in the ESLint config.
//
//   'node/no-process-env': 'warn'
//
// That may be deprecated. I did this:
//
//   'no-process-env': 'warn',
//   'no-restricted-properties': [
//     'warn',
//     {
//       object: 'process',
//       property: 'env',
//       message: 'Use the validated `env` object from "server/utils/env" instead of process.env.'
//     }
//   ]
//
// Usage: console.log('env.SOME_ENV_VAR', env.SOME_ENV_VAR)
//
///////////////////////////////////////////////////////////////////////////

import { z } from 'zod'
// import type { ZodObject, ZodRawShape } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z.string(),
  EXTERNAL_API: z.string(),
  TURSO_DATABASE_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string()
  // BETTER_AUTH_SECRET: z.string(),
  // BETTER_AUTH_URL: z.string(),
  // AUTH_GITHUB_CLIENT_ID: z.string(),
  // AUTH_GITHUB_CLIENT_SECRET: z.string(),
  // S3_ENDPOINT: z.string(),
  // S3_ACCESS_KEY: z.string(),
  // S3_ACCESS_SECRET: z.string(),
  // S3_REGION: z.string(),
  // S3_BUCKET: z.string(),
  // S3_BUCKET_URL: z.string(),

})

export type EnvSchemaType = z.infer<typeof EnvSchema>

const getEnv = () => {
  const { data: zodData, error: zodError } = EnvSchema.safeParse(process.env)

  if (zodError) {
    const issues = zodError.issues

    const mappedIssues = issues
      .map((issue) => issue.path.map(String).join('.'))
      .join(', ')

    const e = new Error(`Missing values in .env: ${mappedIssues}`)
    e.stack = ''
    delete e.stack
    throw e
  }

  return zodData
}

///////////////////////////////////////////////////////////////////////////
//
// A module's top-level code runs the first time anything imports it.
// As long as something in the app is importing env.ts then this runs.
// It immediately throws an Error with a message property indicating what
// if any .env vars are missing. Otherwise, it return the validated env object.
//
// Note: during dev mode, it will throw an Error on startup. However, if you run
// the build it will still pass. Why? Chunks in Nitro are lazily loaded, so
// env-test.get.mjs is only imported when used.
//
// For example, let's say we're using it in server/api/env-test.get.ts as follows:
//
//   export default defineEventHandler(async (_event) => {
//     return { externalAPI: env.EXTERNAL_API }
//   })
//
// Then we deploy to Vercel. On Vercel the build passes, and then the first request to
// /api/env-test (or any route that imports env) triggers the import, throws, and returns a 500.
//
// In order to get fail-fast at build time, two approaches have been taken.
// The first is to simply import  import './server/utils/env' in nuxt.config.ts.
// With this, both `npm run dev` and `npm run build` will IMMEDIATELY fail if env validation fails.
//
// The second strategy is more of a backup for edge cases. In server/plugins/envCheck.ts
// we do this:
//
//   import env from '../utils/env'
//   export default defineNitroPlugin(() => { void env })
//
// Why the failsafe plugin when it seems redundant?
// The config check validates the environment the build runs in. The plugin validates the environment
// the server runs in. On Vercel those are the same, but they can drift apart, for example if you
// later move to a Docker image built in CI and deployed with different secrets. The plugin catches
// that case at startup instead of on the first request to a route that imports env.
// It costs almost nothing...
//
///////////////////////////////////////////////////////////////////////////

export default getEnv()
