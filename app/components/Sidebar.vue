<script setup lang="ts">
/* ======================
      Imports
====================== */

import type { NavigationMenuItem } from '@nuxt/ui'

/* ======================
       Composables
====================== */

const router = useRouter()
const route = useRoute()

// https://better-auth.com/docs/integrations/nuxt#use-the-session
const { data: sessionData, error: _sessionError, isPending: _sessionIsPending } = await authClient.useSession(useFetch)

const toast = useToast()

/* ======================
        Variables
====================== */

const items = computed(() => {
  let navItems: NavigationMenuItem[] = []

  if (!sessionData.value) {
    navItems = [
      { label: 'Home', to: '/' },
      { label: 'Test', to: '/test' },
      { label: 'Posts', to: '/posts' },
      { label: 'Log In', to: '/login' },
      { label: 'Register', to: '/register' }

    ]
  } else {
    navItems = [
      { label: 'Home', to: '/' },
      { label: 'Test', to: '/test' },
      { label: 'Posts', to: '/posts' },
      { label: 'User', to: '/user' }
    ]
  }
  return navItems
})

/* ======================
        Macros
====================== */

const open = defineModel<boolean>('open', { default: true })

/* ======================
       Functions
====================== */

const handleLogout = async () => {
  try {
    const {
      data: logoutData, // { success: true }
      error: logoutError
    } = await authClient.signOut()

    if (logoutError) {
      toast.add({
        title: 'Log Out Error',
        description: `Unable to log out.`,
        icon: 'i-lucide-triangle-alert',
        color: 'error'
      })
    } else if (logoutData && logoutData.success === true) {
      toast.add({
        title: 'Log Out Success',
        description: `See you later!`,
        icon: 'i-lucide-circle-check-big',
        color: 'success'
      })

      ///////////////////////////////////////////////////////////////////////
      //
      // You could ALWAYS navigate to /login.
      //
      //   await navigateTo('/login')
      //
      // But what if the user is on a public page? Sometimes it's better UX to only
      // navigate away if the page the user was on is protected. In order to make
      // that happen, we can force the app/middleware/auth.global.ts to rerun.
      //
      // Why refreshNuxtData()? See app/middleware/auth.global.ts for an explanation.
      // There's a race condition between Better Auth and the navigation here.
      //
      ///////////////////////////////////////////////////////////////////////

      // https://nuxt.com/docs/4.x/api/utils/refresh-nuxt-data
      await refreshNuxtData()

      await router.replace({
        path: route.path,
        query: { ...route.query, logout: 'true' },
        hash: route.hash,
        force: true
      })
    }
  } catch (_err) {
    toast.add({
      title: 'Log Out Error',
      description: `Unable to log out..`,
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  }
}
</script>

<!-- ======================================================================

======================================================================= -->
<!-- Other props:
    description="A Nuxt UI template for building production-ready applications."
-->

<template>
  <USidebar
    v-model:open="open"
    title="DaveTek"

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
      <UButton
        v-if="sessionData"
        icon="i-lucide-log-out"
        color="neutral"
        variant="ghost"
        class="cursor-pointer"
        aria-label="Log Out"
        title="Log Out"
        @click="handleLogout"
      />
      <UColorModeButton />
      <UButton
        icon="i-lucide-panel-left-close"
        color="neutral"
        variant="ghost"
        class="cursor-pointer"
        aria-label="Close sidebar"
        title="Close sidebar"
        @click="open = false"
      />
    </template>

    <UNavigationMenu
      :items="items"
      orientation="vertical"
    />
  </USidebar>
</template>
