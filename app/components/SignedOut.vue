<script setup lang="ts">
/* ======================
       Composables
====================== */

const { data: sessionData } = await authClient.useSession(useFetch)
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <slot v-if="!sessionData" />
</template>
