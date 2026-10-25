<script setup lang="ts">
/* ======================
       Composables
====================== */

const { data: sessionData } = await authClient.useSession(useFetch)

/* ======================
       Computed
====================== */

const isAdmin = computed(() => sessionData?.value?.user?.role === 'ADMIN')
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <slot v-if="isAdmin" />
</template>
