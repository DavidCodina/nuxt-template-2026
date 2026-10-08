// Note that .global.ts middleware runs alphabetically.
// To keep your naming conventions but change the order, you
// can add a prefix like 01.main.global.ts, 02.secondary.global.ts, etc.

export default defineNuxtRouteMiddleware((_to, _from) => {
  // console.log(`The middleware/main.global.ts ran...`)
  // console.log('server: ', import.meta.server)
  // console.log({ to, from })

  // Demo: redirect a "legacy" URL
  // if (to.path === '/old-about') {
  //   return navigateTo('/about', { redirectCode: 301 })
  // }

  // Demo: block a route entirely
  // if (to.path === '/secret') {
  //   return abortNavigation(createError({ statusCode: 403, statusMessage: 'Nope!' }))
  // }

  // Returning nothing means "carry on to the next middleware / the page"
})
