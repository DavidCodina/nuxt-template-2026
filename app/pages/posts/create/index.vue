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

// Mirrors the server's createPostSchema so client and API agree.
const createPostSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  body: z.string().trim().min(1, 'Body is required')
})

/* ======================
        Types
====================== */

type Post = typeof PostTable.$inferSelect

type CreatePostSchema = z.output<typeof createPostSchema>

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

const toast = useToast()

/* ======================
        Functions
====================== */

const handleError = () => {
  hasAttemptedSubmit.value = true
}

const createPost = (input: CreatePostSchema) => {
  return $fetch<Post>('/api/posts', {
    method: 'POST',
    body: input
  })
}

// Only runs after the schema validates. `event.data` is the parsed
// output, so title and body are already trimmed.
const handleSubmit = async (event: FormSubmitEvent<CreatePostSchema>) => {
  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    const newPost = await createPost(event.data)

    toast.add({
      title: 'Success',
      description: 'Post created.',
      icon: 'i-lucide-circle-check-big',
      color: 'success'
    })

    await navigateTo(`/posts/${newPost.id}`)
  } catch (err) {
    const message = (err as { data?: { message?: string } }).data?.message

    toast.add({
      title: 'Error',
      description: message ?? 'Unable to create post.',
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
      <section
        class="mx-auto max-w-250 rounded-xl border bg-card p-6 shadow-sm"
      >
        <h1 class="mb-0 text-center text-2xl font-bold text-primary">
          <UIcon
            name="i-lucide-file-text"
            class="inline size-[1em] text-primary"
          />
          Create A Post
        </h1>

        <!-- Default: :validate-on="['blur', 'change', 'input']" -->
        <UForm
          :schema="createPostSchema"
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
              to="/posts"
              label="Cancel"
              color="neutral"
              variant="ghost"
            />
            <UButton
              type="submit"
              label="Create Post"
              icon="i-lucide-send"
              :loading="isSubmitting"
            />
          </div>
        </UForm>
      </section>
    </PageContainer>
  </Page>
</template>
