<script setup lang="ts">
/* ======================
        Imports
====================== */
// No need to import Reactivity APIs, Lifecycle Hooks, or Nuxt-specific composables

// No need to import cn() explicitly.
// https://nuxt.com/docs/4.x/directory-structure/app/utils
// import { cn } from '@/utils/cn'
import type { HTMLAttributes } from 'vue'

/* ======================
      Props / Emits
====================== */

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<!-- ======================================================================

======================================================================= -->

<!-- Note: Initially, I this component was home to a page-level error boundary
 That rendered fallback UI for uncaught errors.

  const error = ref<Error | null>(null)

  const handleReset = () => {
    error.value = null
  }

  onErrorCaptured((err, _instance, _info) => {
    error.value = err
    return false
  })

  ...

  <Container
    v-if="!!error"
  >
    <h3 class="text-3xl font-black text-error text-center mb-6">Error!</h3>
    <p class="mb-6 text-xl text-center font-medium text-red-700 italic">{{ error?.message }}</p>

    <div class="flex gap-2 justify-center">
      <UButton
        icon="i-lucide-zap"
        color="error"
        class="flex justify-center min-w-30 cursor-pointer"
        @click="handleReset"
      >
        RETRY
      </UButton>

      <UButton
        to="/"
        icon="i-lucide-zap"
        color="error"
        class="flex justify-center min-w-30 cursor-pointer"
      >
        Go Home
      </UButton>
    </div>
  </Container>

  <slot v-else />

However, this kind of implementation is overkill because it entirely replaces the UI.
For page rendering and setup errors, we already have error.vue.
Beyond that most errors that occur AFTER the page has rendered do not cause the app
to crash - that's actually the strongest argument against the page-level boundary.
It's not like the white screen of death from older React apps.

Generally, what you want is to use try/catch for operations that are expected
to fail (API calls, validation, storage access, third-party integrations, etc).
Error boundaries are better suited for unexpected rendering or component failures.

Beyond that, event-driven errors like this would trigger onErrorCapture here

  const handleThrow = () => throw new Error('Kaboom!')

But other errors like this would not:

  onMounted(() => {
    setTimeout(() => { throw new Error('Blam!') }, 3000)
  })

So already it's kind of hit or miss. Consequently, there's really no need for this.
If you were going to do anything, I'd suggest just running a generic toast message,
but definitely not a full-blow UI switch.

TL;DR: A page-level error boundary sounds useful until you try to define exactly which errors it should catch.
In a typical Nuxt app, a page-level error boundary and error.vue would overlap quite a bit.
What would the page-level error boundary buy you that error.vue doesn't? Not much.

  1. Fatal page/setup failures already go to error.vue.
  2. Click-handler errors don't crash the page.
  3. Timer errors don't get caught.
  4. API failures should usually be handled locally.
  5. Async failures should usually be handled locally.

Ultimately the use of onErrorCaptured is more useful for specific high-risk components.

  <WidgetBoundary>
    <MassiveChartLibrary />
  </WidgetBoundary>

If the chart explodes, you can render some fallback UI.
-->

<template>
  <main
    data-slot="page"
    :class="
      cn(`
        relative flex min-h-dvh w-full max-w-full flex-1 flex-col
        overflow-hidden
      `, props.class)
    "
  >
    <slot />
  </main>
</template>
