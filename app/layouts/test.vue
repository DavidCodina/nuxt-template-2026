<script setup>
///////////////////////////////////////////////////////////////////////////
//
// The default.vue can be consumed in app.vue simply by wrapping NuxtPage in NuxtLayout.
// At present, there's really no need for this other than as a demonstration.
//
//   <template>
//     <UApp>
//       <NuxtLayout>
//         <NuxtPage />
//       </NuxtLayout>
//     </UApp>
//   </template>
//
// However, let's say we're in another page and we want to use a different layout.
// Then we can use define
//
///////////////////////////////////////////////////////////////////////////
</script>

<!-- =======================================================================

======================================================================= -->

<template>
  <div
    :class="[
      `
        relative flex min-h-dvh w-full max-w-full flex-1 flex-col
        overflow-hidden
      `
      // 'outline-4 outline-dashed outline-lime-500 -outline-offset-4'
    ]"
  >
    <slot />
  </div>
</template>
