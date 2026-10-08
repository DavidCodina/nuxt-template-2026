<script setup lang="ts">
/* ======================
       Composables
====================== */

// const toast = useToast()

const {
  data: sessionData,
  error: sessionError,
  isPending: sessionIsPending
} = await authClient.useSession(useFetch)

// Do not do this. It will not be reactive.
// ❌ const sessionDataValue = sessionData.value

const errorMessage = useErrorMessage({
  error: sessionError, // ref, getter, or plain value
  fallback: 'An error occurred while loading the session.',
  allowFetchMessage: false // Default is false
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <!-- To test sessionError, we can create server/middleware/forceSessionError.ts.
      Otherwise, this isn't something that happens too often.

        export default defineEventHandler((event) => {
          if (import.meta.dev && getRequestURL(event).pathname.endsWith('/get-session')) {
            throw httpError({ status: 500, message: 'Forced session error' })
          }
        })
      -->
  <UAlert
    v-if="sessionError"
    class="mx-auto max-w-125 shadow-lg ring-error"
    color="error"
    title="Error!"
    variant="subtle"
    icon="i-lucide-triangle-alert"
    :ui="{
      icon: 'size-8 self-start',
      title: 'text-lg font-semibold',
      description: 'italic'

    }"
    orientation="horizontal"
  >
    <!-- Is there some way to replace the slot's div, rather that the content going in the slot? -->
    <template #description>
      {{ errorMessage }}
    </template>
  </UAlert>

  <!--
      ^ When would this occur?
      # Change to alert
       -->
  <div
    v-else-if="sessionIsPending"
    class="text-center text-3xl font-bold text-error"
  >
    An error occurred when loading the session.
  </div>

  <!-- # Change to alert -->
  <div
    v-else-if="!sessionData"
    class="text-center text-3xl font-bold text-error"
  >
    No Session
  </div>

  <pre
    v-else
    class="
      mx-auto w-fit max-w-full overflow-x-auto rounded-xl border bg-card p-6
      text-sm
    "
  ><code>{{ sessionData }}</code></pre>
</template>
