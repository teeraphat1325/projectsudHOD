<template>
  <q-page padding>
    <div class="text-h6 q-mb-lg">Customer Management</div>
    <div class="row justify-between items-center">
      <q-input filled v-model="search" label="Search" debounce="300" class="q-mr-md" dense>
        <template v-slot:append>
          <q-icon name="search" class="search-icon" />
        </template>
      </q-input>
      <q-btn icon="add" color="brown-10" @click="openDialog">Add</q-btn>
    </div>
    <br />
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ id === 0 ? 'Add New Customer' : 'Edit Customer' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form ref="form" @submit="save" @reset="reset" class="q-gutter-md">
            <q-input
              filled
              v-model="name"
              label="Name *"
              lazy-rules
              :rules="[(val) => !!val || 'Name is required']"
            />
            <q-input
              filled
              v-model="phone"
              label="Phone *"
              lazy-rules
              :rules="[(val) => !!val || 'Phone is required']"
            />
            <q-input
              filled
              v-model="point"
              label="Points *"
              lazy-rules
              :rules="[(val) => !!val || 'Points are required']"
            />
            <div>
              <q-btn label="Submit" type="submit" color="primary" />
              <q-btn label="Cancel" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-table :columns="columns" :rows="filteredCustomers">
      <template v-slot:body-cell-operation="{ row }">
        <q-btn flat icon="edit" @click="edit(row)"></q-btn>
        <q-btn flat icon="delete" @click="remove(row)"></q-btn>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { type QForm, type QTableColumn } from 'quasar'
import { useCustomerStore } from 'src/stores/customerStore'
import type { Customer } from 'src/models'

const customerStore = useCustomerStore()
const search = ref<string>('') // Search input for customers
const dialog = ref(false)
const form = ref<QForm | null>(null)
const id = ref(0)
const name = ref('')
const phone = ref('')
const point = ref(0)

const columns: QTableColumn[] = [
  { name: 'id', label: 'ID', field: 'id', align: 'center', sortable: true },
  { name: 'name', label: 'Name', field: 'name', align: 'center' },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'center' },
  { name: 'point', label: 'Points', field: 'point', align: 'center' },
  { name: 'operation', label: '', field: 'operation', align: 'center' },
]

const filteredCustomers = computed(() =>
  customerStore.customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.value.toLowerCase()) ||
      customer.phone.toLowerCase().includes(search.value.toLowerCase()) ||
      customer.point.toString().includes(search.value),
  ),
)
function openDialog() {
  reset()
  dialog.value = true
}

function edit(row: Customer) {
  id.value = row.id
  name.value = row.name
  phone.value = row.phone
  point.value = row.point
  dialog.value = true
}

function remove(row: Customer) {
  customerStore.deleteCustomer(row.id)
}

function save() {
  form.value?.validate().then((success) => {
    if (success) {
      const customer: Customer = {
        id: id.value,
        name: name.value,
        phone: phone.value,
        point: point.value,
      }
      if (id.value === 0) {
        customerStore.addCustomer(customer)
      } else {
        customerStore.editCustomer(customer)
      }
      dialog.value = false
      reset()
    }
  })
}

function reset() {
  form.value?.resetValidation()
  id.value = 0
  name.value = ''
  phone.value = ''
  point.value = 0
  dialog.value = false
}
</script>
