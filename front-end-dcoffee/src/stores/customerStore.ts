import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Customer } from 'src/models'

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<Customer[]>([
    { id: 1, name: 'chanyut', phone: '0999999999', point: 10 },
    { id: 2, name: 'pimruda', phone: '0999999998', point: 20 },
    { id: 3, name: 'natthaphon', phone: '0999999991', point: 30 },
  ])

  // ใช้ filteredCustomers สำหรับการกรองลูกค้า
  const filteredCustomers = ref<Customer[]>([...customers.value])

  function addCustomer(customer: Omit<Customer, 'id'>) {
    customers.value.push({
      ...customer,
      id: customers.value.length + 1, // สร้าง ID อัตโนมัติ
    })
    updateFilteredCustomers('')
  }

  function deleteCustomer(id: number) {
    customers.value = customers.value.filter((customer) => customer.id !== id)
    updateFilteredCustomers('')
  }

  function editCustomer(updatedCustomer: Customer) {
    const index = customers.value.findIndex((customer) => customer.id === updatedCustomer.id)
    if (index !== -1) {
      customers.value[index] = updatedCustomer
      updateFilteredCustomers('')
    }
  }

  function updateFilteredCustomers(query: string) {
    if (!query) {
      filteredCustomers.value = [...customers.value]
    } else {
      filteredCustomers.value = customers.value.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query.toLowerCase()) ||
          customer.phone.includes(query),
      )
    }
  }

  return {
    customers,
    filteredCustomers,
    addCustomer,
    deleteCustomer,
    editCustomer,
    updateFilteredCustomers,
  }
})
