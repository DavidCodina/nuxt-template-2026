<script setup lang="ts">
/* ======================
       Composables
====================== */

const toast = useToast()

/* ======================
        State
====================== */

const pending = ref(false)

/* ======================
         Functions
====================== */

const handleDeleteUser = async (e: MouseEvent) => {
  e.preventDefault()

  const confirmed = window.confirm(
    'Are you sure you want to delete your account? This action cannot be undone.'
  )
  if (!confirmed) {
    return
  }

  pending.value = true

  try {
    // https://better-auth.com/docs/concepts/users-accounts#delete-user
    // In auth.ts, this must be set:
    // user: { deleteUser: { enabled: true } }
    const { data, error } = await authClient.deleteUser({
      // callbackURL is only used when sendDeleteAccountVerification is implemented in auth.ts
      // In such cases, there's no need for the commented-out navigate() logic below.
      // The account_deleted=true search param can be used within the '/register' page on
      // mount (i.e., useEffect) to trigger a toast notification to inform the user of success
      // and remind them to close all other tabs/windows.
      // callbackURL: '/register?account_deleted=true'
    })

    if (error) {
      // If you try to call authClient.deleteUser() when there's no authenticated user:
      // { message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401, statusText: 'UNAUTHORIZED' }

      toast.add({
        title: 'Error',
        description: `Unable to delete account.`,
        icon: 'i-lucide-triangle-alert',
        color: 'error'
      })
      return
    }

    if (data) {
      // {success: true, message: 'User deleted'}
      toast.add({
        title: 'Success',
        description: `Account deleted.`, // Delete account verification email sent.
        icon: 'i-lucide-circle-check-big',
        color: 'success'
      })

      // No need for this logic if Better Auth is using sendDeleteAccountVerification flow.
      navigateTo({
        path: '/register',
        query: { account_deleted: 'true' }
      })
      return
    }
  } catch (_err) {
    toast.add({
      title: 'Error',
      description: `Unable to delete account.`,
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    pending.value = false
  }
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <UButton
    :loading="pending"
    icon="i-lucide-triangle-alert"
    color="error"
    label="Delete User"
    @click="handleDeleteUser"
  />
</template>
