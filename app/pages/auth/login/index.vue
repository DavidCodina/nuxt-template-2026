<script setup lang="ts">
/* ======================
        Imports
====================== */

import * as z from 'zod'
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'

/* ======================
      Composables
====================== */

const title = 'Login Page'
const description = 'The Login Page'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description

})

const route = useRoute()
const toast = useToast()

/* ======================
       Variables
====================== */

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'you@example.com',
    required: true,
    defaultValue: ''

  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    required: true,
    defaultValue: ''
  }
]

const schema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

/* ======================
        Types
====================== */

type Schema = z.output<typeof schema>

/* ======================
        Refs
====================== */

const loading = ref(false)

/* ======================
      Macros
====================== */

definePageMeta({
  path: '/login'
})

/* ======================
       computed
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Resolve the post-login redirect from the `?redirect=` query param.
//
// Only same-site paths are allowed (a single leading "/"). Anything else
// falls back to '/user'. This prevents an open redirect vulnerability:
// an attacker could craft a link like
// `/login?redirect=https://evil.com` that starts on our real domain, then
// sends the user to a phishing site after they log in.
//
// Rejected values:
//   - 'https://evil.com' (absolute URL, doesn't start with "/")
//   - '//evil.com'       (protocol-relative URL, browsers treat it as external)
//   - '/\evil.com'       (some browsers normalize "\" to "/", making it "//")
//
// Note: Nuxt's `navigateTo` already refuses external URLs unless
// `{ external: true }` is passed, but we validate here anyway so the
// protection doesn't silently disappear if the navigation code changes.
//
///////////////////////////////////////////////////////////////////////////

const redirectPath = computed(() => {
  const redirect = route.query.redirect

  return typeof redirect === 'string'
    && redirect.startsWith('/')
    && !redirect.startsWith('//')
    && !redirect.startsWith('/\\')
    ? redirect
    : '/user'
})

/* ======================
      Functions
====================== */

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true

  try {
    // await sleep(2500)

    ///////////////////////////////////////////////////////////////////////////
    //
    // ⚠️ Better Auth’s client is built on better-fetch, which by default
    // doesn’t throw on HTTP errors. It can still throw in a few cases:
    //
    //   - Network-level failures.
    //   - throw: true is set.
    //   - Your own callbacks throw.
    //
    // So definitely still wrap in a try/catch. The same goes for signOut.
    //
    ///////////////////////////////////////////////////////////////////////////

    const { data: _loginData, error: loginError } = await authClient.signIn.email(
      {
        email: event.data.email,
        password: event.data.password

        // callbackURL: '/user'
      // # This is an interesting feature.
      // # rememberMe determines if the user remains logged in after they close the website
      // # Test it out, and decide whether you want it to be true | false.
      // # Also test cross-tab compatibility.
      // See Coding In Flow tutorial at 24:15: https://www.youtube.com/watch?v=w5Emwt3nuV0&t=15s
      // rememberMe: false
      },

      {
      ///////////////////////////////////////////////////////////////////////////
      //
      // Can be used for setting loading states if one wasn't using a transition.
      //
      //   onRequest: (ctx) => {},
      //
      //   onResponse: (ctx) => {},
      //
      //   onSuccess: (ctx) => {
      //     const { data, request, response } = ctx
      //   },
      //
      //   onError: (ctx) => {
      //     const { error, request, response } = ctx
      //     const { message } = error
      //   }
      //
      ///////////////////////////////////////////////////////////////////////////
      }

    )

    ///////////////////////////////////////////////////////////////////////////
    //
    // Example data when error is null:
    //
    //   {
    //     redirect: false,
    //     token: "2fhmlwbflI5kbIOdpXg9BYqcqEaHti8Y",
    //     user: {
    //       id: "20092aaa-8a62-4086-b560-369cd25e740e",
    //       name: "David Codina",
    //       email: "david@example.com",
    //       emailVerified: false
    //       image: null,
    //       createdAt: Thu Oct 15 2026 15:48:09 GMT-0600 (Mountain Daylight Time) {}
    //       updatedAt: Thu Oct 15 2026 15:48:09 GMT-0600 (Mountain Daylight Time) {}
    //     }
    //   }
    //
    // Example error when data is null:
    //
    //   {
    //     code:  "INVALID_EMAIL_OR_PASSWORD",
    //     message:  "Invalid email or password",
    //     status: 401
    //     statusText: "UNAUTHORIZED"
    //   }
    //
    ///////////////////////////////////////////////////////////////////////////

    if (loginError) {
      toast.add({
        title: 'Login Error',
        description: `Invalid email or password.`,
        icon: 'i-lucide-triangle-alert',
        color: 'error'
      })
    } else {
      toast.add({
        title: 'Login Success',
        description: `You're in!`,
        icon: 'i-lucide-circle-check-big',
        color: 'success'
      })

      ///////////////////////////////////////////////////////////////////////////
      //
      // Always await or return it. navigateTo returns a promise, and awaiting it ensures the
      // navigation finishes  (and matters a lot in middleware and SSR, where it issues a redirect).
      // This rule is less true for router.push('/user') because router.push is client-side only.
      // It returns a promise that resolves after navigation finishes (or fails), but there’s
      // no server redirect that depends on it. So if you fire it and don’t await, the navigation
      // still happens. In your login handler, router.push('/user') as the last statement works
      // fine without await.
      //
      // navigateTo is different because it can run during SSR or in middleware, where it doesn’t
      // navigate directly but returns a redirect instruction. There, you must return navigateTo(...)
      // (or await it) or the redirect is silently lost.
      //
      // Actually that's a bit too alarmist.
      //
      //   - Where the footgun is real: navigateTo only bites you in
      //     route middleware (and plugins or setup code that runs during SSR). There, forgetting to
      //     return it means the redirect silently doesn’t happen. That’s the one place it’s easy to get wrong.
      //
      //   - Where it isn’t: in a click or submit handler like your login flow, navigateTo('/user') behaves
      //     like router.push('/user'). You can await it or not, and it works either way. The footgun doesn’t apply.
      //
      ///////////////////////////////////////////////////////////////////////////

      // https://nuxt.com/docs/4.x/api/utils/refresh-nuxt-data
      await refreshNuxtData()
      await navigateTo(redirectPath.value, { replace: true })
    }
  } catch (_err) {
    toast.add({
      title: 'Login Error',
      description: `Unable to log in.`,
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <Page>
    <PageContainer>
      <UAuthForm
        :schema="schema"
        :fields="fields"
        :loading="loading"
        :submit="{
          label: 'Sign in',
          color: 'primary',
          variant: 'solid',
          size: 'md',
          block: true,
          icon: 'i-lucide-log-in',
          class: 'font-semibold'

        }"
        title="Welcome Back"
        description="Sign in to your account to continue."
        icon="i-lucide-lock"
        :ui="{
          root: 'mx-auto max-w-150 rounded-xl border bg-card p-6 shadow-sm',
          header: 'text-primary',
          leading: '',
          leadingIcon: '',
          title: 'text-primary',
          description: '',
          body: '',
          providers: '',
          checkbox: '',
          select: '',
          password: '[&_input]:bg-card-accented',
          otp: '',
          input: '[&_input]:bg-card-accented',
          separator: '',
          form: '',
          footer: '-mt-4 leading-none'
        }"
        @submit="onSubmit"
      >
        <template #footer>
          Don't have an account?
          <ULink
            to="/register"
            class="
              font-medium text-primary
              hover:text-primary hover:underline
            "
          >Sign Up</ULink>
        </template>
      </UAuthForm>
    </PageContainer>
  </Page>
</template>
