import { createAuthClient } from 'better-auth/vue'
import { inferAdditionalFields } from 'better-auth/client/plugins'

import type { auth } from '#server/utils/auth'
// import { stripeClient } from '@better-auth/stripe/client'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha:
//
// When you deploy to Vercel, this won't work unless you turn off
// settings/deployment-protection --> Vercel Authentication.
//
//   const result = await authClient.useSession(useFetch)
//
// Instead, the result.data will be  the Vercel login page, not session data. Your /api/auth/get-session request
// is being intercepted by Vercel’s Deployment Protection, which returns its HTML login page.
// This is a very common issue on Vercel—not just for Better Auth, but for almost any authentication library
//
//   https://vercel.com/docs/deployment-protection/automated-agent-access#why-automated-systems-get-blocked
//
// The HTML you are seeing is Vercel Deployment Protection (Password Protection or Vercel Authentication / SSO).
// When your Nuxt app calls authClient.useSession(useFetch) (which hits /api/auth/get-session), Vercel intercepts
// the request at the edge because deployment protection is enabled. Instead of letting your API return the JSON
// session object, Vercel responds with a 200/401 status containing an HTML login page. Your client parses this
// HTML as JSON (or displays it raw), which breaks your app.
// Vercel's edge protection catches all incoming requests to the deployment URL unless they carry a valid Vercel bypass token or cookie.
//
// Solution: Rather than turning Vercel Authentication off entirely, we can instead
// use Vercel's "Protection Bypass for Automation" at /settings/deployment-protection#protection-bypass-for-automation
// Then we can set it here so it works everywhere for the authClient.
//
// Why this fixes it:
//
// When Nuxt executes await authClient.useSession(useFetch) during Server-Side Rendering (SSR), your Nuxt server makes an
// internal request to your /api/auth/... routes. Because Vercel's edge protection intercepts this internal server request,
// adding the x-vercel-protection-bypass header tells Vercel's edge to let the request pass straight through to your Better
// Auth backend instead of returning the HTML login page.
//
///////////////////////////////////////////////////////////////////////////

export const authClient = createAuthClient({
  // https://better-auth.com/docs/concepts/client#fetch-options
  fetchOptions: {
    headers: {
      // Automatically attaches Vercel's automation bypass secret on the server
      // eslint-disable-next-line
      ...(process.env.VERCEL_AUTOMATION_BYPASS_SECRET && {
        // eslint-disable-next-line
        'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET
      })
    }
  },

  // If your client and server are on the same URL
  // you shouldn't need to pass baseURL at all.

  plugins: [
    ///////////////////////////////////////////////////////////////////////////
    //
    // Coding In Flow does this at 40:30.
    // This does not affect the default types exported from 'better-auth'
    // import { Session, User } from 'better-auth'
    // Rather, what it does is inform the authClient.useSession() hook.
    //
    //   const value = authClient.useSession()
    //   const { data  } = value
    //   if (!data) { return null  }
    //   const { session, user } = data
    //
    // Now user.role will be recognized, assuming we've correctly implemented
    // user.additionalFields.role in @/lib/auth.ts
    //
    ///////////////////////////////////////////////////////////////////////////

    inferAdditionalFields<typeof auth>()
  ],

  // https://better-auth.com/docs/concepts/client#session-options
  sessionOptions: {}
})

// export const { signIn, signUp, signOut, useSession } = authClient;
