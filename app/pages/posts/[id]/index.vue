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
         State
====================== */

const isDeleting = ref(false)

/* ======================
       Composables
====================== */

const route = useRoute()
const id = computed(() => route.params.id as string)

const {
  data: post,
  status,
  error,
  refresh
} = useFetch<Post>(
  () => `/api/posts/${id.value}`
)

const {
  data: sessionData,
  error: _sessionError,
  isPending: _sessionIsPending
} = await authClient.useSession(useFetch)

const toast = useToast()

/* ======================
        Computed
====================== */

const isNotFound = computed(() => {
  // error.value will be an H3Error if it exists.
  // The 404 status code assumes that server/api/posts/[id].get.ts
  // throws a 404 when !post, which it does.
  return error.value?.status === 404
})

const isEdited = computed(() => {
  if (!post.value) return false
  return (
    new Date(post.value.updatedAt).getTime()
      - new Date(post.value.createdAt).getTime()
      > 1000
  )
})

const isOwner = computed(() => {
  const sessionUserId = sessionData.value?.user.id
  const postUserId = post.value?.userId
  // Both must exist, otherwise two undefined values would count as a match
  return !!sessionUserId && !!postUserId && sessionUserId === postUserId
})

/* ======================
        Functions
====================== */

const handleDelete = async () => {
  if (!post.value || isDeleting.value === true) return

  const confirmed = window.confirm(
    `Delete "${post.value.title}"? This can't be undone.`
  )
  if (!confirmed) return

  isDeleting.value = true

  try {
    await $fetch(`/api/posts/${id.value}`, { method: 'DELETE' })

    toast.add({
      title: 'Success',
      description: `Post deleted.`,
      icon: 'i-lucide-circle-check-big',
      color: 'success'
    })

    await navigateTo('/posts')
  } catch (_err) {
    toast.add({
      title: 'Error',
      description: 'Unable to delete post.',
      color: 'error',
      icon: 'i-lucide-triangle-alert'
    })
  } finally {
    isDeleting.value = false
  }
}

/* ======================
        Macros
====================== */

definePageMeta({ auth: false })
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <Page>
    <UButton
      to="/posts"
      label="All Posts"
      icon="i-lucide-arrow-left"
      color="secondary"
      variant="link"
      class="
        absolute top-2 left-10 z-99 py-1
        hover:text-primary
      "
    />

    <PageContainer class="pt-10">
      <div
        v-if="status === 'pending' && !post"
        class="mx-auto max-w-250 space-y-4 rounded-xl bg-card p-6 shadow-sm"
      >
        <USkeleton class="h-4 w-24" />
        <USkeleton class="h-8 w-2/3" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-3/4" />
      </div>

      <!-- Error -->
      <UAlert
        v-else-if="error"
        class="mx-auto max-w-125 shadow-lg ring-error"
        color="error"
        variant="subtle"

        icon="i-lucide-triangle-alert"

        :title="isNotFound ? 'Post not found' : 'Error!'"
        :description="
          isNotFound
            ? 'This post may have been deleted.'
            : 'Couldn\'t load this post.'
        "
        :ui="{
          icon: 'size-8 self-start',
          title: 'text-lg font-semibold',
          description: 'italic',
          actions:
            // No need for this, do it in the actions objects.
            //❌ [&_button]:font-semibold [&_button]:border [&_button]:border-[rgba(0,0,0,0.25)]
            'self-start'

        }"
        :actions="
          isNotFound
            ? []
            : [
              {
                label: 'Retry',
                color: 'error',
                class:
                  'font-semibold border border-[rgba(0,0,0,0.25)] uppercase shadow hover:shadow-none',
                icon: 'i-lucide-rotate-cw',
                onClick: () => refresh()
              }
            ]
        "
        orientation="horizontal"
      />

      <!-- Post -->
      <template v-else-if="post">
        <section
          class="mx-auto max-w-250 rounded-xl border bg-card p-6 shadow-sm"
        >
          <header>
            <div class="mb-2 flex items-center gap-2 text-sm text-muted">
              <NuxtTime
                :datetime="post.createdAt"
                date-style="long"
              />
              <UBadge
                v-if="isOwner"
                label="Owner"
                color="success"
                variant="subtle"
                size="sm"
              />

              <UBadge
                v-if="isEdited"
                label="Edited"
                color="info"
                variant="subtle"
                size="sm"
              />
            </div>

            <h1 class="mb-2 text-2xl font-bold text-primary">
              {{ post.title }}
            </h1>
          </header>

          <!-- Without "whitespace-pre-line", a post with paragraphs or line breaks will collapse into
           one block of text. Adding it back is a one-word change: <p class="whitespace-pre-line">. -->
          <p class="whitespace-pre-line">
            {{ post.body }}
          </p>

          <div
            v-if="isOwner"
            class="mt-6 flex justify-end gap-2"
          >
            <UButton
              class="min-w-25 justify-center select-none"
              label="Delete"
              icon="i-lucide-trash-2"
              color="error"
              variant="subtle"
              :loading="isDeleting"
              @click="handleDelete"
            />

            <UButton
              class="min-w-25 justify-center select-none"
              label="Edit"
              icon="i-lucide-pencil"
              color="info"
              variant="subtle"

              @click="navigateTo(`/posts/${id}/edit`)"
            />
          </div>
        </section>
      </template>
    </PageContainer>
  </Page>
</template>
