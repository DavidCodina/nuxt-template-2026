<script setup lang="ts">
// No need to import any component from the components/ directory.
// import PageContainer from '@/components/Page/Container.vue'
// import { PageContainer } from '#components'

const title = 'Test Page'
const description = 'A page dedicated to rendering example code.'

///////////////////////////////////////////////////////////////////////////
//
// The og prefix stands for Open Graph, a protocol Facebook created for
// controlling how links look when shared. Most platforms read it, and
// Twitter/X falls back to it when it has no twitter:* tags of its own.
//
// Why set both? If ogTitle and ogDescription are missing, many platforms
// fall back to title and description, but not all do, and the behavior
// is inconsistent. Setting both is the safe default. The one reason to
// make them differ is if you want a punchier headline for social shares
// than for the browser tab or search results
//
//   (e.g. title: 'Test Page | My App' but ogTitle: 'Try our new test page')
//
// Related tags you may want:
//
//   - ogImage: the image on the share card (you had this before, and without it your shared links will have no image)
//   - twitterCard: set to 'summary_large_image' for the big-image layout on X
//
/////////////////////////
//
// Note: useHead is the general-purpose API for anything in <head>: title, meta tags,
// links, scripts, html attributes. useSeoMeta is a typed, flat shortcut built on
// top of it, just for SEO-related meta tags.
//
// Where they differ
//
//   useSeoMeta gives you a flat, readable syntax with full TypeScript autocomplete
//   and fewer typo traps. Compare setting a description and OG title:
//
//     // useHead: you write the raw meta tag structure
//     useHead({
//       meta: [
//         { name: 'description', content: 'My description' },
//         { property: 'og:title', content: 'Test Page' }
//       ]
//     })
//
//     // useSeoMeta: flat and typed
//     useSeoMeta({
//       description: 'My description',
//       ogTitle: 'Test Page'
//     })
//
//   With useHead you have to remember whether a tag uses name or property
//   (OG tags use property, and getting it wrong silently breaks them).
//   useSeoMeta handles that for you.
//
//   Another difference is that useHead is reactive but useSeoMeta is not.
//
//   But useSeoMeta can't do non-SEO things like <link> tags, scripts, htmlAttrs,
//   or bodyAttrs. That's what useHead is for, which is why your app.vue uses both.
//
// Which is preferred?
//
//   The Nuxt docs recommend useSeoMeta for SEO tags (title, description, og, twitter),
//   and useHead for everything else. So your current setup is already the recommended split.
//
//   If you only want to change the tab title on one page, useHead({ title: 'Test Page' })
//   is perfectly fine and arguably more natural since you're not touching any social tags.
//   Using useSeoMeta({ title }) is just as valid. Pick one and stay consistent.
//
//   There is also a small shortcut for the common case of just setting a page title:
//
//     definePageMeta({ title: 'Test Page' })
//
//   It stores the title on the route, but it does not set the <title> tag on its own.
//   You'd still need useHead or useSeoMeta to apply it, so don't rely on it for this.
//   See here: https://www.udemy.com/course/the-complete-nuxt-js-course-welcome-to-the-server-side/learn/lecture/52862821#overview
//
//
///////////////////////////////////////////////////////////////////////////

useSeoMeta({
  // title: Browsers and search engines
  // The browser tab, bookmarks, and the blue link in Google results
  // Note that the tab title only depends on title. ogTitle has no effect on what the browser tab shows.
  // You can also use titleTemplate as an alternative.
  title,
  // ogTitle: Social platforms and chat apps (Facebook, LinkedIn, Slack, Discord, iMessage, etc.)
  // The headline on the link preview card when someone shares your URL
  ogTitle: title,
  // description:  Search engines
  // The gray snippet
  //  under the link in Google results
  description,
  // ogDescription: Social platforms and chat apps (Facebook, LinkedIn, Slack, Discord, iMessage, etc.)
  // The text under the headline on that preview card
  ogDescription: description
  // ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  // twitterCard: 'summary_large_image'
})

// definePageMeta({
//   layout: 'test',
//   middleware: [
//     (_to, _from) => { console.log('The local middleware ran in /test') },
//     'my-named-middleware'
//   ]
// })
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <Page>
    <PageContainer>
      <section
        class="
          relative mx-auto my-12 max-w-150 rounded-xl border bg-card text-sm
          shadow-sm
        "
      >
        <Hexagon class="relative top-0 left-1/2 -mb-14 w-20 -translate-1/2">
          <UIcon
            name="i-lucide-circle-check"
            class="size-full p-3.5 text-success"
            :customize="(content: string) => content.replace(/stroke-width=\x22[^\x22]*\x22/g, `stroke-width='1'`)"
          />
        </Hexagon>

        <article
          class="divide-y"
        >
          <p class="p-4">
            The login/logout authentication seems to work fine. But if I save any changes in the editor,
            then go to logout, the redirect logic seems to fail! Wait... Maybe it's fine.
          </p>

          <p class="p-4">
            Make form skeleton in /posts/[id]/update.
          </p>

          <p class="p-4">
            Add a client-side filter based on author to the posts list.
          </p>

          <p class="p-4">
            Add /create link to /posts if the user is authenticated. <br>
            Once that's done, return to Syntax tutorial and implement cloud-based Turso DB.
          </p>

          <p class="p-4">
            Get a definitive answer on ignore prefixes<br>
            https://github.com/nuxt/nuxt/discussions/16318
          </p>

          <p class="p-4">
            Add BETTER_AUTH_SECRET, BETTER_AUTH_URL to Vercel Environment Variables before deploying. Otherwise it will fail.
          </p>

          <p class="p-4">
            There is actually a better auth nuxt module. Not sure why it's not listed officiall. <br>
            https://github.com/nuxt-modules/better-auth
          </p>

          <p class="p-4">
            Update README.md
          </p>

          <p class="p-4">
            Add Nuxt Image...
          </p>

          <p class="p-4">
            We now have a error.vue for 404 pages, but can we differentiate between an error and a
            404.
          </p>

          <p class="p-4">
            Fix active class on sidebar links. Remove shadow on pages when sidebar is open.
          </p>

          <p class="p-4">
            Add scripts in package.json for TypeScript, etc.
          </p>
        </article>
      </section>
    </PageContainer>
  </Page>
</template>
