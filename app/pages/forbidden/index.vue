<script setup lang="ts">
/* ======================
       Composables
====================== */

const title = 'Forbidden'
const description = 'The Forbidden Page'

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
      <h1 class="mb-6 text-center text-4xl font-bold text-error">
        Forbidden
      </h1>
    </PageContainer>
  </Page>
</template>
