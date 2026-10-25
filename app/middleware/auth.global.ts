///////////////////////////////////////////////////////////////////////////
//
// https://better-auth.com/docs/integrations/nuxt#protect-pages
// The docs show an auth.ts used in conjunction with page-level
//
//   definePageMeta({ middleware: 'auth' })
//
// However, we can also make the auth global. This is superficial page protection
// only. Server APIs are protected separately by server/middleware/auth.ts.
//
///////////////////////////////////////////////////////////////////////////

import { authClient } from '../utils/authClient'

type PathRule = {
  path: string,
  /** If true then the path and all subsequent path fragments are matched. */
  prefix?: boolean
}

///////////////////////////////////////////////////////////////////////////
//
// Public pages can be listed in the following array.
// Alternatively, one can opt out of page protection by setting
// definePageMeta({ auth: false }) on a page by page basis.
//
// Keep rule paths free of trailing slashes (use '/test', not '/test/').
// Note: /login must stay public, or unauthenticated users will get stuck in
// a redirect loop.
//
///////////////////////////////////////////////////////////////////////////

const PUBLIC_PAGE_RULES: PathRule[] = [
  { path: '/' },
  { path: '/test', prefix: true }
  ///////////////////////////////////////////////////////////////////////////
  //
  //  /posts/create and /posts/:id/edit should be protected, but
  // /posts and /posts/:id should be public. Rather than making
  // the /posts prefix public, we can instead allow it to be private,
  //  and then opt-in to public specifically for /posts and /posts/:id
  // on the respective pages.
  //
  //   ❌ { path: '/posts', prefix: true }
  //
  ///////////////////////////////////////////////////////////////////////////
]

// Pages only for signed-out users
const GUEST_ONLY_RULES: PathRule[] = [
  { path: '/login' },
  { path: '/register' }
]

const ADMIN_PAGE_RULES: PathRule[] = [
  { path: '/admin', prefix: true }
]

/* ======================
      normalizePath()
====================== */
// ⚠️ Gotcha: If there's a rule of { path: '/about' }, but user types '/about/',
// it will not match. This is why normalizePath() is important.

const normalizePath = (path: string) => {
  let result = path
  while (result.length > 1 && result.endsWith('/')) {
    result = result.slice(0, -1)
  }
  return result
}

/* ======================
        matches()
====================== */

const matches = (rules: PathRule[], rawPath: string) => {
  const path = normalizePath(rawPath)

  return rules.some((rule) => {
    if (rule.prefix === true) {
      ///////////////////////////////////////////////////////////////////////////
      //
      // Why prefix + '/' matters:
      //
      // With a bare path.startsWith('/test'), a prefix of /test would also
      // make /testimonials, /tester-admin or /test-results public.
      // This matches /test itself and anything under /test/, and nothing else.
      //
      ///////////////////////////////////////////////////////////////////////////
      return path === rule.path || path.startsWith(rule.path + '/')
    }
    return path === rule.path
  })
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Currently, we're doing this:
//
//    const { data: session } = await authClient.useSession(useFetch)
//
//    if (!session.value) {
//      return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
//    }
//
// This is what the Better Auth docs actually do:
// https://better-auth.com/docs/integrations/nuxt#protect-pages
// But there's a gotcha to be aware of. Let's say we do this elsewhere:
//
//   await authClient.signOut()
//   await router.replace({ path: route.path, query: route.query, hash: route.hash, force: true })
//
// force:true causes the middleware to refire. However, there's a stale session gotcha!
// This stale session likely has less to do with useFetch and more to do with Better Auth's
// internal nanostore. Better Auth’s client does refetch/invalidate the session after sign-out,
// but there's a race condition. What's likely going on:
//
//   1. signOut() resolves and toggles the session signal.
//   2. The refetch triggered by that signal is asynchronous.
//   3. router.replace(..., { force: true }) fires the middleware right away.
//   4. The middleware calls useSession(useFetch), which returns the existing state,
//      still the old non-null session, because the signal-driven refetch hasn’t landed yet.
//
/////////////////////////
//
// It's important to note that the authClient does cache the client session in its own nanostore.
// This can be verified by doing this in server/middleware/logGetSession.ts:
//
//   export default defineEventHandler((event) => {
//     if (event.path.startsWith('/api/auth/get-session')) {
//       console.log('get-session hit', new Date().toISOString())
//     }
//   })
//
// The log shows: a "get-session hit..." only once!
// That may seem strange, but it's generally not a problem, especially considering that page-level
// route protection is only intended as a sueprficial UX feature. If you really didn't want that
// then you could force an actual server check on every protected page:
//
//   const requestFetch = useRequestFetch()
//   const session = await requestFetch('/api/auth/get-session').catch(() => null)
//   if (!session) { return navigateTo({ path: '/login', query: { redirect: to.fullPath } }) }
//
// However, this is entirely unnecessary. The only time we actually run into issues is in the
// very specific cases of logging in/out, then immediately navigating.
//
//   const { data: _loginData, error: loginError } = await authClient.signIn.email( ... )
//   await navigateTo('/user', { replace: true })
//
// Actually, at lest with signIn, this very issue can be mitigated simply by using the
// {  callbackURL: '/user' }, configuration option, rather than explicitly relying on Nuxt's
// programmatic navigation.
//
//
/////////////////////////
//
// So the issue is a race between the signal-triggered signIn/signOut and the navigation
// The best solution is to handle the issue locally (i.e., refresh before triggering middleware)
//
//   await refreshNuxtData()
//   await router.replace({ path: route.path, query: route.query, hash: route.hash, force: true })
//
// This solves the problem without needing to change the middelware itself (i.e., middlware optimization is preserved).
// Admittedly, the middleware is a gate, and a gate should answer "is this person logged in right now?" And, generally,
// it does that, except in this highly specific case.
//
///////////////////////////////////////////////////////////////////////////

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.meta.auth === false) return

  const isGuestOnlyPath = matches(GUEST_ONLY_RULES, to.path)
  const isPublicPath = matches(PUBLIC_PAGE_RULES, to.path)
  const isAdminPath = matches(ADMIN_PAGE_RULES, to.path)

  // Truly public pages: no session lookup needed
  if (isPublicPath && !isGuestOnlyPath) return

  const { data: session } = await authClient.useSession(useFetch)

  // The handleLogout() currently in app/components/Sidebar.vue sets logout=true.
  // If the user is actually logging out, then don't set the redirect
  const isLoggingOut = to.query.logout === 'true'

  // Guest-only pages: bounce signed-in users away
  if (isGuestOnlyPath) {
    if (session.value && !isLoggingOut) {
      return navigateTo('/user')
    }
    return
  }

  // Protected pages
  if (!session.value) {
    if (isLoggingOut) {
      return navigateTo({ path: '/login' })
    }

    // Always return the navigateTo(...) call, since calling it without return is a no-op.
    // Note: to.fullPath will bring query params along with it
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  // Logged in, but admin-only route requires ADMIN role
  if (isAdminPath && session.value?.user?.role !== 'ADMIN') {
    return navigateTo('/forbidden')
  }
})
