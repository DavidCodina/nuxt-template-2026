<script setup lang="ts">
/* ======================
        Imports
====================== */

import * as z from 'zod'
import type {
  AuthFormField,
  // FormError,
  FormSubmitEvent
} from '@nuxt/ui'

/* ======================
      Template  Refs
====================== */

const authForm = useTemplateRef('authForm')

/* ======================
       Variables
====================== */

const fields: AuthFormField[] = [
  {
    name: 'name',
    type: 'text',
    label: 'Name',
    placeholder: 'Enter your name',
    autocomplete: 'name',
    required: true,
    defaultValue: ''
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    autocomplete: 'email',
    required: true,
    defaultValue: ''
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Create a password',
    autocomplete: 'new-password',
    required: true,
    defaultValue: ''
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirm password',
    placeholder: 'Re-enter your password',
    autocomplete: 'new-password',
    required: true,
    defaultValue: ''
  }
]

const schema = z
  .object({
    name: z.string('Name is required').min(2, 'Must be at least 2 characters'),
    email: z.email('Invalid email'),
    password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string('Please confirm your password').min(8, 'Must be at least 8 characters')

      .refine((value) => {
        if (authForm.value && authForm.value.state) {
          const statePassword: string = authForm.value.state.password
          return statePassword === value
        }
        return true
      }, {
        error: 'Passwords do not match'
      })
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
      Composables
====================== */

const title = 'Registration Page'
const description = 'Registration Page'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

const toast = useToast()

/* ======================
        Macros
====================== */

definePageMeta({
  path: '/register'
})

/* ======================
      Functions
====================== */

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true

  try {
    ///////////////////////////////////////////////////////////////////////////
    //
    // ⚠️ Better Auth’s client is built on better-fetch, which by default
    // doesn’t throw on HTTP errors. It can still throw in a few cases:
    //
    //   - Network-level failures.
    //   - throw: true is set.
    //   - Your own callbacks throw.
    //
    // So definitely still wrap in a try/catch.
    //
    ///////////////////////////////////////////////////////////////////////////

    // This will create one record in users and one record in accounts.
    // If you submit a email that already exists, Better Auth will send back its's
    // standard success data, but internally will not create a new user. This is to
    // prevent a malicious user from inferring the presence of an existing user.
    const { data: _signUpData, error: signUpError } = await authClient.signUp.email({
      name: event.data.name,
      email: event.data.email,
      password: event.data.password,
      // I believe that this callback URL is only used when email verification is enabled.
      callbackURL: '/login?verified=true'
    })

    ///////////////////////////////////////////////////////////////////////////
    //
    // Example data when error is null:
    //
    //   {
    //     token: null,
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
    // Example error when data is null. In this case, I set Zod password/confirmPassword
    // to only need to be seven characters long. However, Better Auth itself has a default
    // password length requirement of 8 characters.
    //
    //   {
    //     code: "PASSWORD_TOO_SHORT",
    //     message: "Password too short",
    //     status: 400,
    //     statusText: "BAD_REQUEST"
    //   }
    //
    ///////////////////////////////////////////////////////////////////////////

    if (signUpError) {
      toast.add({
        title: 'Sign Up Error',
        description: `Unable to sign up.`,
        icon: 'i-lucide-triangle-alert',
        color: 'error'
      })
    } else {
      toast.add({
        title: 'Sign Up Success',
        description: `You're signed up!`,
        icon: 'i-lucide-circle-check-big',
        color: 'success'
      })

      await navigateTo('/login', { replace: true })
    }
  } catch (_err) {
    toast.add({
      title: 'Sign Up Error',
      description: `Unable to sign up.`,
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

/* ======================
        Watchers
====================== */
// The .refine() on confirmPassword only works when confirmPassword changes.
// Watch password to also trigger confirmPassword on password change.

watch(() => authForm.value?.state.password, async () => {
  // Only re-validate once the user has typed something in confirmPassword.
  // Otherwise editing password first would flag an empty confirm field.
  if (authForm.value?.state.confirmPassword) {
    try {
      ///////////////////////////////////////////////////////////////////////////
      //
      // Note: validate() returns a promise that rejects with a FormValidationException when validation fails.
      // Nuxt then reports it as an unhandled promise rejection.
      // The form’s own submit handler catches this internally, which is why you don’t see it there.
      // In this case, we need to catch it manually.
      //
      // formRef is not actually a reference to HTMLFormElement. It's an API.
      //
      ///////////////////////////////////////////////////////////////////////////

      const _validationResult = await authForm.value.formRef?.validate({ name: 'confirmPassword' })
    } catch {
      // Validation failed: the error is already displayed on the field
    }
  }
})
</script>

<!-- =======================================================================

======================================================================= -->

<template>
  <Page>
    <PageContainer>
      <UAuthForm
        ref="authForm"
        :schema="schema"
        :fields="fields"
        :loading="loading"
        :submit="{
          label: 'Create Account',
          color: 'primary',
          variant: 'solid',
          size: 'md',
          block: true,
          icon: 'i-lucide-user-plus',
          class: 'font-semibold'
        }"
        title="Create An Account"
        description="Sign up to get started."
        icon="i-lucide-user-plus"
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
          password: `[&_input]:bg-card-accented`,
          otp: '',
          input: `[&_input]:bg-card-accented`,
          separator: '',
          form: '',
          footer: '-mt-4 leading-none'
        }"
        @submit="onSubmit"
      >
        <template #footer>
          Already have an account?
          <ULink
            to="/login"
            class="
              font-medium text-primary
              hover:text-primary hover:underline
            "
          >Sign in</ULink>
        </template>
      </UAuthForm>
    </PageContainer>
  </Page>
</template>
