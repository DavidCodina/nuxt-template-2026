// https://nuxt.com/docs/4.x/getting-started/data-fetching

// ⚠️ This is a transient dependency...
import { FetchError } from 'ofetch'

///////////////////////////////////////////////////////////////////////////
//
// During SSR data is fetched twice, once on the server and once on the client.
//
// $fetch throws a FetchError for network failures and for any 4xx/5xx response.
// If you navigate to a page via the router, and it throws, it doesn't trigger
// error.vue. However, if you refresh the page and it throws, it will trigger
// error.vue. Why? What's the difference?
//
//   - Direct navigation (full page load) = SSR. The server renders the page,
//     the fetch fails, and the error propagates up. Since there’s no page to
//     fall back to, Nuxt renders error.vue as the response.
//
//   - Client-side navigation (/ to /test). The app is already mounted, so Nuxt
//     keeps the current page on screen while the next route’s async setup runs.
//     If that setup throws, Nuxt logs the error but does not show error.vue,
//     because error.vue is only triggered for fatal errors. A failed client-side
//     navigation is treated as non-fatal by default, so you stay on the old page
//     (or see nothing change).
//
// Consequently, it's always a good idea to wrap in a try/catch.
//
// Notice here that the result is the response body itself. This means
//
//   1. You don't acually need to check if the response is 'ok'. That's handled for you.
//      $fetch checks ok for you, and you handle failures in catch.
//      Inspect statusCode and data on the error instead of res.ok.
//
//   2. You also don't need to await the res.json().
//
// $fetch (built on ofetch) returns the parsed body, and it checks res.ok for you:
// any 4xx or 5xx response throws a FetchError, as do network failures
// (connection refused, DNS, timeout). So you don’t write the if (!res.ok) check;
// the catch block is where that logic lives.
//
// Use $fetch.raw('/external-api/users') only when you need headers or status on success,
// or ignoreResponseError if you truly want manual res.ok checks.
//
/////////////////////////
//
// $fetch() vs. useFetch():
//
//   While $fetch() works, useFetch() generally seems like the better choice.
//   useFetch wraps $fetch and gives you data, error, status, and refresh as
//   reactive refs, plus SSR payload handling so the request doesn’t fire twice.
//   There’s no try/catch to write, and you can’t forget to handle the error
//   because it’s a value you render.
//
// The catch: where it can be called
//
//   useFetch and useAsyncData are composables. They need to run during
//   component setup (or a plugin or route middleware), because they
//   depend on the current Nuxt context. So your getUsers as a plain
//   exported async function can’t just call useFetch from anywhere, such
//   as an event handler or a setTimeout callback.
//
//   That leads to a natural split:
//
//   +-------------------------------------+------------------------------------------+
//   | Situation                           | Use                                      |
//   +-------------------------------------+------------------------------------------+
//   | Loading data when a page or         | useFetch / useAsyncData                  |
//   | component renders                   |                                          |
//   +-------------------------------------+------------------------------------------+
//   | Reacting to a click, submit, or     | $fetch in try/catch                      |
//   | other event                         |                                          |
//   +-------------------------------------+------------------------------------------+
//   | Reusable data logic                 | a composable that wraps one of the above |
//   +-------------------------------------+------------------------------------------+
//
///////////////////////////////////////////////////////////////////////////

export const getUsers = async () => {
  try {
    const result = await $fetch('/external-api/users')
    return result
  } catch (e) {
    ///////////////////////////////////////////////////////////////////////////
    //
    // Rather than doing this all the time, it might be better to
    // create a type guard in the top-level utils directory.
    //
    //   function isFetchError(e: unknown): e is { statusCode?: number; data?: unknown } {
    //     return typeof e === 'object' && e !== null && 'statusCode' in e
    //   }
    //
    ///////////////////////////////////////////////////////////////////////////

    if (e instanceof FetchError) {
      // ...
    } else if (e instanceof Error) {
      // ...
    }

    return null
  }
}
