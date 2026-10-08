/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha:
//
// Nuxt can't infer types from an imperative nuxtApp.provide() call.
// It only infers them from the object the plugin returns. Thus if
// we do this:
//
//   export default defineNuxtPlugin((nuxtApp) => {
//     nuxtApp.provide('alert', (message: string) => {
//       return alert(message)
//     })
//   })
//
// We get TS error when consuming:
//
//   ❌ '__VLS_ctx.$alert' is of type 'unknown'.ts-plugin(18046)
//
//
// If we do it this way (below), then Nuxt reads the return type of the plugin and generates
// types for $alert automatically. It will be typed as (message: string) => void in
// templates, in useNuxtApp().$alert, and in nuxtApp.$alert.
//
/////////////////////////
//
// Usage:
//
//   <button
//     class="text-white bg-green-500 px-2 py-1 rounded-lg"
//     @click="$alert('Hello from Nuxt!')"
//   >
//     Click Me
//   </button>
//
// This plugin is slightly more useful than the greet.ts because oridinarily one can't
// use window.alert() in Vue template logic:
//
//    ❌ Property 'alert' does not exist on type ComponentPublicInstance...
//    @click="alert('Hello from Nuxt!')"
//
// That said, it's still pretty dumb because you can easily do this in the script:
// const alert = globalThis.alert
//
///////////////////////////////////////////////////////////////////////////

export default defineNuxtPlugin(() => {
  return {
    provide: {
      alert: (message: string) => alert(message)
    }
  }
})
