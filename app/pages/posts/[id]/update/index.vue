<script setup lang="ts">
/* ======================
        Imports
====================== */

import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { PostTable } from '#server/db/schema'

/* ======================
        Schema
====================== */
// Mirrors the server's UpdatePostSchema. Both fields are required in the
// form (they're pre-filled), but only changed fields are sent to the API.

const updatePostSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  body: z.string().trim().min(1, 'Body is required')
})

/* ======================
        Types
====================== */

type Post = typeof PostTable.$inferSelect

type UpdatePostSchema = z.output<typeof updatePostSchema>

/* ======================
         State
====================== */

const isSubmitting = ref(false)

const state = reactive({
  title: '',
  body: ''
})

const hasAttemptedSubmit = ref(false)

/* ======================
       Composables
====================== */

const route = useRoute()

const toast = useToast()

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

/* ======================
        Computed
====================== */

const isLoading = computed(() => status.value === 'pending' && !post.value)

const isNotFound = computed(() => {
  // error.value will be an H3Error if it exists.
  // The 404 status code assumes that server/api/posts/[id].get.ts
  // throws a 404 when !post, which it does.
  return error.value?.status === 404
})

const isOwner = computed(() => {
  const sessionUserId = sessionData.value?.user.id
  const postUserId = post.value?.userId
  // Both must exist, otherwise two undefined values would count as a match
  return !!sessionUserId && !!postUserId && sessionUserId === postUserId
})

/* ======================
        Watchers
====================== */

// Populate the form once the post arrives. `immediate` covers the case where
// the data is already available (e.g., from the payload after SSR).
watch(
  post,
  (newPost) => {
    if (!newPost) return
    state.title = newPost.title
    state.body = newPost.body
  },
  { immediate: true }
)

/* ======================
        Functions
====================== */

const handleError = () => {
  hasAttemptedSubmit.value = true
}

const updatePost = (input: Partial<UpdatePostSchema>) => {
  return $fetch<Post>(`/api/posts/${id.value}`, {
    method: 'PATCH',
    body: input
  })
}

// Only runs after the schema validates. `event.data` is the parsed
// output, so title and body are already trimmed.
const handleSubmit = async (event: FormSubmitEvent<UpdatePostSchema>) => {
  if (isSubmitting.value || !post.value) return

  // The API only needs the fields that actually changed, and rejects
  // an empty payload, so build the diff here.
  const changes: Partial<UpdatePostSchema> = {}

  if (event.data.title !== post.value.title) {
    changes.title = event.data.title
  }
  if (event.data.body !== post.value.body) {
    changes.body = event.data.body
  }

  if (Object.keys(changes).length === 0) {
    toast.add({
      title: 'No changes',
      description: 'You haven\'t changed anything.',
      icon: 'i-lucide-info',
      color: 'info'
    })
    return
  }

  isSubmitting.value = true

  try {
    await updatePost(changes)

    toast.add({
      title: 'Success',
      description: 'Post updated.',
      icon: 'i-lucide-circle-check-big',
      color: 'success'
    })

    await navigateTo(`/posts/${id.value}`, { replace: true })
  } catch (err) {
    const message = (err as { data?: { message?: string } }).data?.message

    toast.add({
      title: 'Error',
      description: message ?? 'Unable to update post.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
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
      <!-- Loading
      Todo: Make form skeleton.
      -->
      <div
        v-if="isLoading"
        class="flex justify-center py-20"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="size-8 animate-spin text-primary"
        />
      </div>

      <!-- Not found -->
      <UAlert
        v-else-if="isNotFound"
        class="mx-auto max-w-150 shadow-lg ring-error"
        color="error"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        title="Error!"
        description="Resource not found. This post doesn't exist or may have been deleted."
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
            label: 'Posts',
            color: 'error',
            class:
              'font-semibold border border-[rgba(0,0,0,0.25)] uppercase shadow hover:shadow-none',
            icon: 'i-lucide-arrow-left',
            onClick: () => navigateTo(`/posts`)
          }
        ]"
        orientation="horizontal"
      />

      <!-- Other fetch error -->

      <UAlert
        v-else-if="error"
        class="mx-auto max-w-150 shadow-lg ring-error"
        color="error"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        title="Error!"
        description="Unable to load resource."
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

      <!--
      Not The Owner

      The user could be malicious, but this could also be an honest mistake.

      The API check only fires on submit, and your PATCH handler returns a 404 “Post not found”
      when the user doesn’t own the post. Without the guard, a non-owner who navigates to the URL
      manually would fill out the form, hit Save, and get a confusing “Post not found” for a post
      they can see. The alert tells them up front, so they don’t spend time on a form that can’t work.
      This is a UX guard, not security, and the API check is still what actually protects the data.
      -->

      <UAlert
        v-else-if="post && !isOwner"
        class="mx-auto max-w-150 shadow-lg ring-error"
        color="error"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        title="Error!"
        description="Only the author can make changes to this post."
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
            label: 'View Post',
            color: 'error',
            class:
              'font-semibold border border-[rgba(0,0,0,0.25)] uppercase shadow hover:shadow-none',
            icon: 'i-lucide-arrow-left',
            onClick: () => navigateTo(`/posts/${id}`)
          }
        ]"
        orientation="horizontal"
      />

      <!-- Update form -->
      <section
        v-else-if="post"
        class="mx-auto max-w-250 rounded-xl border bg-card p-6 shadow-sm"
      >
        <h1 class="mb-0 text-center text-2xl font-bold text-primary">
          <UIcon
            name="i-lucide-file-pen"
            class="inline size-[1em] text-primary"
          />
          Update Post
        </h1>

        <!-- Default: :validate-on="['blur', 'change', 'input']" -->
        <UForm
          :schema="updatePostSchema"
          :state="state"
          :disabled="isSubmitting"
          class="space-y-6"

          @submit="handleSubmit"
          @error="handleError"
        >
          <UFormField
            label="Title"
            name="title"
            required
            :eager-validation="hasAttemptedSubmit"
          >
            <UInput
              v-model="state.title"
              placeholder="Give your post a title"
              class="
                w-full
                [&_input]:bg-card-accented
              "
            />
          </UFormField>

          <UFormField
            label="Body"
            name="body"
            required
            :eager-validation="hasAttemptedSubmit"
          >
            <UTextarea
              v-model="state.body"
              placeholder="Write something..."
              :rows="8"
              autoresize
              class="
                w-full
                [&_textarea]:bg-card-accented
              "
            />
          </UFormField>

          <div class="flex justify-end gap-2">
            <UButton
              :to="`/posts/${id}`"
              label="Cancel"
              color="neutral"
              variant="ghost"
            />
            <UButton
              type="submit"
              label="Save Changes"
              icon="i-lucide-save"
              :loading="isSubmitting"
            />
          </div>
        </UForm>
      </section>
    </PageContainer>
  </Page>
</template>
