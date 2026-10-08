// Or do this, but it's a transient dependency.
// import type { H3Event, EventHandlerRequest } from 'h3'
// type SendErrorEvent = H3Event<globalThis.EventHandlerRequest>
type SendErrorEvent = Parameters<typeof sendError>[0]

type HTTPErrorConfig = {
  data?: Record<string, unknown>,
  message: string,
  status: Status
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// The statusText mapping object is in shared/utils/statusText.ts
// Status and StatusText types are in shared/types/index.ts
//
// Why are we wrapping createError?
//
// Nitro 3 upgrades to H3 v2, which replaces createError() with the HTTPError
// class (`throw new HTTPError({ ... })`) and renames the error fields:
//
//   - statusCode becomes status
//   - statusMessage becomes statusText.
//
// Rather than scatter createError calls across the codebase, every server error goes
// through this one function, so the migration becomes a single change here
// instead of a find-and-replace across many files. The wrapper also keeps
// statusText consistent by deriving it from the status code, so call sites
// only provide a status, a message, and optional data.
//
// See <root>/eslint for the associated 'local/prefer-http-error' rule.
// This rule is scoped ONLY to server/ in eslint.config.mjs, such that
// createError() is still acceptable to use on the client side.
//
/////////////////////////
//
// Why use createError() on the client?
//
// createError earns its place when you want Nuxt’s error page and response
// handling involved. For everything else, a plain Error is fine.
//
// What createError gives you over new Error()
//
//   1. Control over the HTTP status during SSR. When the error is thrown while
//      the server renders a page, statusCode becomes the response’s status.
//      throw createError({ statusCode: 404 }) in a page’s setup() makes the
//      server send a real 404, which matters for SEO and caching. A plain
//      Error there gives you a 500.
//
//   2. A recognizable Nuxt error. The __nuxt_error marker is how Nuxt tells “this
//      is an error I should present to the user” apart from “this is a bug.”
//      Nuxt’s error handling can key off that, including the fatal flag, which
//      decides whether a client-side error takes over the whole screen.
//
//   3. Structured fields for error.vue. Your error page gets statusCode, statusMessage,
//      and data to render, such as a 404 page with a “go home” button. A plain Error
//      only gives it a generic message.
//
//   4. Consistent shape across server and client. The error survives being serialized
//      from the SSR render into the client payload with those fields intact.
//
// Put simply, use createError on the Vue side when you want a status code or error
// page involved, mainly “not found” or “forbidden” in route middleware and page setup.
// Otherwise, throw a normal Error.
//
///////////////////////////////////////////////////////////////////////////

export const httpError = ({
  data,
  message,
  status
}: HTTPErrorConfig) => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // Fun fact: createError on the client and createError on the server are not
  // actually the same function. The real split isn’t client vs server, it’s
  // Vue app code vs Nitro server code. They’re two different functions with
  // the same name and a similar result. The two functions accept essentially
  // the same arguments, which is why they feel like one function.
  //
  // Only a throw createError(...) inside server/ uses H3’s pure version.
  // Moreover, on the server-side createError() is used almost entirely for
  // HTTP errors. For errors that aren’t really about the HTTP response, a
  // plain Error is the better choice.
  // Consequently, we are justified in naming this utility httpError().
  //
  ///////////////////////////////////////////////////////////////////////////

  return createError({
    // Note: In Nuxt 4.6.0, even if you used status / statusText, Nitro/H3
    // would convert it to statusCode/statusMessage - super annoying!
    statusCode: status,
    ///////////////////////////////////////////////////////////////////////////
    //
    // statusMessage (AKA statusText) is the reason phrase associated to a status.
    // See here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
    //
    // The actual Response object's statusText is optional and often absent from many
    // web responses (i.e., statusText: ""). Why? HTTP/2 and HTTP/3 dropped reason
    // phrases from the protocol entirely. It's not deprecated, but it is optional,
    // and speaking in general about HTTP, it is therefore unreliable.
    //
    // If you omit it here, Nitro seems to just add "Server Error". Ultimately, it
    // doesn't hurt to be explicit and add your own. However, as an API consumer, I
    // would rely 100% on just the status, or the statusCode with the current Nuxt 4.
    //
    // Note that when createError() is used on the client, statusMessage/statusText
    // are empty by default.
    //
    ///////////////////////////////////////////////////////////////////////////
    statusMessage: statusText[status],
    message: message,
    data: data
  })
}

///////////////////////////////////////////////////////////////////////////
//
// Note: there's also a built-in sendError() helper.
// sendError is a low-level helper that builds its own minimal response
// body rather than going through Nitro’s normal error formatter.
// In h3 v1 it only serializes statusCode, statusMessage, and data, and
// message isn’t part of that body. In other words, it swallows the message.
// I wouldn't use it, but it's nice to know about.
//
// Usage:
//
//   return sendHttpError(event, {
//     status: 404,
//     message: 'Resource not found dummy!',
//     data: { path: event.path }
//   }, true)
//
// Output:
//
//   {
//     "statusCode": 404,
//     "statusMessage": "Not Found",
//     "stack": [],
//     "data": { "path": "/api/abc123" }
//   }
//
// Actually, whether or not message you pass in to createError() is preserved
// depends on whether you're on the client or server.
//
//   - Client-side throw createError(...): the error object you create is the same one you catch.
//     Nothing wraps it, so message stays at the top level.
//
//   - Server-side throw createError(...) in an API route: the error object never leaves the server.
//     Nitro serializes it to a JSON body like { statusCode, statusMessage, message, ... } and sends
//    it over HTTP. On the client, ofetch receives that response and builds a new FetchError with
//    its own generated message ([GET] "/api/x": 500 Server Error), then attaches the parsed body
//    as error.data. Nuxt wraps that in a NuxtError. So your message ends up in error.data.message,
//    and the top-level message belongs to ofetch.
//
// The burying only happens when the error is thrown on the server and arrives through useFetch
// (or probalby also $fetch, useAsyncData). In other words, the same createError produces
// different shapes depending on whether it crossed an HTTP boundary and then transformed by ofetch.
//
///////////////////////////////////////////////////////////////////////////

const _sendHttpError = (event: SendErrorEvent, error: HTTPErrorConfig, debug: boolean = false) => {
  const H3Error = createError({
    statusCode: error.status,
    statusMessage: statusText[error.status],
    message: error.message,
    data: error.data
  })

  return sendError(event, H3Error, debug)
}
