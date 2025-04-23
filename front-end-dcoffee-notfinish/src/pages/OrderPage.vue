<template>
  <q-page padding>
    <div>
      <div class="text-h6 q-mb-lg">Receipt Management</div>
      <q-row class="q-mb-lg" gutter="16">
        <!-- Filter by Date -->
        <q-col cols="6" sm="4" md="3">
          <q-input
            v-model="filterDate"
            label="Select Date"
            dense
            filled
            readonly
            style="width: 100%; max-width: 200px"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" @click="openDatePicker = true" />
            </template>
          </q-input>
          <q-popup-proxy v-model="openDatePicker" transition-show="scale" transition-hide="scale">
            <q-date v-model="filterDate" mask="YYYY-MM-DD" />
          </q-popup-proxy>
        </q-col>

        <!-- Search by Name/Phone -->
        <q-col cols="6" sm="8" md="6">
          <q-input v-model="search" label="Search by Name or Phone" debounce="300" dense filled>
            <template v-slot:append>
              <q-icon name="search" class="cursor-pointer" />
            </template>
          </q-input>
        </q-col>
      </q-row>
    </div>

    <!-- Receipt Table -->
    <q-table
      :columns="columns"
      :rows="filteredReceipts"
      flat
      bordered
      dense
      :rows-per-page-options="[0]"
      row-key="id"
      style="height: 500px"
      @row-click="handleRowClick"
    />

    <!-- Receipt Details -->
    <q-dialog v-model="detailsDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Receipt Details for ID: {{ selectedReceipt?.id }}</div>
        </q-card-section>
        <q-card-section>
          <q-table
            :columns="detailColumns"
            :rows="selectedReceipt?.receiptDetails || []"
            dense
            flat
            bordered
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" @click="detailsDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { type QTableColumn } from 'quasar'
import { useReceiptStore } from 'src/stores/receiptStore'
import type { Receipt } from 'src/models'

const receiptStore = useReceiptStore()

// Filters
const search = ref<string>('') // ค้นหาชื่อหรือเบอร์โทร
const filterDate = ref<string | null>(null) // กรองตามวันที่
const openDatePicker = ref(false) // ควบคุมการแสดงผลปฏิทิน

// Dialog for Receipt Details
const detailsDialog = ref(false)
const selectedReceipt = ref<Receipt | null>(null)

// Receipt Columns
const columns: QTableColumn[] = [
  { name: 'id', label: 'ID', field: 'id', align: 'center', sortable: true },
  {
    name: 'createdDate',
    label: 'Created Date',
    field: 'createdDate',
    align: 'center',
    format: (val: Date) => new Date(val).toLocaleDateString('en-US'),
  },
  {
    name: 'customerName',
    label: 'Customer Name',
    field: (row: Receipt) => row.customer?.name || 'N/A',
    align: 'center',
  },
  {
    name: 'customerName',
    label: 'Customer Name',
    field: (row: Receipt) => row.customer?.name || 'N/A',
    align: 'center',
  },
  {
    name: 'customerPhone',
    label: 'Customer Phone',
    field: (row: Receipt) => row.customer?.name || 'N/A',
    align: 'center',
  },
  {
    name: 'cash',
    label: 'Cash',
    field: 'cash',
    align: 'center',
    format: (val: number) => `${val} ฿`,
  },
  {
    name: 'change',
    label: 'Change',
    field: 'change',
    align: 'center',
    format: (val: number) => `${val} ฿`,
  },
  {
    name: 'total',
    label: 'Total Amount',
    field: 'total',
    align: 'center',
    format: (val: number) => `${val} ฿`,
  },
]

// Receipt Detail Columns
const detailColumns: QTableColumn[] = [
  { name: 'productName', label: 'Product Name', field: 'productName', align: 'center' },
  { name: 'productPrice', label: 'Price', field: 'productPrice', align: 'center' },
  { name: 'qty', label: 'Quantity', field: 'qty', align: 'center' },
  { name: 'totalPrice', label: 'Total Price', field: 'totalPrice', align: 'center' },
  { name: 'productSize', label: 'Size', field: 'productSize', align: 'center' },
  { name: 'productSweetLevel', label: 'Sweet Level', field: 'productSweetLevel', align: 'center' },
  { name: 'productType', label: 'Type', field: 'productType', align: 'center' },
]

// Filter Receipts
const filteredReceipts = computed(() =>
  receiptStore.getAllReceipts
    .filter((receipt) => {
      // Filter by Date
      const isDateMatch = filterDate.value
        ? new Date(receipt.createdDate).toISOString().slice(0, 10) === filterDate.value
        : true

      // Filter by Name or Phone
      const searchLower = search.value.toLowerCase()
      const isSearchMatch =
        (receipt.customer?.name?.toLowerCase().includes(searchLower) || false) || // กรณี customer มี name
        (receipt.customer?.phone?.includes(searchLower) || false) || // กรณี customer มี phone
        (!receipt.customer && searchLower === '') // แสดง row ที่ไม่มี customer เมื่อ search ว่าง

      return isDateMatch && isSearchMatch
    })
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()) // เรียงจากวันที่ล่าสุด
)

// Show Receipt Details
function handleRowClick(evt: Event, row: Receipt) {
  showDetails(row) // ใช้ row ในฟังก์ชัน showDetails
}

function showDetails(row: Receipt) {
  selectedReceipt.value = row
  detailsDialog.value = true
}
</script>
