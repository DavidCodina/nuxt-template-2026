/* ========================================================================

======================================================================== */
// In-memory store: resets on server restart and is not shared across
// serverless instances. Swap for a real database when you're ready.

export const users: User[] = [
  {
    id: '1',
    name: 'David M.Codina',
    email: 'david@example.com',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Holly Grant',
    email: 'holly@example.com',
    createdAt: new Date().toISOString()
  }

]

export const posts: Post[] = [
  { id: '1', title: 'Hello Nuxt', body: 'My first post.', createdAt: new Date().toISOString() },
  { id: '2', title: 'Nitro basics', body: 'server/api routes are great.', createdAt: new Date().toISOString() }
]
