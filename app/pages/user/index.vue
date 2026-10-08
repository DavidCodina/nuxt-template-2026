<script setup lang="ts">
// Todo: Add delete account feature
// https://better-auth.com/docs/integrations/nuxt#protect-pages
// But ultimately, create private unless public middleware.

import SessionData from './-components/SessionData/index.vue'

/* ======================
       Composables
====================== */

const title = 'User Page'
const description = 'The User Page'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <Page>
    <PageContainer>
      <h1 class="mb-12 text-center text-2xl font-bold text-primary">
        User
      </h1>

      <!-- Todo:
      <div class="flex justify-center gap-2">
        <UButton
          class="min-w-30 justify-center font-semibold"
          color="error"
        >
          Delete Account
        </UButton>
      </div>
      -->

      <DeleteUserButton class="mx-auto mb-6 flex" />
      <SessionData />
    </PageContainer>
  </Page>
</template>
