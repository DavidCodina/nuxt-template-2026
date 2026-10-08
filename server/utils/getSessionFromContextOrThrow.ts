import type { H3Event } from 'h3'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This works in conjunction with server/middleware/auth.ts, which sets
// the session in context for authenticated requests. Here we're simply
// checking the context, rather than doing a separate call to auth.api.getSession.
// In practice the session will always be available for requests that have already
// been authenticated. However, if the session is not there and the control flow
// somehow made it this far, then throw an error.
//
// Note: This ALWAYS throws on public routes. Consequently, it's usage is only
// intended for protected API routes in order to get the session from context.
// In other words, it's NOT intended as an authentication check like this:
//
//   const session = await auth.api.getSession({ headers: event.headers });
//   if (!session?.user) {
//     throw httpError({ status: 401, message: 'Authentication is required.', data: { code: codes.UNAUTHORIZED } })
//   }
//
// '/api' server routes are ALREADY protected! The point of throwing an error is NOT
// to authenticate and protect (hence status:500 and not 401), but to inform TypeScript
// that the session is never undefined.
//
/////////////////////////
//
// Ultimately, if an API endpoint wants to get the session, all they need to do is
//
//     const session = event.context.session
//
// So what's the actual benefit of preferring getSessionFromContextOrThrow?
// It’s useful for one reason: type narrowing. Because event.context.session is declared
// optional in server/types/h3.d.ts (session?: Session), the one-liner gives you
// Session | undefined. Every handler then would have to either write session?.user.id
// everywhere or add a ! or ts own if (!session) check. The helper narrows that to Session in one call.
//
// The trade-off here is that a developer could potentially think this function is for API route protection,
// In practice, using it in a handler won't blow up the endpoint because everything is protected by default,
// unless they somehow also made the API route public. Hopefully, all of this is mitigate by the precise
// naming convention used.
//
///////////////////////////////////////////////////////////////////////////

/** This utility should ONLY be used in API routes already protected by server/middleware/auth.ts.
 * Because it throws if there's no session, TypeScript can infer that there will always be a session.
 * This utility function is NOT intended for API route protection. It's to get the session within
 * routes that are ALREADY protected. By default, all routes are protected. Don't use this if you also
 * make the route public!
 */
export const getSessionFromContextOrThrow = (event: H3Event) => {
  const session = event.context.session
  if (!session) {
    throw httpError({
      status: 500,
      message: 'Possible developer error: getSessionFromContextOrThrow() should not be used within public API routes.',
      data: { code: codes.INTERNAL_SERVER_ERROR }
    })
  }
  return session
}
