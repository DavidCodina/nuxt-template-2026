import { auth } from '../utils/auth'

/* ======================
        Types
====================== */

type PublicRule = {
  path: string,
  /** If omitted, then all HTTP methods are matched (i.e., allowed).
   * Pass an array of specific methods to refine access control.
   */
  methods?: string[],
  /** If true then the path and all subsequent path fragments are matched. */
  prefix?: boolean
}

/* ======================
    PUBLIC_API_RULES
====================== */

const PUBLIC_API_RULES: PublicRule[] = [
  { path: '/api/posts', prefix: true, methods: ['GET', 'HEAD'] }
]

/* ======================
      normalizePath()
====================== */
// ⚠️ Gotcha: If there's a rule of  { path: '/api/users', methods: ['GET', 'HEAD'] },
// but the request is for  types '/api/users/',  it will not match. This is why
// normalizePath() is important.

const normalizePath = (path: string) => {
  let result = path
  while (result.length > 1 && result.endsWith('/')) {
    result = result.slice(0, -1)
  }
  return result
}

/* ======================
      isPublic()
====================== */

const isPublic = (rawPath: string, method: string) => {
  const path = normalizePath(rawPath)
  return PUBLIC_API_RULES.some((rule) => {
    ///////////////////////////////////////////////////////////////////////////
    //
    // Condensed version is hard to read:
    //
    //   const pathMatches = rule.prefix ? path === rule.path || path.startsWith(rule.path + '/') : path === rule.path
    //   const methodMatches = !rule.methods || rule.methods.includes(method)
    //   return pathMatches && methodMatches
    //
    ///////////////////////////////////////////////////////////////////////////

    let pathMatches: boolean

    if (rule.prefix === true) {
      ///////////////////////////////////////////////////////////////////////////
      //
      // Why Prefix + '/' Matters:
      //
      // Using path.startsWith(prefix + '/') ensures that if you define a prefix
      // like /api/auth, it will correctly match /api/auth/signin, but it won't
      // accidentally match a different endpoint like /api/author.
      //
      ///////////////////////////////////////////////////////////////////////////
      pathMatches = path === rule.path || path.startsWith(rule.path + '/')
    } else {
      pathMatches = path === rule.path
    }

    let methodMatches: boolean

    if (rule.methods) {
      methodMatches = rule.methods.includes(method)
    } else {
      methodMatches = true
    }

    return pathMatches && methodMatches
  })
}

/* ========================================================================
                              Middleware
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This middleware sets up Deny-By-Default API protection.
// Protecting all of /api/ and allowlisting public routes is safer than the docs’
// per-handler approach: https://better-auth.com/docs/integrations/nuxt#protect-server-routes
// All endpoints are protected automatically. The trade-off is that you must remember
// to allowlist public endpoints.
//
//   - Cost: getSession runs on every API request, and it hits the DB unless you
//     enable cookie caching in your Better Auth config (session.cookieCache).
//     Since the middleware stores the session on event.context, don’t call
//     getSession again in handlers.
//
//   - SSR calls to your own API: During SSR, useFetch forwards the request’s cookies
//     to internal API calls, but a bare $fetch does not. In server-rendered code,
//     use useFetch or useRequestFetch(), or the middleware will 401 your own SSR requests.
//
//   - Auth isn’t authorization: This middleware only answers “is someone logged in?”.
//     Role and ownership checks still belong in the handlers (or a small requireRole(event, 'admin') helper).
//
///////////////////////////////////////////////////////////////////////////

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Only guard API routes; pages are handled by the app route middleware
  // ⚠️ This means that all routes defined in server/routes are unprotected!
  const isApiRoute = path === '/api' || path.startsWith('/api/')
  if (!isApiRoute) return

  // Better Auth's own endpoints must stay reachable
  if (path === '/api/auth' || path.startsWith('/api/auth/')) return

  if (isPublic(path, event.method)) return

  const session = await auth.api.getSession({ headers: event.headers })

  if (!session) {
    throw httpError({
      status: 401,
      message: 'Authentication is required.',
      data: {
        code: codes.UNAUTHORIZED
      }
    })
  }
  // Note: the event.context.session type is declared in server/types/h3.d.ts
  // See also getSessionFromContextOrThrow helper in server/utils/
  event.context.session = session
})
