/* ========================================================================
                             GET: /api/env-test
======================================================================== */

export default defineEventHandler(async (_event) => {
  return {
    externalAPI: env.EXTERNAL_API
  }
})
