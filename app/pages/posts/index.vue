<script setup lang="ts">
/* ======================
        Imports
====================== */

import PostList from './-components/PostList.vue'

/* ======================
       Composables
====================== */

const title = 'Posts Page'
const description = 'The Posts Page'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description

})

/* ======================
        Macros
====================== */

definePageMeta({ auth: false })
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <Page>
    <PageContainer>
      <PostList />
    </PageContainer>
  </Page>
</template>
