// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import { getDefaultAttributes } from 'eslint-plugin-better-tailwindcss/api/defaults'

import localPlugin from './eslint/local-plugin.mjs'

// Shared by the TS rule (ts/vue files) and the core rule (js/mjs files).
const unusedVarsOptions = {
  argsIgnorePattern: '^_', // Ignore unused arguments that start with _
  varsIgnorePattern: '^_', // Ignore unused variables that start with _
  caughtErrorsIgnorePattern: '^_', // Ignore caught errors that start with _
  destructuredArrayIgnorePattern: '^_' // Ignore destructured array elements that start with _
}

export default withNuxt(
  // Nuxt  originally just did "correctness-error", but if you also want the
  // stylistic rules like better-tailwindcss/enforce-consistent-class-order
  // then use 'recommended'. Moreover, if you don't want correctness violations
  // to be errors, then use 'recommended-warn'.
  // ❌ betterTailwindcss.configs['correctness-error'],
  betterTailwindcss.configs['recommended-warn'],
  {
    settings: {
      'better-tailwindcss': {
        entryPoint: 'app/assets/css/main.css',
        attributes: [...getDefaultAttributes(), ['^v-bind:ui$', [{ match: 'objectValues' }]]]
      }
    },
    rules: {
      'no-var': 'warn', // ts transpiles let/const to var, so no need for vars any more

      'no-empty': 'warn',
      'prefer-const': 'warn', // ts provides better types with const
      'prefer-rest-params': 'warn', // ts provides better types with rest args over arguments
      'prefer-spread': 'warn', // ts transpiles spread to apply, so no need for manual apply
      'no-constant-condition': 'warn',
      'import/newline-after-import': 'warn',
      'no-loss-of-precision': 'warn',
      'preserve-caught-error': 'warn',

      // Why use no-process-env? Because we want devs to prefer the Zod-validated env from
      // server/utils/env.ts. Note: 'no-restricted-properties' has also been added because
      // no-process-env doesn't actually allow for message customization. Below, the rules
      // rules are later turned off specifically for server/utils/env.ts.
      'no-process-env': 'warn',
      'no-restricted-properties': [
        'warn',
        {
          object: 'process',
          property: 'env',
          message: 'Use the validated `env` object from "server/utils/env" instead of process.env.'
        }
      ],

      ///////////////////////////////////////////////////////////////////////////
      //
      // Note: Vue templates support two different parsing paths, and one of them isn't case-sensitive.
      // SFC <template> blocks go through Vue's compiler, which is case-sensitive and behaves like JSX.
      // But Vue also supports writing templates as literal strings (via a template: "..." option,
      // or in-DOM templates — e.g., server-rendered HTML that Vue mounts onto directly).
      // Because that path is parsed by the browser's native HTML parser before Vue ever sees it,
      // and HTML itself is case-insensitive, <Button> gets silently lowercased to <button>
      // by the browser before Vue's runtime can resolve it as a component at all. In that scenario,
      // the case distinction you're relying on completely disappears, and your component would just...
      // not render, replaced by a plain native button tag.
      //
      // Generally speaking Vue can disambiguate between <Button>< and <button>,
      // but in the case of writing templates as literal strings (via a template: "..." option,
      // <Button> would get silently lowercased to <button>, and that would be bad.
      //
      // With Vite + .vue SFC files, you basically never encounter this. More specifically,
      // inside a .vue file, Vite never sends that markup to the browser to parse as HTML at all.
      // Vite runs it through @vue/compiler-sfc at build time, which parses your <template> block
      // with Vue's own case-sensitive template compiler (not the browser's HTML parser).
      // The browser's case-insensitive HTML parser is never in the loop at any point.
      //
      // Here's where the string-template / in-DOM-template approach actually shows up,
      // so you can recognize it if you ever see it:
      //
      //   1. Vue loaded via <script> tag / CDN, no build step at all
      //   2. Explicitly using the template: "..." component option
      //
      // Conclusion: Since we're writing .vue files and using Vite (and would continue to, under Nuxt),
      // this whole category of risk doesn't apply to this project. You'd only run into it if you
      // (or a library you depend on) deliberately mounted a component using a raw HTML string or
      // the template: "..." option — which is uncommon in modern Vue codebases.
      //
      ///////////////////////////////////////////////////////////////////////////
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',
      'vue/block-lang': 'off', // Useful if you want to allow lang="js"
      'vue/block-tag-newline': 'warn',
      'vue/no-multiple-template-root': 'off',
      'vue/multiline-html-element-content-newline': 'warn',
      'vue/html-indent': 'warn',
      'vue/singleline-html-element-content-newline': 'warn',

      // Allows @ts-ignore statement. When on, it actually just says to
      // use "@ts-expect-error" instead, which may be a newer syntax.
      '@typescript-eslint/ban-ts-comment': 'off',

      '@typescript-eslint/no-unused-vars': ['warn', unusedVarsOptions],

      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',

      /* ======================
            Stylistic
      ====================== */
      // No need for manually setting all to "warn". Instead, in
      // nuxt.config.ts do this: config: { stylistic: {severity:'warn'} }

      ///////////////////////////////////////////////////////////////////////////
      //
      // This is necessary to not conflict with Prettier.
      //
      //   '@stylistic/operator-linebreak': ['warn', 'after']
      //   '@stylistic/member-delimiter-style': 'off',
      //
      // This is one of those cases where Prettier is intentionally opinionated
      // and non-configurable. Prettier does not have a setting for operator
      // placement. Currently, this seems to be the only conflict. If you run
      // into many more, you may want to install eslint-config-prettier, which
      // turns off stylistic ESLint rules that conflict with Prettier.
      //
      // Some of the most common @stylistic/* rules that clash with Prettier are:
      //
      //   '@stylistic/indent'
      //   '@stylistic/quotes'
      //   '@stylistic/semi'
      //   '@stylistic/comma-dangle'
      //   '@stylistic/object-curly-spacing'
      //   '@stylistic/array-bracket-spacing'
      //   '@stylistic/computed-property-spacing'
      //   '@stylistic/key-spacing'
      //   '@stylistic/keyword-spacing'
      //   '@stylistic/space-before-function-paren'
      //   '@stylistic/space-infix-ops'
      //   '@stylistic/operator-linebreak'
      //   '@stylistic/max-len'
      //   '@stylistic/eol-last'
      //   '@stylistic/no-multiple-empty-lines'
      //   '@stylistic/padded-blocks'
      //   '@stylistic/block-spacing'
      //   '@stylistic/brace-style'
      //   '@stylistic/arrow-parens'
      //   '@stylistic/function-paren-newline'
      //
      // Ultimately, I ran into other issues with Prettier and better-tailwindcss
      // that caused me to entirely opt out of Prettier on .vue, .ts, and .js files.
      // In particular, better-tailwindcss/enforce-consistent-line-wrapping was fighting
      // with Prettier.
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
      ///////////////////////////////////////////////////////////////////////////

      // Initially, I was doing this:
      // If any property is on its own line, `{` and `}` must be on their own lines
      // '@stylistic/object-curly-newline': ['warn', { multiline: true, consistent: true }],

      // ⚠️ This is being used on a trial basis to see how it behaves.
      '@stylistic/object-curly-newline': ['warn', {
        // existing behavior for object literals, destructuring, imports, exports
        ObjectExpression: { multiline: true, consistent: true },
        ObjectPattern: { multiline: true, consistent: true },
        ImportDeclaration: { multiline: true, consistent: true },
        ExportDeclaration: { multiline: true, consistent: true },

        // new: TypeScript type literals and interfaces
        TSTypeLiteral: { minProperties: 2, multiline: true, consistent: true },
        TSInterfaceBody: { minProperties: 2, multiline: true, consistent: true }
      }],

      // Either all properties on one line, or one property per line, never mixed
      '@stylistic/object-property-newline': ['warn', { allowAllPropertiesOnSameLine: true }],

      '@stylistic/member-delimiter-style': ['warn', {
        multiline: {
          delimiter: 'comma',
          requireLast: false
        },
        singleline: {
          delimiter: 'comma',
          requireLast: false
        },
        multilineDetection: 'brackets'
      }],

      // Prefer 'vue/max-len'. It’s an extended version of the core rule that also
      // covers the template, including HTML comments, and adds template-specific options.
      // But actually max-len in general may be problematic because Vue doesn’t collapse
      // whitespace inside static attribute values. This means new lines literally become "\n", etc.
      // ❌ '@stylistic/max-len': ...

      /* ======================
          Better Tailwind
      ====================== */

      'better-tailwindcss/no-unknown-classes': ['warn', {
        ignore: ['^terminal$']
      }]
    }
  },

  ///////////////////////////////////////////////////////////////////////////
  //
  // Rule vs Parser Mismatch:
  //
  // Plain JS files (eslint.config.mjs, eslint/rules/*.mjs, etc.) aren't parsed
  // by the TypeScript parser, so @typescript-eslint/no-unused-vars can't tell
  // value usage from type usage and wrongly reports every variable as
  // "only used as a type". Use the core rule for those files instead.
  //
  ///////////////////////////////////////////////////////////////////////////
  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': ['warn', unusedVarsOptions]
    }
  },

  // ///////////////////////////////////////////////////////////////////////////
  //
  // Custom rule: prefer httpError() over createError() on the server.
  // Scoped to server/ because Nuxt's app-side createError (pages, showError)
  // is a different API and has no httpError equivalent.
  //
  ///////////////////////////////////////////////////////////////////////////
  {
    files: ['server/**/*.{ts,js,mjs}'],
    plugins: { local: localPlugin },
    rules: {
      'local/prefer-http-error': 'warn'
    }
  },
  // The wrapper itself has to call createError. Adjust this path to wherever
  // httpError lives in your project.
  {
    files: ['server/utils/httpError.ts'],
    rules: {
      'local/prefer-http-error': 'off'
    }
  },

  {
    files: ['nuxt.config.ts', 'server/utils/env.ts'],
    rules: {
      'no-process-env': 'off',
      'no-restricted-properties': 'off'
    }
  },

  // Error: Error while loading rule '@typescript-eslint/consistent-type-imports'
  // Occurred while linting... eslint/local-plugin.mjs
  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off'
    }
  }

)
