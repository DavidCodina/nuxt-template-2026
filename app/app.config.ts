export default defineAppConfig({

  ///////////////////////////////////////////////////////////////////////////
  //
  // Note: If you want to set theme stuff, it's done in nuxt.config.ts
  //
  //   ui: { theme: { colors: [] } }
  //
  // Obviously, that's weird that it's split up across two files.
  // That’s an artifact of how Nuxt works rather than a deliberate design choice by Nuxt UI.
  //
  // Nuxt has two separate config systems:
  //
  //   - nuxt.config.ts is read at build time, by the module, to generate CSS and types.
  //   - app.config.ts is runtime, reactive config that components read while the app runs.
  //
  // The confusing part is that both places have something called colors, and they do different jobs.
  // The rule of thumb:
  //
  //   - Adding a new semantic name (like brand) means nuxt.config.ts → ui.theme.colors,
  //     so Nuxt UI generates the variants for it.
  //
  //   - Pointing a name at a palette, or overriding component styles, means app.config.ts → ui.*.
  //
  ///////////////////////////////////////////////////////////////////////////
  ui: {
    colors: {
      // This may seem redundant, but it's actually what gets the theme colors
      // in main.css to update the Nuxt UI --ui-*-* CSS color variables
      primary: 'primary',
      secondary: 'secondary',
      error: 'rose'
    },
    // https://ui.nuxt.com/docs/components/toast#theme
    toast: {
      slots: {
        root: 'bg-card dark:bg-card-accented [&_[data-slot=base]]:bg-card-accented ring-0 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.15)]',
        // Wraps title and description
        wrapper: ''
      },

      variants: {
        color: {
          primary: {
            root: 'border border-primary-500',
            base: '',
            title: 'text-primary-500 text-lg',
            description: 'text-primary-500 ',
            // Unfortunately Nuxt UI treats setting the actual
            // icon as a prop only on the toast instance.
            close: 'text-primary-500/80 hover:text-primary-500 [&_svg]:size-6',
            wrapper: '',
            icon: 'size-8 text-primary-500',
            progress: '[&_[data-slot=indicator]]:bg-primary-500'
          },

          secondary: {
            root: 'border border-secondary-500',
            base: '',
            title: 'text-secondary-500 text-lg',
            description: 'text-secondary-500 ',
            close: 'text-secondary-500/80 hover:text-secondary-500 [&_svg]:size-6',
            wrapper: '',
            icon: 'size-8 text-secondary-500',
            progress: '[&_[data-slot=indicator]]:bg-secondary-500'
          },

          info: {
            root: 'border border-info-500',
            base: '',
            title: 'text-info-500 text-lg',
            description: 'text-info-500',
            close: 'text-info-500/80 hover:text-info-500 [&_svg]:size-6',
            wrapper: '',
            icon: 'size-8 text-info-500',
            progress: '[&_[data-slot=indicator]]:bg-info-500'
          },

          warning: {
            root: 'border border-warning-500',
            base: '',
            title: 'text-warning-500 text-lg',
            description: 'text-warning-500',
            close: 'text-warning-500/80 hover:text-warning-500 [&_svg]:size-6',
            wrapper: '',
            icon: 'size-8 text-warning-500',
            progress: '[&_[data-slot=indicator]]:bg-warning-500'
          },

          neutral: {
            root: 'border border-neutral-500',
            base: '',
            title: 'text-neutral-500 text-lg',
            description: 'text-neutral-500',
            close: 'text-neutral-500/80 hover:text-neutral-500 [&_svg]:size-6',
            wrapper: '',
            icon: 'size-8 text-neutral-500',
            progress: '[&_[data-slot=indicator]]:bg-neutral-500'
          },

          error: {
            root: 'border border-error-500',
            base: '',
            title: 'text-error-500 text-lg',
            description: 'text-error-500 ',
            close: 'text-error-500/80 hover:text-error-500 [&_svg]:size-6',
            wrapper: '',
            icon: 'size-8 text-error-500',
            progress: '[&_[data-slot=indicator]]:bg-error-500'
          },
          success: {
            root: 'border border-success-500',
            base: '',
            title: 'text-success-500 text-lg',
            description: 'text-success-500',

            close: 'text-success-500/80 hover:text-success-500 [&_svg]:size-6',
            wrapper: '',
            icon: 'size-8 text-success-500',
            progress: '[&_[data-slot=indicator]]:bg-success-500'
          }
        }
      }
    }
  }
})
