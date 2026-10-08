/* ========================================================================
                             GET: /api/posts
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// useFetch() usage:
//
//   const { data: { value: dataValue }, error: { value: errorValue } } = await useFetch('/api/posts')
//
//   if (dataValue) {
//     console.log('Case: data')
//     console.log(dataValue)
//   } else if (errorValue) {
//     if (isNuxtError(errorValue)) {
//       console.log('Case: NuxtError')
//       console.log(errorValue)
//     }
//   }
//
/////////////////////////
//
// $fetch() usage:
//
// Note $fetch() results in a FetchError when it throws.
// import { FetchError } from 'ofetch'
// Conversely, useFetch() results in a NuxtError when it throws.
//
// However, the types are similar. Both share { status?, statusText?, message, data?}
//
//   interface IFetchError<T = any> extends Error {
//     request?: FetchRequest;
//     options?: FetchOptions;
//     response?: FetchResponse<T>;
//     data?: T;
//     status?: number;
//     statusText?: string;
//     statusCode?: number;
//     statusMessage?: string;
//   }
//
//   export interface NuxtError<DataT = unknown> extends Error {
//     readonly __nuxt_error?: true;
//     error?: true;
//     /** Whether the error is fatal. */
//     fatal: boolean;
//     /** Whether the error was not handled by the application. */
//     unhandled: boolean;
//     /** Additional data attached to the error JSON body under `data`. */
//     data?: DataT;
//     status?: number;
//     statusText?: string;
//     /** @deprecated Use `status` */
//     statusCode?: number;
//     /** @deprecated Use `statusText` */
//     statusMessage?: string;
//     toJSON(): NuxtErrorJSON<DataT>;
//   }
//
// Here's the usage with $fetch:
//
//   import { FetchError } from 'ofetch'
//
//   const _result = await $fetch('/api/posts').then((data) => {
//     console.log('Case: data')
//     console.log(data)
//   }).catch((err) => {
//     // While you could do this:err?.name === 'FetchError',
//     // that doesn't actually convince TS what kind of error it is.
//     // Ultimately, you want FetchError from 'ofetch'
//     if (err instanceof FetchError) {
//       console.log('Case: FetchError')
//       console.log({ message: err.message, originalMessage: err.data.message, error: err, errorData: err.data.data })
//     }
//   })
//
///////////////////////////////////////////////////////////////////////////

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = String(query.q ?? '').toLowerCase()
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10))
  const filtered = q ? posts.filter((p) => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)) : posts
  const start = (page - 1) * limit

  // if (true) {
  //   throw createError({
  //     status: 400,
  //     message: 'This is a test...',
  //     data: {
  //       test: 'Testing 123...',
  //       code: 'BAD_REQUEST'
  //     }
  //   })
  // }

  const data = {
    items: filtered.slice(start, start + limit),
    total: filtered.length,
    page,
    limit
  }
  return data
})
