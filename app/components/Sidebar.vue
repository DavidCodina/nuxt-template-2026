<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const open = defineModel<boolean>('open', { default: true })

const items: NavigationMenuItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Test', to: '/test' }
]
</script>

<!-- ======================================================================

======================================================================= -->
<!-- Other props:
    description="A Nuxt UI template for building production-ready applications."
-->

<template>
  <USidebar
    v-model:open="open"
    title="DaveTek Industries"

    :ui="{
      container: `
        z-100 bg-white
        dark:bg-slate-900
      `,
      inner: '',
      body: '',
      header: 'min-h-auto px-1',
      // close: ''
      actions: 'gap-0',
      title: 'text-primary'

    }"
  >
    <template #actions>
      <UColorModeButton />
      <UButton
        icon="i-lucide-panel-left-close"
        color="neutral"
        variant="ghost"
        class="cursor-pointer"
        aria-label="Close sidebar"
        @click="open = false"
      />
    </template>

    <UNavigationMenu
      :items="items"
      orientation="vertical"
    />
  </USidebar>
</template>
