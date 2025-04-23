import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Payment } from 'src/models' // Import the Payment model

export const usePaymentStore = defineStore('payment', () => {
  const payments = ref<Payment[]>([
    {
      id: 1,
      amount: 100,
      date: '2025-03-01',
      status: 'Completed',
      method: 'Credit Card',
      currency: 'USD',
      name: 'Subscription',
    },
    {
      id: 2,
      amount: 200,
      date: '2025-03-05',
      status: 'Pending',
      method: 'PayPal',
      currency: 'USD',
      name: 'Product Purchase',
    },
  ])

  const filteredPayments = ref<Payment[]>([])

  function updateFilteredPayments(query: string) {
    if (!query) {
      filteredPayments.value = [...payments.value] // Show all payments if no search query
      return
    }

    const queryLowerCase = query.toLowerCase()
    filteredPayments.value = payments.value.filter(
      (payment) =>
        payment.amount.toString().includes(queryLowerCase) ||
        payment.status.toLowerCase().includes(queryLowerCase) ||
        payment.date.includes(queryLowerCase) ||
        payment.name.toLowerCase().includes(queryLowerCase), // Include name in the filter
    )
  }

  // Add a new payment
  function addPayment(payment: Payment) {
    const newId = Math.max(...payments.value.map((p) => p.id || 0)) + 1 // Handle undefined IDs
    payment.id = newId
    payments.value.push(payment)
    updateFilteredPayments('') // Update the filtered list
  }

  // Update an existing payment
  function updatePayment(updatedPayment: Payment) {
    const index = payments.value.findIndex((p) => p.id === updatedPayment.id)
    if (index !== -1) {
      payments.value[index] = updatedPayment
    }
    updateFilteredPayments('') // Update the filtered list
  }

  // Delete a payment
  function deletePayment(paymentToDelete: Payment) {
    payments.value = payments.value.filter((p) => p.id !== paymentToDelete.id)
    updateFilteredPayments('') // Update the filtered list
  }

  // Initialize with the filtered payments
  updateFilteredPayments('')

  return {
    payments,
    filteredPayments,
    addPayment,
    updatePayment,
    deletePayment,
    updateFilteredPayments,
  }
})
