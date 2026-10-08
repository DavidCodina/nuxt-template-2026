import db from '#server/db'
import { usersTable } from '#server/db/schema'

/* ========================================================================
                             GET: /api/users
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Basic Usage:
//
// const { data, error, status } = await useFetch<{ id: string; name: string }[]>('/api/users')
//
// <div v-if="status === 'pending'" class="my-12 text-center text-2xl font-bold text-primary">Loading...</div>
// <div v-else-if="error">Something went wrong: {{ error.message }}</div>
// <ul v-else class="mx-auto w-fit divide-y rounded-lg border bg-card shadow-sm">
//   <li v-for="(item, index) in data" :key="item.id" class="px-2 py-1 text-sm">
//     <span class="font-mono font-medium text-primary">{{ index + 1 }}.</span>
//     {{ item.name }}
//   </li>
// </ul>
//
///////////////////////////////////////////////////////////////////////////

// Test: curl http://localhost:3000/api/users
export default defineEventHandler(async (_event) => {
  try {
    return await db.select().from(usersTable)
  } catch (_err) {
    throw httpError({
      status: 400,
      message: 'Server error',
      data: {
        code: codes.INTERNAL_SERVER_ERROR
      }
    })
  }
})
