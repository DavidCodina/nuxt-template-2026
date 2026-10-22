<script setup lang="ts">
/* ======================
        Imports
====================== */

import PostItem from './PostItem.vue'
import type { PostTable } from '#server/db/schema'

/* ======================
        Types
====================== */

type Post = typeof PostTable.$inferSelect

/* ======================
       Composables
====================== */

const { data: posts, status, error, refresh } = useFetch<Post[]>('/api/posts', {
  default: () => []
})

/* ======================
        Computed
====================== */

const reversedList = computed(() => [...posts.value].reverse())
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section class="mx-auto w-full max-w-3xl">
    <!-- Loading -->

    <div
      v-if="status === 'pending' && !posts.length"
      class="
        divide-y divide-default overflow-hidden rounded-xl border border-default
        bg-card shadow-sm
      "
    >
      <div
        v-for="n in 4"
        :key="n"
        class="
          space-y-3 px-4 py-5
          sm:px-6
        "
      >
        <USkeleton class="h-4 w-24" />
        <USkeleton class="h-5 w-2/3" />
        <USkeleton class="h-4 w-full" />
      </div>
    </div>

    <!-- Error -->
    <UAlert
      v-else-if="error"
      class="mx-auto max-w-125 shadow-lg ring-error"
      color="error"
      variant="subtle"
      icon="i-lucide-triangle-alert"
      title="Error!"
      description="Couldn't load posts."
      :ui="{
        icon: 'size-8 self-start',
        title: 'text-lg font-semibold',
        description: 'italic',
        actions:
          // No need for this, do it in the actions objects.
          //❌ [&_button]:font-semibold [&_button]:border [&_button]:border-[rgba(0,0,0,0.25)]
          'self-start'

      }"
      :actions="[
        {
          label: 'Retry',
          color: 'error',
          class:
            'font-semibold border border-[rgba(0,0,0,0.25)] uppercase shadow hover:shadow-none',
          icon: 'i-lucide-rotate-cw',
          onClick: () => refresh()
        }
      ]"
      orientation="horizontal"
    />

    <!-- Empty -->
    <div
      v-else-if="!posts.length"
      class="
        flex flex-col items-center gap-3 rounded-xl border border-dashed
        border-primary bg-card px-6 py-16 text-center shadow-sm
      "
    >
      <UIcon
        name="i-lucide-file-text"
        class="size-8 text-primary"
      />
      <div>
        <p class="font-medium text-primary">
          No posts yet
        </p>
        <p class="mt-1 text-sm text-muted">
          Posts you write will show up here.
        </p>
      </div>
    </div>

    <!-- List -->
    <ul
      v-else
      class="
        divide-y divide-default rounded-xl border border-default bg-card
        shadow-sm
      "
    >
      <PostItem
        v-for="post in reversedList"
        :key="post.id"
        :post="post"
      />
    </ul>
  </section>
</template>
