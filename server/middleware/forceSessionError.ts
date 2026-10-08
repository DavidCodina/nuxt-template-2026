export default defineEventHandler((event) => {
  if (
    import.meta.dev
      && getRequestURL(event).pathname.endsWith('/get-session')
  ) {
    // Warning: ONLY FOR TESTING authClient.useSession() during development.
    // Note because authClient.useSession(useFetch) uses useFetch, any error we throw
    // here will get transformed internally by ofetch and ultimately, become a NuxtError instance.
    // throw httpError({
    //   status: 500,
    //   message: 'Forced session error.'
    // })
  }
})
