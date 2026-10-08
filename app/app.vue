<script setup lang="ts">
/* ======================
      Variables
====================== */

const toaster = { position: 'top-right' as const }

/* ======================
        State
====================== */

const open = ref(false)

/* ======================
    Composables
====================== */

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Nuxt Starter Template'
const description = 'A production-ready starter template powered by Nuxt UI. Build beautiful, accessible, and performant applications in minutes, not hours.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image'
})
</script>

<!-- =======================================================================

======================================================================= -->

<template>
  <!--
  https://ui.nuxt.com/docs/getting-started/installation/vue#wrap-your-app-with-app-component
  The App component sets up global config and is required for Toast, Tooltip and programmatic overlays.
  See here for more info: https://ui.nuxt.com/docs/components/app

  No import needed — Nuxt UI auto-imports all its components, including UApp, via unplugin-vue-components.
  That's the same mechanism mentioned in the install docs when they talked about the generated components.d.ts type declaration file.
  -->
  <UApp :toaster="toaster">
    <!-- We could add this to layouts/default.vue However, that means that
    any time we swap out the layout in a particular page, then the sibebar
    would not be there: definePageMeta({ layout: 'test' }). Nuxt may have
    a way for stacking layouts rather than entirely replacing them, but for
    now this is the easiest solution. -->
    <Sidebar v-model:open="open" />
    <UButton
      icon="i-lucide-panel-left-open"
      color="neutral"
      variant="ghost"
      class="absolute top-2 left-2 z-99 cursor-pointer"
      aria-label="Close sidebar"
      @click="open = true"
    />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
