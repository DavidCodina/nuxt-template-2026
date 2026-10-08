<script setup lang="ts">
///////////////////////////////////////////////////////////////////////////
//
// Composables are sometimes described as Vue's response to React hooks.
// However, another way to conceptualize them is as the Composition API's
// equivalent of mixins from the Options API, but with added benefits.
// They allow us to abstract out reactive data and methods, independent from
// a particular component.
//
///////////////////////////////////////////////////////////////////////////

/* ======================
        Imports
====================== */

// No need to explicitly import it when using Nuxt.

/* ======================
    Refs (i.e., State)
====================== */

// Each call to useCounter() creates its own INDEPENDENT count ref.
// Nothing is shared between these two unless you deliberately share it
// (e.g. by calling useCounter() once in a parent and passing the result
// down as props — same idea as lifting state up in React).
const counter1 = useCounter(0)
const counter2 = useCounter(0, 5)
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section>
    <h2 class="mb-1 text-center font-mono text-2xl text-primary">
      ComposablesDemo1.vue
    </h2>

    <div class="flex flex-wrap justify-center gap-4">
      <!-- ====================

      ===================== -->

      <div class="space-y-2 rounded-lg border bg-card p-2 shadow-sm">
        <div
          class="text-center text-4xl font-semibold text-primary tabular-nums"
        >
          {{ counter1.count.value }}
        </div>

        <div class="flex gap-2">
          <button
            class="
              min-w-15 flex-1 rounded-sm bg-secondary px-2 py-1 text-sm
              font-semibold text-white
              hover:bg-primary
            "
            @click="counter1.decrement"
          >
            -{{ counter1.step }}
          </button>

          <button
            class="
              min-w-15 flex-1 rounded-sm bg-secondary px-2 py-1 text-sm
              font-semibold text-white
              hover:bg-primary
            "
            @click="counter1.reset"
          >
            Reset
          </button>

          <button
            class="
              min-w-15 flex-1 rounded-sm bg-secondary px-2 py-1 text-sm
              font-semibold text-white
              hover:bg-primary
            "
            @click="counter1.increment"
          >
            +{{ counter1.step }}
          </button>
        </div>
      </div>

      <!-- ====================

      ===================== -->

      <div class="space-y-2 rounded-lg border bg-card p-2 shadow-sm">
        <div
          class="text-center text-4xl font-semibold text-primary tabular-nums"
        >
          {{ counter2.count.value }}
        </div>
        <div class="flex gap-2">
          <button
            class="
              min-w-15 flex-1 rounded-sm bg-secondary px-2 py-1 text-sm
              font-semibold text-white
              hover:bg-primary
            "
            @click="counter2.decrement"
          >
            -{{ counter2.step }}
          </button>

          <button
            class="
              min-w-15 flex-1 rounded-sm bg-secondary px-2 py-1 text-sm
              font-semibold text-white
              hover:bg-primary
            "
            @click="counter2.reset"
          >
            Reset
          </button>

          <button
            class="
              min-w-15 flex-1 rounded-sm bg-secondary px-2 py-1 text-sm
              font-semibold text-white
              hover:bg-primary
            "
            @click="counter2.increment"
          >
            +{{ counter2.step }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
