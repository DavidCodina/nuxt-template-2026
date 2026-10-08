///////////////////////////////////////////////////////////////////////////
//
// server/middleware/ is Nitro middleware. It runs on every HTTP request that reaches the server:
// page loads, /api/users, _payload.json, and so on. It knows nothing about Vue or routes, only
// the raw request and response. It’s the right place for request logging, CORS headers, rate
// limiting, or reading a session cookie.
//
// app/middleware/ is route middleware. It runs when the Vue router navigates to a page, and it
// uses defineNuxtRouteMiddleware with helpers like navigateTo() and abortNavigation(). It’s the
// right place for things like “redirect to /login if the user isn’t authenticated.”
//
// +-----------------------------------------------+------------------------------------+---------------------------------+
// |                                               | server/middleware                  | app/middleware                  |
// +-----------------------------------------------+------------------------------------+---------------------------------+
// | Runs on                                       | Every HTTP request                 | Vue router navigations          |
// | Triggered by /api/users?                      | Yes                                | No                              |
// | Triggered by client-side <NuxtLink> click?    | No (no request is made)            | Yes                             |
// | Triggered on first page load?                 | Yes                                | Yes (during SSR)                |
// | API                                           | defineEventHandler                 | defineNuxtRouteMiddleware       |
// | Can redirect with                             | sendRedirect(event, '/login')      | return navigateTo('/login')     |
// +-----------------------------------------------+------------------------------------+---------------------------------+
//
///////////////////////////////////////////////////////////////////////////

export default defineEventHandler((_event) => {
  // const start = Date.now()
  // const { method, path } = event

  // // To restrict logging to API routes only, check event.path.startsWith('/api') instead.

  // event.node.res.on('finish', () => {
  //   const duration = Date.now() - start
  //   const status = event.node.res.statusCode
  //   const headers = getRequestHeaders(event)
  //   const level = status >= 500 ? 'ERROR' : status >= 400 ? 'WARN' : 'INFO'

  //   console.log('\n-----------------------------------------------------------------\n')

  //   console.log('-----------------------------------------------------------------\n')

  //   console.log(`The server/middleware/logger.ts ran at: ${new Date().toLocaleString()}`, {
  //     level,
  //     path,
  //     status,
  //     method,
  //     duration: `${duration}ms`,
  //     requestURL: getRequestURL(event)
  //   })

  //   console.log('\nHere\'s some additional data:\n')

  //   console.log({
  //     // Request details
  //     userAgent: headers['user-agent'],
  //     ip: getRequestIP(event, { xForwardedFor: true }),
  //     referer: headers.referer,
  //     host: getRequestHost(event),
  //     query: getQuery(event),

  //     // Content and size
  //     contentType: headers['content-type'],
  //     contentLength: headers['content-length'],
  //     responseType: event.node.res.getHeader('content-type'),
  //     responseSize: event.node.res.getHeader('content-length'),

  //     // Auth and session (names/booleans only, never values)
  //     hasAuthHeader: Boolean(headers.authorization),
  //     cookieNames: Object.keys(parseCookies(event)),

  //     // Routing
  //     matchedRoute: event.context.matchedRoute?.path,
  //     routeParams: event.context.params,

  //     // Environment
  //     memoryMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
  //     pid: process.pid
  //   }, '\n')
  // })
})
