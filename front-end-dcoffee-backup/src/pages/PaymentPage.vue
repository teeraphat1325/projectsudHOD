<template>
  <q-page padding>
    <div>
      <!-- หัวข้อหลัก -->
      <div class="text-h6 q-mb-lg">Payment Management</div>
      <!-- แถวสำหรับช่องค้นหาและปุ่ม -->
      <div class="row justify-between items-center q-mb-lg">
        <q-input
          filled
          v-model="search"
          label="Search"
          debounce="300"
          class="q-mr-md"
          dense
          @input="handleSearch"
        >
          <template v-slot:append>
            <!-- ปุ่มค้นหาที่ทำงานเหมือนปุ่ม -->
            <q-icon name="search" @click="handleSearch" class="cursor-pointer" />
          </template>
        </q-input>
        <q-btn icon="add" color="brown-10" @click="openDialog">Add Payment</q-btn>
      </div>
    </div>
    <q-table :columns="columns" :rows="filteredPayments" class="q-mb-lg">
      <template v-slot:body-cell-operation="{ row }">
        <q-btn flat icon="edit" @click="edit(row)"></q-btn>
        <q-btn flat icon="delete" @click="remove(row)"></q-btn>
      </template>
    </q-table>
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ id === 0 ? 'Add New Payment' : 'Edit Payment' }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form ref="form" @submit="save" @reset="reset" class="q-gutter-md">
            <q-input
              filled
              v-model="name"
              label="Payment Name *"
              lazy-rules
              :rules="[(val) => !!val || 'Name is required']"
            />
            <q-input
              filled
              v-model="amount"
              label="Amount *"
              lazy-rules
              :rules="[(val) => !!val || 'Amount is required']"
              type="number"
            />
            <q-input
              filled
              v-model="date"
              label="Payment Date *"
              lazy-rules
              :rules="[(val) => !!val || 'Date is required']"
              type="date"
            />
            <q-select
              filled
              v-model="status"
              label="Payment Status *"
              :options="['Pending', 'Completed', 'Failed']"
              lazy-rules
              :rules="[
                (val) => ['Pending', 'Completed', 'Failed'].includes(val) || 'Invalid status',
              ]"
            />
            <q-select
              filled
              v-model="method"
              label="Payment Method"
              :options="['Credit Card', 'PayPal', 'Bank Transfer']"
            />
            <q-select filled v-model="currency" label="Currency" :options="['THB', 'USD', 'EUP']" />
            <div>
              <q-btn label="Submit" type="submit" color="primary" />
              <q-btn label="Cancel" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { type QForm, type QTableColumn } from 'quasar'
import { usePaymentStore } from 'src/stores/paymentStore'
import type { Payment } from 'src/models'

const paymentStore = usePaymentStore()

const search = ref<string>('')
const dialog = ref(false)
const form = ref<QForm | null>(null)
const id = ref(0)
const amount = ref<number>(0)
const date = ref<string>('')
const status = ref<'Pending' | 'Completed' | 'Failed'>('Pending')
const method = ref<string>('Credit Card') // Default method
const currency = ref<string>('USD') // Default currency
const name = ref<string>('') // Default name field

const filteredPayments = computed(() => paymentStore.filteredPayments)

const columns: QTableColumn[] = [
  { name: 'id', label: 'ID', field: 'id', align: 'center', sortable: true },
  { name: 'name', label: 'Payment Name', field: 'name', align: 'center' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'center' },
  { name: 'date', label: 'Payment Date', field: 'date', align: 'center' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'method', label: 'Method', field: 'method', align: 'center' },
  { name: 'currency', label: 'Currency', field: 'currency', align: 'center' },
  { name: 'operation', label: '', field: 'operation', align: 'center' },
]

function openDialog() {
  reset()
  dialog.value = true
}

function edit(row: Payment) {
  id.value = row.id ?? 0
  amount.value = row.amount
  date.value = row.date
  status.value = row.status
  method.value = row.method
  currency.value = row.currency
  name.value = row.name // Set name from the row data
  dialog.value = true
}

function remove(row: Payment) {
  paymentStore.deletePayment(row)
}

function save() {
  const payment = {
    id: id.value,
    amount: amount.value,
    date: date.value,
    status: status.value,
    method: method.value,
    currency: currency.value,
    name: name.value, // Include name in the payment object
  }

  if (id.value === 0) {
    paymentStore.addPayment(payment)
  } else {
    paymentStore.updatePayment(payment)
  }

  dialog.value = false
  reset()
}

function reset() {
  form.value?.resetValidation()
  id.value = 0
  amount.value = 0
  date.value = ''
  status.value = 'Pending'
  method.value = 'Credit Card'
  currency.value = 'USD'
  name.value = '' // Reset name field
  dialog.value = false
}

function handleSearch() {
  paymentStore.updateFilteredPayments(search.value)
}
</script>
