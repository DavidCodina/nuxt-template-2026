<script setup lang="ts">
/* ======================
          Props
====================== */
// Alternatively, for more clarity in the consuming code,
// one could also use <Admin>...</Admin> component.

const props = defineProps<{
  admin?: boolean
}>()

/* ======================
       Composables
====================== */

const { data: sessionData } = await authClient.useSession(useFetch)

/* ======================
       Computed
====================== */

const isAuthenticated = computed(() => !!sessionData.value)

const isAdmin = computed(() => sessionData.value?.user?.role === 'ADMIN')

const canView = computed(() => {
  if (!isAuthenticated.value) return false
  if (props.admin) return isAdmin.value
  return true
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <slot v-if="canView" />
</template>
