/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// A plugin is code that runs once when your Nuxt app starts, before the app renders.
// You use plugins to set up things that should be available everywhere: third-party
// libraries, global helpers, analytics, and so on.
//
//   - Auto-registered: any file in app/plugins/ is loaded automatically, with no imports
//     or config needed. Only top-level files (and index files in subfolders) are scanned.
//
//   - Run order: plugins load alphabetically by filename. To control the order, prefix with
//     numbers (01.first.ts, 02.second.ts).
//
//   - Client/server only: use a suffix to limit where one runs: analytics.client.ts (browser only)
//     or db.server.ts (server only).
//
//   - Access: the nuxtApp object is what you receive (as an argument in the plugin) or get anywhere
//     via useNuxtApp(). Things you provide live on it with a $ prefix.
//
//   - Common uses: registering Vue plugins (nuxtApp.vueApp.use(...)), adding global helpers, wrapping
//     an API client, or hooking into app lifecycle events.
//
//  +------------------------------------+----------------------------------------------------+
//  | What you'd do in a Nuxt plugin     | Next.js equivalent                                 |
//  +------------------------------------+----------------------------------------------------+
//  | Register a library for the whole   | A Provider component wrapping {children} in the    |
//  | app (React Query, theming, i18n)   | root app/layout.tsx                                |
//  +------------------------------------+----------------------------------------------------+
//  | Provide a global helper (like      | Just export a function and import it where         |
//  | $greet)                            | needed, or share it via a React Context            |
//  +------------------------------------+----------------------------------------------------+
//  | Run code once at server startup    | instrumentation.ts with an exported                |
//  | (monitoring, DB init)              | register() function                                |
//  +------------------------------------+----------------------------------------------------+
//  | Client-only init (analytics)       | instrumentation-client.ts (Next 15.3+), or a       |
//  |                                    | 'use client' component using useEffect in          |
//  |                                    | the layout                                         |
//  +------------------------------------+----------------------------------------------------+
//  | Hook into every request            | middleware.ts                                      |
//  +------------------------------------+----------------------------------------------------+
//
// See here for mor info: https://nuxt.com/docs/4.x/directory-structure/app/plugins
//
/////////////////////////
//
// Usage:
//
//   const { $greet } = useNuxtApp()
//   <h1 class="font-bold text-primary text-3xl text-center my-12">
//
///////////////////////////////////////////////////////////////////////////

export default defineNuxtPlugin((_nuxtApp) => {
  // console.log('Greet plugin loaded!', _nuxtApp)

  return {
    provide: {
      greet: (name: string) => `Hello ${name}! 👋`
    }
  }
})
