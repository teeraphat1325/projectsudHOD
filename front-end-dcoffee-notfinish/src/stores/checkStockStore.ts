import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CheckStock } from 'src/models'

export const useCheckStockStore = defineStore('checkStock', () => {
  const stockChecks = ref<CheckStock[]>([])

  const addStockCheck = (check: CheckStock) => {
    stockChecks.value.push(check)
    localStorage.setItem('stockChecks', JSON.stringify(stockChecks.value))
  }

  const getStockCheckById = (id: number) => {
    return stockChecks.value.find((check) => check.id === id)
  }

  const updateStockCheck = (id: number, updatedCheck: CheckStock) => {
    const index = stockChecks.value.findIndex((check) => check.id === id)
    if (index !== -1) {
      stockChecks.value[index] = updatedCheck
      localStorage.setItem('stockChecks', JSON.stringify(stockChecks.value))
    }
  }

  const loadStockHistory = () => {
    // Implement filtering logic based on filters
    return stockChecks.value
  }

  return {
    stockChecks,
    addStockCheck,
    getStockCheckById,
    updateStockCheck,
    loadStockHistory,
  }
})
