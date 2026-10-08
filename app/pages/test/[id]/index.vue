<script setup lang="ts">
const route = useRoute()
const id = route.params.id
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <Page>
    <PageContainer>
      <h1 class="text-center text-2xl font-bold text-primary">
        <!-- Here one can also use $route.params.id -->
        Test ID: {{ id }}
      </h1>
    </PageContainer>
  </Page>
</template>
