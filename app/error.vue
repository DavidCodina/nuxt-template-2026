<!-- https://nuxt.com/docs/4.x/directory-structure/app/error -->

<script setup lang="ts">
import type { NuxtError } from '#app'
import { FileQuestionMark } from '@lucide/vue'

///////////////////////////////////////////////////////////////////////////
//
// The error object provides the following fields:
//
// interface NuxtError {
//   status: number
//   fatal: boolean
//   unhandled: boolean
//   statusText?: string
//   data?: unknown
//   cause?: unknown
//   // legacy/deprecated equivalent of `status`
//   statusCode: number
//   // legacy/deprecated equivalent of `statusText`
//   statusMessage?: string
// }
//
///////////////////////////////////////////////////////////////////////////

const props = defineProps<{ error: NuxtError }>()

console.log(props.error)
</script>

<!-- # Presumably, we can check error.status to see if it's 404 and if so then render not found title -->
<!-- # Otherwise render a different title. -->

<!-- Actually, error.vue is primarily for Nuxt rendering/navigation errors,
 not arbitrary exceptions thrown inside a client-side click handler.

 const handleThrow = () => { throw new Error('Kaboom!')}

 <UButton
  class="flex mx-auto"
  color="error"
  @click="handleThrow"
>Throw an error</UButton>

kinds of errors that can trigger Nuxt's error handling and render error.vue.

  - page rendering
  - setup()
  - useAsyncData()
  - route middleware
  - plugins
  - server routes
  - navigation lifecycle hooks

To intentionally show error.vue do one of these:

throw createError({
  statusCode: 500,
  statusMessage: 'Kaboom!',
  fatal: true,
})

showError({
  statusCode: 500,
  statusMessage: 'Kaboom!',
})

-->

<!--
Todo: Add a Go Back button.

Todo: Add a Go Home button.

Todo: This is not a page, so you lose the Sidebar. Add it manually here if you want it.
-->
<template>
  <Page>
    <PageContainer>
      <h1
        class="
          mb-6 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light
          text-rose-500 uppercase
        "
      >
        _NOT FOUND <FileQuestionMark
          class="size-[1em]"
          stroke-width="1"
        />
      </h1>

      <p class="text-center text-red-500">
        {{ error.status }}
      </p>

      <div class="flex justify-center gap-2">
        <UButton
          color="error"
          to="/"
        >
          Go back home
        </UButton>
      </div>
    </PageContainer>
  </Page>
</template>
