/* ========================================================================
                             GET: /api/admin
======================================================================== */

export default defineEventHandler(async (_event) => {
  return {
    test: 'You\'ve accessed the admin API!'
  }
})
