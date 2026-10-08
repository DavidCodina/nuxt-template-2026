import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getErrorMessage, type GetErrorMessageInput } from '#shared/utils/getErrorMessage'
// Or do type GetErrorMessageInput = Parameters<typeof getErrorMessage>[0]

/* ======================
        Types
====================== */
// Every property can be a plain value, a ref, or a getter

type UseErrorMessageInput = {
  [K in keyof GetErrorMessageInput]: MaybeRefOrGetter<GetErrorMessageInput[K]>
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
//   const errorMessage = useErrorMessage({
//     error: sessionError, // ref, getter, or plain value
//     fallback: 'An error occurred while loading the session.',
//     allowFetchMessage: false // Default is false
//   })
//
//   // In template: {{ errorMessage }}
//
///////////////////////////////////////////////////////////////////////////

/** Built on top of getErrorMessage from shared/utils, this composable
 * abstracts the computed implementation and returns an errorMessage computed ref.
 * Each property passed to the UseErrorMessageInput object can be a ref,
 * getter, or plain value (i.e., type MaybeRefOrGetter).
 * */
export function useErrorMessage({ error, fallback, allowFetchMessage }: UseErrorMessageInput) {
  return computed(() => {
    return getErrorMessage({
      error: toValue(error),
      fallback: toValue(fallback),
      allowFetchMessage: toValue(allowFetchMessage)
    })
  })
}
