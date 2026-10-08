<script setup lang="ts">
/* ======================
        Imports
====================== */

import type { PostTable } from '#server/db/schema'

/* ======================
        Types
====================== */

type Post = typeof PostTable.$inferSelect

/* ======================
        Props
====================== */

const props = defineProps<{
  post: Post
}>()

// Treat anything updated more than a second after creation as edited
const isEdited = computed(
  () => new Date(props.post.updatedAt).getTime() - new Date(props.post.createdAt).getTime() > 1000
)
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <li>
    <NuxtLink
      :to="`/posts/${post.id}`"
      class="
        group block
        focus-visible:outline-2 focus-visible:-outline-offset-2
        focus-visible:outline-primary
      "
    >
      <article
        class="
          flex items-start gap-4 p-6 transition-colors
          group-hover:bg-primary/10
        "
      >
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 text-sm text-muted">
            <NuxtTime
              :datetime="post.createdAt"
              relative
            />
            <UBadge
              v-if="isEdited"
              label="Edited"
              color="info"
              variant="subtle"
              size="sm"
            />
          </div>

          <h3
            class="
              mt-1 truncate text-base font-semibold text-primary
              transition-colors
            "
          >
            {{ post.title }}
          </h3>

          <p class="mt-1 line-clamp-2 text-sm/6 text-toned">
            {{ post.body }}
          </p>
        </div>

        <UIcon
          name="i-lucide-arrow-up-right"
          class="
            mt-1 size-5 shrink-0 text-dimmed transition
            group-hover:translate-x-0.5 group-hover:-translate-y-0.5
            group-hover:text-primary
          "
        />
      </article>

    </NuxtLink>
  </li>
</template>
