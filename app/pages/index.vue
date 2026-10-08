<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="
            -ms-1 rounded-md p-1 outline-primary/25
            focus-visible:outline-3
          "
        >
          <AppLogo class="h-6 w-auto shrink-0" />
        </NuxtLink>

        <TemplateMenu />
      </template>

      <template #right>
        <!-- ====================
            UColorModeButton
        ===================== -->
        <!-- This seems pretty magical. See here: https://ui.nuxt.com/docs/components/color-mode-button
        is a thin wrapper. The "magic" lives in @nuxtjs/color-mode, a Nuxt module that Nuxt UI installs
        for you automatically. Here's the chain.

        The pieces:

          1. The module (@nuxtjs/color-mode) is registered by Nuxt UI, so you never add it to nuxt.config.ts yourself. It does three things:

            - Injects a tiny inline script into the <head> that runs before your app renders. It reads the saved preference (from localStorage)
              or falls back to the OS setting, then sets a class on <html>, i.e. class="dark" or class="light". This is what prevents the flash
              of the wrong theme on page load.

            - Provides a composable, useColorMode(), that exposes the reactive state.
            - Persists the choice to localStorage under the key nuxt-color-mode.

          2. The state is a single reactive object, shared app-wide via Nuxt's useState-style mechanism. It has two fields:

            - colorMode.preference: what the user chose: 'light', 'dark', 'system'
            - colorMode.value: what's actually applied: only 'light' or 'dark' (if preference is 'system',
              this resolves from the OS via prefers-color-scheme)

          3. The button is roughly this:

            <script setup>
              const colorMode = useColorMode()
              const isDark = computed({
                get: () => colorMode.value === 'dark',
                set: (v) => { colorMode.preference = v ? 'dark' : 'light' }
              })
            </script>

            <template>
              <UButton
                :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
                color="neutral"
                variant="ghost"
                @click="isDark = !isDark"
              />
            </template>

            It reads the shared state to pick an icon, and clicking writes to preference. No props or wiring from you,
            because it calls useColorMode() itself and that state is global.
        -->

        <UColorModeButton />

        <!-- ====================

        ===================== -->

        <UButton
          to="https://github.com/nuxt-ui-templates/starter"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UHeader>

    <UMain>
      <UPageHero
        title="Nuxt Starter Template"
        description="A production-ready starter template powered by Nuxt UI.
        Build beautiful, accessible, and performant applications in minutes, not hours."
        :links="[{
          label: 'Get started',
          to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
          target: '_blank',
          trailingIcon: 'i-lucide-arrow-right',
          size: 'xl'
        }, {
          label: 'Use this template',
          to: 'https://github.com/nuxt-ui-templates/starter',
          target: '_blank',
          icon: 'i-simple-icons-github',
          size: 'xl',
          color: 'neutral',
          variant: 'subtle'
        }]"
      />

      <UPageSection
        id="features"
        title="Everything you need to build modern Nuxt apps"
        description="Start with a solid foundation. This template includes all the essentials forbuilding production-ready applications with Nuxt UI's powerful component system."
        :features="[{
          icon: 'i-lucide-rocket',
          title: 'Production-ready from day one',
          description: 'Pre-configured with TypeScript, ESLint, Tailwind CSS, and all the best practices. Focus on building features, not setting up tooling.'
        }, {
          icon: 'i-lucide-palette',
          title: 'Beautiful by default',
          description: 'Leveraging Nuxt UI\'s design system with automatic dark mode, consistent spacing, and polished components that look great out of the box.'
        }, {
          icon: 'i-lucide-zap',
          title: 'Lightning fast',
          description: 'Optimized for performance with SSR/SSG support, automatic code splitting, and edge-ready deployment. Your users will love the speed.'
        }, {
          icon: 'i-lucide-blocks',
          title: '100+ components included',
          description: 'Access Nuxt UI\'s comprehensive component library. From forms to navigation, everything is accessible, responsive, and customizable.'
        }, {
          icon: 'i-lucide-code-2',
          title: 'Developer experience first',
          description: 'Auto-imports, hot module replacement, and TypeScript support. Write less boilerplate and ship more features.'
        }, {
          icon: 'i-lucide-shield-check',
          title: 'Built for scale',
          description: 'Enterprise-ready architecture with proper error handling, SEO optimization, and security best practices built-in.'
        }]"
      />

      <UPageSection>
        <UPageCTA
          title="Ready to build your next Nuxt app?"
          description="Join thousands of developers building with Nuxt and Nuxt UI. Get this template and start shipping today."
          variant="subtle"
          :links="[{
            label: 'Start building',
            to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
            target: '_blank',
            trailingIcon: 'i-lucide-arrow-right',
            color: 'neutral'
          }, {
            label: 'View on GitHub',
            to: 'https://github.com/nuxt-ui-templates/starter',
            target: '_blank',
            icon: 'i-simple-icons-github',
            color: 'neutral',
            variant: 'outline'
          }]"
        />
      </UPageSection>
    </UMain>

    <!-- ====================

    ===================== -->

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <!-- ====================
            Footer
    ===================== -->

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built with Nuxt UI • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          to="https://github.com/nuxt-ui-templates/starter"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </div>
</template>
