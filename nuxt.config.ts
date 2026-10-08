// DO NOT REMOVE: This is a build gate. It will immediately throw if env validation fails.
import './server/utils/env'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    // https://eslint.nuxt.com/packages/module
    '@nuxt/eslint',
    '@nuxt/ui',

    ///////////////////////////////////////////////////////////////////////////
    //
    // If you use Nuxt UI, @nuxt/fonts is already included. So no need to do
    // npx nuxt module add fonts and no need to include it here.
    //
    // ❌ '@nuxt/fonts'
    //
    // https://ui.nuxt.com/docs/getting-started/integrations/color-mode/nuxt
    // Nuxt UI automatically registers the @nuxtjs/color-mode module for you, so there's no additional setup required.
    // Same story with @nuxt/fonts.
    //
    // Nuxt UI does use @vueuse/core and @vueuse/integrations internally, but it's
    // better to explicitly install them yourself rather than relying on transitive dependencies.
    // The difference here is that we'd be importing packages from '@vueuse/core'. Conversely,
    // with @nuxt/fonts, Nuxt UI register the module internally, but we're not actually importing
    // anything anywere, so there's really no need to do an explicit install.
    //
    ///////////////////////////////////////////////////////////////////////////
    '@vueuse/nuxt/module',
    '@pinia/nuxt'
  ],

  ///////////////////////////////////////////////////////////////////////////
  //
  // Do this if you want to disable, the path prefix feature that allows
  // components like components/Page/Container.vue to be imported as PageContainer.
  //
  //   components: [ { path: '~/components', pathPrefix: false }  ],
  //
  // Note: Even just doing components: [] seems to overwrite the defualt behavior.
  // Once you define a components array, you're overriding Nuxt's default scan of ~/components
  // But really, don't do that because this feature is amazing.
  //
  // If you only wanted to disable path prefixing for part of the copmonents directory,
  // then you could do something like this:
  //
  //   components: [
  //     { path: '~/components/ui', pathPrefix: false },
  //     '~/components', // Everything else keeps the default prefixed behavior
  //   ],
  //
  // Below we're adding a custom experiments directory and telling Nuxt to watch it.
  //
  ///////////////////////////////////////////////////////////////////////////

  components: [{ path: '~/experiments', pathPrefix: true }, '~/components'],

  imports: {
    presets: [
      {
        from: 'consola',
        imports: ['consola', 'createConsola']
      }
    ]
  },

  devtools: {
    enabled: true
  },

  ///////////////////////////////////////////////////////////////////////////
  //
  // If you need to configure the <html> and <body> tags, you can do it here:
  //
  //   app: {
  //     head: {
  //       htmlAttrs: {
  //         lang: 'en',
  //         class: 'border-4 border-dashed border-pink-500'
  //       },
  //       bodyAttrs: {
  //         class: ''
  //       },
  //       title: 'My App',
  //       meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  //       link: [{ rel: 'icon', href: '/favicon.ico' }]
  //     }
  //   },
  //
  // However, App.vue is already doing this:
  //
  //   useHead({
  //     meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  //     link: [{ rel: 'icon', href: '/favicon.ico' }],
  //     htmlAttrs: {
  //       lang: 'en'
  //     }
  //   })
  //
  ///////////////////////////////////////////////////////////////////////////

  css: ['~/assets/css/main.css'],

  ui: {
    theme: {
      colors: []
    }
  },

  runtimeConfig: {
    // Server-only (never exposed to the client)
    // apiSecret: '',

    // Public: available on both server and client
    public: {
      ///////////////////////////////////////////////////////////////////////////
      //
      // Nuxt will map API_BASE_URL to NUXT_PUBLIC_API_BASE_URL.
      // Then you can use it as follows:
      //
      //   const config = useRuntimeConfig()
      //
      //   const { data } = await useFetch('/users', {
      //     baseURL: config.public.API_BASE_URL
      //   })
      //
      // That said, this is a pain, and the easier solution is to use a proxy.
      //
      ///////////////////////////////////////////////////////////////////////////
      // ❌  API_BASE_URL: 'http://localhost:5000'
    }
  },

  ignore: ['app/layouts/default.vue'],

  routeRules: {
    // Nuxt added that to the default, but you probably don't want '/' to be static.
    // ❌ '/': { prerender: true },
    '/external-api/**': { proxy: `${process.env.EXTERNAL_API || 'http://localhost:5000'}/**` }
  },

  compatibilityDate: '2026-06-30',

  ///////////////////////////////////////////////////////////////////////////
  //
  // Local `npm run build` + `npm run preview` fails with:
  //   Cannot find module '.output/server/node_modules/@libsql/darwin-arm64/index.node'
  //
  // Why: @libsql/client loads a platform-specific native binary (index.node)
  // through a dynamic require, which Nitro's file tracer can't follow. Nitro
  // copies the package folder into .output/server/node_modules but leaves out
  // the binary itself, so the built server crashes on startup.
  //
  // Fix: traceInclude tells Nitro to copy the binary explicitly.
  //
  // This path is specific to Apple Silicon Macs. Other platforms need a
  // different package (e.g. @libsql/linux-x64-gnu). Only enable it when
  // testing a production build locally.
  //
  // Note: once we set the production DB to a cloud-based Turso instance, we
  // may not have to do this:
  //
  ///////////////////////////////////////////////////////////////////////////

  // nitro: {
  //   externals: {
  //     traceInclude: ['node_modules/@libsql/darwin-arm64/index.node']
  //   }
  // },

  typescript: {
    nodeTsConfig: {
      // Note: nuxt.config.ts and drizzle.config.ts are siblings in the project root.
      // However, the path below in include isn’t resolved relative to where nuxt.config.ts lives.
      // It’s resolved relative to the generated tsconfig file that Nuxt writes, and that file lives in .nuxt/.
      include: ['../drizzle.config.ts']
    }
  },

  ///////////////////////////////////////////////////////////////////////////
  //
  // Note: the .vscode/settings.json overwrites my default global settings,
  // that normally use Prettier.
  //
  //   {
  //     "prettier.enable": false,
  //     "editor.formatOnSave": true,
  //     "eslint.format.enable": true,
  //     "editor.defaultFormatter":"dbaeumer.vscode-eslint" ,
  //     "[typescript]": { "editor.defaultFormatter": "dbaeumer.vscode-eslint" },
  //     "[javascript]": { "editor.defaultFormatter": "dbaeumer.vscode-eslint" },
  //     "[vue]": { "editor.defaultFormatter": "dbaeumer.vscode-eslint" },
  //     "editor.codeActionsOnSave": {
  //       "source.fixAll.eslint": "explicit"
  //     }
  //   }
  //
  ///////////////////////////////////////////////////////////////////////////
  eslint: {
    // https://eslint.nuxt.com/packages/module#dev-server-checker
    // checker: true,
    config: {
      // ⚠️ Seems weird to have stylistic rules here, but also in eslint-config.mjs.
      // Consider using the eslint.config.mjs as the single source of truth.
      // See here: https://eslint.nuxt.com/packages/module#eslint-stylistic
      // Where they just set stylistic:ture.
      stylistic: {
        severity: 'warn',
        semi: false,
        quotes: 'single',
        indent: 2,
        commaDangle: 'never',
        arrowParens: true,
        blockSpacing: true,
        braceStyle: '1tbs'
        ///////////////////////////////////////////////////////////////////////////
        //
        // Stylistic handles similar styling rules as Prettier, but it's not a 1:1 replacement.
        // Consequently, I added prettier as well. However, conflicts began to arise.
        // For example, this rule will wrap tailwind classes:
        //
        //   better-tailwindcss/enforce-consistent-line-wrapping
        //
        //   - ESLint’s enforce-consistent-line-wrapping wraps the classes.
        //   - Prettier re-joins them onto one line.
        //
        // Prettier always collapses the contents of a class attribute in Vue/HTML templates into
        // a single line (it trims and joins the whitespace-separated names), and no option turns this off.
        // Ultimately, the best decision seems to be to opt out of Prettier on .vue, .ts, and .js files.
        //
        //   {
        //     "prettier.enable": true,
        //     "editor.formatOnSave": true,
        //     "editor.defaultFormatter": "esbenp.prettier-vscode",
        //     "[vue]": { "editor.defaultFormatter": "dbaeumer.vscode-eslint" },
        //     "[typescript]": { "editor.defaultFormatter": "dbaeumer.vscode-eslint" },
        //     "[javascript]": { "editor.defaultFormatter": "dbaeumer.vscode-eslint" },
        //     "editor.codeActionsOnSave": {
        //       "source.fixAll.eslint": "explicit"
        //     }
        //   }
        //
        // It's still useful for .css and .json files though.
        //
        ///////////////////////////////////////////////////////////////////////////
      }
    }
  },

  fonts: {
    families: [
      {
        name: 'Poppins',
        // Providers: google is fine here, but the module also supports Bunny,
        // Fontsource, Adobe, and others. If you omit provider, it tries them in order.
        // Either way, the files get downloaded and served from your own origin at build
        // time, so users never hit Google's servers.
        provider: 'google',
        weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        styles: ['normal', 'italic'],
        ///////////////////////////////////////////////////////////////////////////
        //
        // Setting subsets: ['latin'] doesn't add anything to the font. It narrows what gets included.
        // Without it, the module defaults to every subset (cyrillic, greek, vietnamese, latin-ext,
        // latin, and so on). Each subset is a separate font file, so with ['latin'] you get
        // only the Latin files: basic English, digits, punctuation, and common Western European
        // accents like é and ñ.
        //
        // With latin: the build output is much smaller and simpler.
        // If your app is English or Western European, ['latin'] is the right choice.
        //
        ///////////////////////////////////////////////////////////////////////////
        subsets: ['latin'],
        global: true // always include @font-face, even if not detected in CSS
      }
    ]
  },

  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Gotcha: The "stroke-1" Tailwind class will not work directly on UIcon
  // because it's not actually rendering an <svg>.
  //
  //   <UIcon
  //     name="i-lucide-circle-check"
  //     class="size-full stroke-1 text-primary"
  //   />
  //
  // By default, Nuxt Icon (what UIcon uses) renders <span class="iconify i-lucide:circle-check">
  // and draws the icon with a CSS mask-image. The stroke width is baked into the SVG data URL,
  // so no CSS property can change it.
  //
  // Step 1 is changing the rendered element to <svg>. However, even then the actual stroke-width="2"
  // property is often on an internal <g stroke-width="2"> element.
  //
  // Fix 1: Use a Tailwind class of '[&_g]:stroke-1'
  //        Or .iconify g { stroke-width: 1; }
  //
  // Fix 2:
  //
  //   const thin = (content: string) => content.replace(/stroke-width="[^"]*"/g, `stroke-width="1"`)
  //   :customize="thin"
  //
  // Fix 2.5: You can actually inline it, but it gets ugly:
  //
  //    :customize="(content: string) => content.replace(/stroke-width=\x22[^\x22]*\x22/g, `stroke-width='1'`)"
  //
  // Alternative: Use '@lucide/vue'
  //
  ///////////////////////////////////////////////////////////////////////////
  icon: {
    mode: 'svg'
  }

})
