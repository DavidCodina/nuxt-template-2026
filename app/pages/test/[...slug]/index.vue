<script setup lang="ts">
const route = useRoute()

const _slug = computed(() => route.params.slug as string[])
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <Page>
    <PageContainer>
      <h1 class="text-center text-2xl font-bold text-primary">
        <!-- Test Slug: {{ slug.join('/') }} -->
        <!-- <span
          v-for="(part, i) in slug"
          :key="i"
        >
          {{ part }}<span v-if="i < slug.length - 1"> / </span>
        </span> -->

        Test Slug: {{ ($route.params.slug as string[]).join('/') }}
      </h1>
    </PageContainer>
  </Page>
</template>
