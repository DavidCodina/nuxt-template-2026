<script setup lang="ts">
const { ownerId } = defineProps<{ ownerId: string }>()

/* ======================
       Composables
====================== */

const {
  data: sessionData,
  error: _sessionError,
  isPending: _sessionIsPending
} = await authClient.useSession(useFetch)

/* ======================
        Computed
====================== */

const isOwner = computed(() => {
  const sessionUserId = sessionData.value?.user.id
  // Both must exist, otherwise two undefined values would count as a match
  return !!sessionUserId && !!ownerId && sessionUserId === ownerId
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <slot v-if="isOwner" />
</template>
