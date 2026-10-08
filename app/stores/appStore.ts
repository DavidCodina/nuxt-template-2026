import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// For global app state, Pinia is the standard choice.
// It’s the official Vue-recommended store (the successor to Vuex).
// In most Vue 3 apps, when people say “global state” or “app context,” they mean Pinia.

export const useAppStore = defineStore('appStore', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  const increment = () => count.value++

  const reset = () => {
    count.value = 0
  }

  return { count, doubleCount, increment, reset }
})
