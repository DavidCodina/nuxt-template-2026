/* ======================
        Types
====================== */

export type GetErrorMessageInput = {
  error: unknown,
  fallback?: string,

  /**
   * If true, the top-level error.message is returned even when the error
   * looks like an ofetch error (e.g. `[GET] "/api/x": 500 Server Error`).
   */
  allowFetchMessage?: boolean
}

/* ======================
    isValidMessage()
====================== */

const isValidMessage = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim() !== ''
}

/* ======================
looksLikeOfetchMessage()
====================== */
///////////////////////////////////////////////////////////////////////////
//
// About looksLikeOfetchMessage()
//
// Here we're trying to differentiate between errors thrown on the client like
// createError("You did a bad thing!") vs ones thrown on the server, which then
// get transformed on the client by ofetch.
//
// Why? Because createError() on the client preserves the original error message,
// but a createError() on the server gets transformed by useFetch/useAsyncData/$fetch
// into a different format that then buries the original message. Initially, this was tried:
//
//   const maybeFetchError = 'statusCode' in error || 'status' in error
//
// But that won't work because even on the client, H3's createError defaults statusCode
// to 500. Instead, we need to construct a regex that checks whether a message starts
// with the specific pattern ofetch uses for its auto-generated messages.
//
// Regex: /^\[[A-Z]+\]\s+"[^"]*":/
//
//   +----------+-------------------------------------------------------------------+
//   | Piece    | Plain English                                                     |
//   +----------+-------------------------------------------------------------------+
//   | ^        | The message must start here. The pattern isn't allowed to appear  |
//   |          | in the middle.                                                    |
//   +----------+-------------------------------------------------------------------+
//   | \[       | A literal opening square bracket. (The backslash means "the       |
//   |          | actual character, not regex syntax," since [ has a special        |
//   |          | meaning in regex.)                                                |
//   +----------+-------------------------------------------------------------------+
//   | [A-Z]+   | One or more capital letters: GET, POST, DELETE, etc.              |
//   +----------+-------------------------------------------------------------------+
//   | \]       | A literal closing square bracket.                                 |
//   +----------+-------------------------------------------------------------------+
//   | \s+      | One or more whitespace characters (the space after [GET]).        |
//   +----------+-------------------------------------------------------------------+
//   | "        | A literal double quote, opening the URL.                          |
//   +----------+-------------------------------------------------------------------+
//   | [^"]*    | Any characters except a double quote, zero or more of them. This  |
//   |          | matches the URL, whatever it is.                                  |
//   +----------+-------------------------------------------------------------------+
//   | "        | The closing double quote.                                         |
//   +----------+-------------------------------------------------------------------+
//   | :        | A literal colon right after the URL.                              |
//   +----------+-------------------------------------------------------------------+
//
// In everyday words: “Does this text begin with a bracketed HTTP method in capitals,
// then a space, then something in double quotes, then a colon?”
//
// Caveat: It depends on ofetch’s current message format. If a future version changes it,
// the regex stops matching and the boilerplate would slip through. A quick test with a
// forced error will tell you if that ever happens.
//
///////////////////////////////////////////////////////////////////////////

const looksLikeOfetchMessage = (msg: string) => /^\[[A-Z]+\]\s+"[^"]*":/.test(msg)

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
//   const errorMessage = computed(() => {
//     return getErrorMessage({
//       error: sessionError.value,
//       fallback: 'An error occurred while loading the session.',
//       allowFetchMessage: false // Default is false
//     })
//   })
//
///////////////////////////////////////////////////////////////////////////

/** A shared utility function for preferring the original message associated
 * to a thrown error, rather than an ofetch transformed error message. */
export function getErrorMessage({
  error,
  fallback = 'Something went wrong',
  allowFetchMessage = false
}: GetErrorMessageInput) {
  if (!error) return ''
  if (isValidMessage(error)) return error.trim()

  // Don't use if (isNuxtError(error)){ ... }. That may exclude certain errors
  // that still have the correct shape:FetchError, NuxtError, H3Error, etc.
  if (typeof error === 'object') {
    const data = 'data' in error && error.data && typeof error.data === 'object' ? error.data : undefined

    if (data) {
      if ('message' in data && isValidMessage(data.message)) {
        return data.message.trim()
      }

      if ('statusText' in data && isValidMessage(data.statusText)) {
        return data.statusText.trim()
      }

      if ('statusMessage' in data && isValidMessage(data.statusMessage)) {
        return data.statusMessage.trim()
      }
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // Errors thrown on the client (e.g. createError('You did a bad thing!')) keep
    // their message at the top level, so we return it.
    //
    // The exception is a message generated by ofetch, which Nuxt's $fetch (and
    // therefore useFetch, and useAsyncData when it calls $fetch) uses when a
    // request fails.
    //
    // When useFetch/useAsyncData/$fetch fails, the error is transformed by ofetch.
    // useFetch is a thin wrapper around useAsyncData that calls $fetch as its fetcher.
    // ofetch then generates the error message from the request and response, giving strings like:
    //
    //   [GET] "/api/auth/get-session": 500 Internal Server Error
    //
    // That message is designed for logs, not humans. Unless allowFetchMessage
    // is true, we skip it (see looksLikeOfetchMessage) and fall through to the fallback.
    //
    ///////////////////////////////////////////////////////////////////////////

    if ('message' in error && isValidMessage(error.message)) {
      if (allowFetchMessage || !looksLikeOfetchMessage(error.message)) {
        return error.message.trim()
      }
    }
  }

  return fallback
}
