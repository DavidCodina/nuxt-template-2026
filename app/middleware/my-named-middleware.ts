// Use definePageMeta to run a named middleware in a given page
// definePageMeta({ middleware: ['my-named-middleware'] })

export default defineNuxtRouteMiddleware((_to, _from) => {
  console.log(`The middleware/my-named-middleware.ts ran...`)
})
