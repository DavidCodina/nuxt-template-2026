///////////////////////////////////////////////////////////////////////////
//
// It's often said that types defined in /server/types are ONLY available within the server
// directory. However, that may not be entirely true (see .nuxt/types/nitro-imports.d.ts).
//
// Nitro scans files directly in server/types/ and generates a `declare global` block
// (see .nuxt/types/nitro-imports.d.ts) that re-exports every exported type globally.
// That's why these types are usable in server code without imports.
//
// They also appear to be visible in app/ code. The app tsconfig excludes server/ but includes
// .nuxt/nuxt.d.ts, which (apparently) references the generated Nitro declaration files,
// including nitro-imports.d.ts. That is how the global re-export reaches the app project.
// This makes it possible for things like useFetch to know the data type of '/api/users'.
//
//   const { data } = await useFetch('/api/users')
//
// Hover the above data and it will show:
//
//   const data: globalThis.Ref<SerializeObject<globalThis.User>[] | undefined, SerializeObject<globalThis.User>[] | undefined>
//
// For this reason, you can also explicitly implement User and it will be available.
//
//   const { data } = await useFetch<User[]>('/api/users')
//
// Of course, there's no reason to be explicit here because it's already inferred.
//
// However, Nitro doesn't seem to be selectively picking out types only used by API routes.
// It seems to just globalize everything in this file such that even this (used nowhere) in
// server is STILL available in app.
//
//   export type ME = { name: string, email: string }
//
// This isn't documented behavior. If a type is needed in both app/ and server/,
// put it in shared/types/ instead.
//
/////////////////////////
//
//   - Surprising? Yes, because the docs say “server context only”.
//
//   - Expected? Globalizing everything in server/types/ is by design.
//     Visibility in app/ is not documented, and it is an accidental consequence
//     of how the generated files are wired together.
//
//   - Bug? It’s an inconsistency between the documentation and actual behavior.
//     I’d report it as a docs/behavior mismatch rather than a crash-level bug.
//     The nuxt.d.ts grep result would be worth including in any issue you file.
//
/////////////////////////
//
// I have since moved types like User to shared/types. However, it's
// important to be aware that anything you put here will likely
// be globally available.
//
///////////////////////////////////////////////////////////////////////////
