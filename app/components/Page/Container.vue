<script setup lang="ts">
/* ======================
        Imports
====================== */
///////////////////////////////////////////////////////////////////////////
//
// No need to import cn() explicitly.
// import { cn } from '@/utils/cn'
//
// Similarly, when this component is used we also don't need to import it
//
//   import Container from '@/components/Page/Container.vue'
//
// Because it's nested in /components/Page/Container.vue,
// we can automatically import it as PageContainer.
//
// However, there's also the option to do this.
//
//   import { Container } from '#components'
//
///////////////////////////////////////////////////////////////////////////
import type { HTMLAttributes } from 'vue'

/* ======================
      Props / Emits
====================== */

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div
    data-slot="page-container"
    :class="cn(`
      relative mx-auto w-full flex-1 overflow-x-auto p-6
      2xl:container
    `, props.class)"
  >
    <slot />
  </div>
</template>
