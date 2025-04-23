import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'
import type { Category } from 'src/models'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([
    { id: 1, name: 'Coffee' },
    { id: 2, name: 'Bakery' },
    { id: 3, name: 'Food' },
  ])

  return { categories }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCategoryStore, import.meta.hot))
}
