<script setup lang="ts">
/* ======================
        Imports
====================== */
///////////////////////////////////////////////////////////////////////////
//
// No need to import it explicitly since we're doing this in nuxt.config.ts
//
//   imports: {
//     presets: [
//       {
//         from: 'consola',
//         imports: ['consola', 'createConsola']
//       }
//     ]
//   }
//
// This is useful for me because a lot of times I'm doing logs on the fly,
// so it would be a pain if we always had to import it. Alternatively, you
// could create a plugin for $consola, but this is easier.
//
/////////////////////////

// ❌ import { consola, createConsola } from 'consola'

/* ======================
  Methods / Functions
====================== */

// Demo 1: a scoped logger with its own level and format options
const apiLogger = createConsola({
  level: 4, // 4 = debug, so debug messages are shown too
  formatOptions: {
    date: true, // prefix each log with a timestamp
    colors: true,
    compact: false
  },
  defaults: {
    tag: 'api' // every message from this instance is tagged
  }
})

// Demo 2: a custom reporter that decides how logs are output
const customLogger = createConsola({
  reporters: [
    {
      log(logObj) {
        const { type, tag, args, date } = logObj
        const time = date.toLocaleTimeString()
        console.log(
          `%c[${time}] ${type.toUpperCase()}${tag ? ` (${tag})` : ''}`,
          'color: #00dc82; font-weight: bold',
          ...args
        )
      }
    }
  ]
})

const _demo1 = async () => {
  // console.clear()

  consola.info('Demo 1')
  consola.start('Building project...')
  consola.warn('A new version of consola is available: 3.0.1')
  consola.success('Project built!')
  consola.error(new Error('This is an example error. Everything is fine!'))
  consola.box('I am a simple box')

  // await consola.prompt('Deploy to the production?', {
  //   type: 'confirm'
  // })
}

const _demo2 = () => {
  // --- Demo 1 ---
  consola.info('Demo 2: tagged logger with debug level ---')
  apiLogger.debug('Connecting to database...')
  apiLogger.success('Connected!')
  apiLogger.warn('Response took 2.4s')

  // withTag() derives a child instance, so you can nest scopes
  const authLogger = apiLogger.withTag('auth')
  authLogger.info('User logged in')
  authLogger.error(new Error('Token expired'))
}

const _demo3 = () => {
  consola.info('Demo 3: custom reporter ---')
  customLogger.info('Hello from a custom reporter')
  customLogger.withTag('deploy').success('Deployed to production')
  customLogger.warn('Cache is almost full', { used: '92%' })
}

_demo1()
</script>

<!-- ======================================================================

======================================================================= -->
<!--
A few things worth knowing:

  - level filters what gets printed. The default is 3 (info). Set it to 4
    for debug, 5 for trace, or 0 to show only errors and fatals.

  - defaults.tag and withTag() let you give each module (api, auth, db, and so on)
    its own labeled logger without repeating the tag on every call.

  - reporters replaces the default output entirely. You could use it to send errors to Sentry,
    write to a file on the server, or format logs as JSON.

  - SSR in Nuxt: this code runs on both the server and the client. Server-side logs show up in
    your terminal with the fancy reporter, while client-side logs go to the browser console
    with the browser reporter. If you only want one side, wrap the call in if (import.meta.client)
    or if (import.meta.server).

  - formatOptions like date and compact mainly affect the fancy and basic reporters. They don’t
    change the browser reporter much.
-->
<template>
  <div class="text-center text-2xl font-bold text-primary italic">
    See the console dummy!
  </div>
</template>
