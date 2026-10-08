import { betterAuth } from 'better-auth'

// The default Drizzle adapter uses Relations v1. For Drizzle Relations v2, use @better-auth/drizzle-adapter/relations-v2.
// import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2'
import db from '../db' // Don't use path alias here.
import * as schema from '../db/schema' // Don't use path alias here.
// import {
//   APIError,
//   createAuthMiddleware,
//   isAPIError
// } from 'better-auth/api'

/* ========================================================================

======================================================================== */

export const auth = betterAuth({
  database: drizzleAdapter(db, {

    provider: 'sqlite', // Turso/libSQL is SQLite-flavored

    // https://better-auth.com/docs/adapters/drizzle#modifying-table-names
    schema: {
      ...schema,
      user: schema.UserTable,
      session: schema.SessionTable,
      account: schema.AccountTable,
      verification: schema.VerificationTable
    }
  }),

  ///////////////////////////////////////////////////////////////////////////
  //
  // Unlike TanStack Start and Next.js we seem not to need something like nuxtCookies()
  // The cookie plugins for Next.js and TanStack Start exist because those frameworks
  // set cookies through their own APIs. In Next.js, a server action has to call cookies().set(),
  // and a plain Better Auth response can’t do that on its own. Nuxt doesn’t have that problem.
  // The catch-all route server/api/auth/[...all].ts returns Better Auth’s response straight
  // from Nitro, and the Set-Cookie headers on it go out to the browser as they are.
  //
  // Note: If you call auth.api.signInEmail() from your own server route, you have to hand the
  // session cookie to the browser yourself. The server-side API docs describe two options for
  // getting at the cookies. returnHeaders gives you the response headers, and asResponse gives
  // you a full Response object. A plain auth.api call returns only the data, so unless you
  // use one of these options, the session cookie never leaves the server.
  //
  // That said, you should be using authClient to sign in/out and register.
  // It’s the simpler path, and it’s what the Nuxt docs use throughout.
  // Moreover, 2hen you sign in/out on the server, the cookie may get set correctly,
  // but the client’s cached session doesn’t know anything changed, which ultimately
  // leads to the client and server not being in sync. While there are ways to fix that,
  // it gets complicated and is precisely why you should be using the authClient.
  //
  ///////////////////////////////////////////////////////////////////////////

  // plugins: [],

  // https://www.better-auth.com/docs/reference/options#user
  // # Configure for firstName, lastName
  user: {
    // https://better-auth.com/docs/concepts/users-accounts#delete-user
    deleteUser: {
      enabled: true
    }

    // additionalFields: {
    //   role: {
    //     type: 'string',
    //     input: false
    //   }
    // }
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    maxPasswordLength: 128
    // minPasswordLength: 5,
  },
  session: {},

  // https://www.better-auth.com/docs/concepts/oauth

  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID as string,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
  //     // See WDS at 1:53:45: https://www.youtube.com/watch?v=WPiqNDapQrk
  //     // mapProfileToUser: (_profile) => { return {} }
  //   },

  //   // https://better-auth.com/docs/authentication/github
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID as string,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string
  //     // WDS at 1:53:30
  //     // mapProfileToUser: (_profile) => { return {} }
  //   },
  //   // https://better-auth.com/docs/authentication/linkedin
  //   // https://www.linkedin.com/developers/apps
  //   linkedin: {
  //     clientId: process.env.LINKEDIN_CLIENT_ID as string,
  //     clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string
  //   }
  // }

  advanced: {
    database: {
      // Not 100% sure how this works. See docs here:
      // https://better-auth.com/docs/adapters/drizzle#joins
      joins: true,

      ///////////////////////////////////////////////////////////////////////////
      //
      // Note: If you use generateId: 'uuid', then you may need to update the id column
      // for all Better Auth tables as follows:
      //
      //  ❌ id: text('id').primaryKey()
      //  ✅ id: text('id').primaryKey().default(sql`gen_random_uuid()`),
      //
      // Or switch the column type entirely to uuid('id').primaryKey().defaultRandom().
      //
      ///////////////////////////////////////////////////////////////////////////
      // generateId: 'uuid'

      // crypto.randomUUID() produces version 4 UUIDs,
      // which validate correctly against z.uuid().
      generateId: () => crypto.randomUUID()
    }
  }
})
