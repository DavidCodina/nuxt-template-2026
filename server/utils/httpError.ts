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
//
///////////////////////////////////////////////////////////////////////////

export const httpError = ({
  data,
  message,
  status
}: HTTPErrorConfig) => {
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
///////////////////////////////////////////////////////////////////////////

const _sendHttpError = (event: SendErrorEvent, error: HTTPErrorConfig, debug: boolean = false) => {
  const h3Error = createError({
    statusCode: error.status,
    statusMessage: statusText[error.status],
    message: error.message,
    data: error.data
  })

  return sendError(event, h3Error, debug)
}
