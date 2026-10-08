// Note that .global.ts middleware runs alphabetically.

export default defineNuxtRouteMiddleware((_to, _from) => {
  // console.log(`The middleware/secondary.global.ts ran...`)
  // console.log('server: ', import.meta.server)
  // console.log({ to, from })
})
