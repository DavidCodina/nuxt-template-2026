/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha:
//
// Currently (Nuxt 4.6.0), statusCode and statusMessage are marked as deprecated within NuxtError.
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
// Why? Because Nuxt 5 / Nitro v3 / H3 v2 are moving to using status and statusText.
// Because useFetch() exposes BOTH statusCode/statusMessage and status/statusText, it's
// progressive to access the result by checking the latter. However, it's somewhat of a
// different story when throwing createError().
//
// Nuxt 4.6.0, uses Nitro v2 / H3 v1.
// Nuxt 5 will use Nitro v3 / H3 v2.
// Eventually, the approach will be to use status and statusText when throwing:
//
//   throw createError({
//     status: 404,
//     statusText: 'Not Found',
//     message: 'Resource not found.',
//     data: { path: event.path }
//   })
//
// However, if you do that right now, you'll still get back the legacy statusCode and statusMessage
// on the raw response body. The serialized error body still uses the legacy keys.
// This is super annoying and unintuitive.
//
//   {
//     "error": true,
//     "url": "http://localhost:3000/api/asdf",
//     "statusCode": 404,
//     "statusMessage": "Not Found",
//     "message": "Resource not found.",
//     "data": { "path": "/api/asdf" },
//     "stack": []
//   }
//
// The current best solution is to just stick to using the legacy statuCode/statusMessage,
// but be prepared to eventually have to update all your createError() calls. In order to
// minimize the migration impact, I've opted for a wrapper function at server/utils/httpError.ts.
//
/////////////////////////
//
// Regarding the Web API Response Object:
// https://developer.mozilla.org/en-US/docs/Web/API/Response
//
// status and statusText are standard instance properties of Response.
// So why did Nitro / H3 originally use statusCode and statusMessage, rather
// than the standard status and statusText?
//
// Those names come from Node’s built-in http module: res.statusCode and res.statusMessage
// on ServerResponse, and the same pair on IncomingMessage. H3 v1 sat directly on Node’s
// req/res objects and followed the Connect/Express lineage, so it kept Node’s vocabulary.
//
// Why change now? H3 v2 is a different foundation. H3 v2 is rewritten on web standard
// primitives (URL, Headers, Request, and Response). On Node, it uses a compatibility layer
// (srvx), and on other runtimes it uses the native web APIs. Once the framework’s core
// objects are standard Request and Response, keeping Node’s names would mean translating
// between two vocabularies at every boundary. Aligning with status and statusText removes
// that, and it also helps with portability across Node, Deno, Bun, and edge runtimes, where
// Nitro wants to run.
//
///////////////////////////////////////////////////////////////////////////

export default defineEventHandler(async (event) => {
  throw httpError({
    status: 404,
    message: 'Resource not found.',
    data: { path: event.path }
  })
})
