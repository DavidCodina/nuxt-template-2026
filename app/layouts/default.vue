<script setup>
///////////////////////////////////////////////////////////////////////////
//
// The default.vue can be consumed in app.vue simply by wrapping NuxtPage in NuxtLayout.
//
//   <template>
//     <UApp>
//       <NuxtLayout>
//         <NuxtPage />
//       </NuxtLayout>
//     </UApp>
//   </template>
//
// If you ever want to keep this file, but disable it's usage you can
// do this in nuxt.config.ts:
//
//    ignore: ['app/layouts/default.vue'],
//
// And, in fact, that's what we're currently doing.
// However, let's say we create a layouts/test.vue and want to use that in
// the /test page. This can be achieved by doing this in that page:
//
//   definePageMeta({
//     layout: 'test'
//   })
//
// If default.vue were still active, the definePageMeta configuration would
// replace it entirely.
//
///////////////////////////////////////////////////////////////////////////
</script>

<!-- =======================================================================

======================================================================= -->
<!-- eslint-disable vue/no-multiple-template-root -->

<template>
  <slot />
</template>
