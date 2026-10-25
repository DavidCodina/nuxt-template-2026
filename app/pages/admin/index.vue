<script setup lang="ts">
/* ======================
       Composables
====================== */

const title = 'Admin Page'
const description = 'The Admin Page'

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
        Admin
      </h1>
    </PageContainer>
  </Page>
</template>
