// If you place the composable in a subfolder, Nuxt will not be able to
// automatically import it. This can be fixed by reexporting from a
// composables/index.ts file.

import { ref } from 'vue'

///////////////////////////////////////////////////////////////////////////
//
// A composable is just a plain function that uses Vue's Composition API
// (ref, computed, watch, lifecycle hooks, etc.) and returns reactive state
// plus functions to work with it. That's the whole pattern — no special
// syntax, no class, no "rules of composables" beyond "call it during setup".
//
// This is the rough equivalent of the following React hook::
//
//    function useCounter(initial = 0) {
//      const [count, setCount] = useState(initial)
//
//      const increment = () => setCount(c => c + step)
//      const decrement = () => setCount(c => c - step)
//      const reset     = () => setCount(initial)
//
//      return { count, increment, decrement, reset }
//    }
//
// Key difference from React hooks: a `ref` is a mutable object with a `.value`
// property. There's no re-render to trigger — Vue's reactivity system tracks
// who reads `count.value` and updates them automatically when it changes.
// That also means no dependency arrays, and no rule against calling this
// conditionally or in a loop.
//
///////////////////////////////////////////////////////////////////////////

export function useCounter(initialValue = 0, step = 1) {
  const count = ref(initialValue)

  function increment() {
    count.value += step
  }

  function decrement() {
    count.value -= step
  }

  function reset() {
    count.value = initialValue
  }

  return { count, increment, decrement, reset, step }
}
