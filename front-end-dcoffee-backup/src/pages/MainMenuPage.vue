<template>
  <q-page padding>
    <div class="overview-container">
      <!-- Toggle Button -->
      <div class="button-box">
        <div id="btn"></div>
        <button
          class="toggle-btn"
          @click="setDaily"
          :class="{ active: viewMode === 'daily', inactive: viewMode !== 'daily' }"
        >
          DAILY
        </button>
        <button
          class="toggle-btn"
          @click="setMonthly"
          :class="{ active: viewMode === 'monthly', inactive: viewMode !== 'monthly' }"
        >
          MONTHLY
        </button>
      </div>

      <!-- Graph Section -->
      <div class="overview-graph">
        <div class="graph-header">
          Sales Overview (
          {{ viewMode === 'daily' ? currentDateDisplay : currentMonthYear }})
        </div>
        <div class="graph-content">
          <canvas id="salesGraph"></canvas>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="navigation-buttons">
        <q-btn icon="arrow_back" label="Previous" flat @click="previousPeriod" />
        <q-btn icon="arrow_forward" label="Next" flat @click="nextPeriod" />
      </div>

      <!-- Tables Section -->
      <div class="tables">
        <!-- Table: Top Sale Products -->
        <div class="table">
          <table>
            <thead>
              <tr>
                <th class="table-header">Top Sale Products</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in topSaleProducts" :key="index">
                <td>{{ index + 1 }}. {{ product.name }} - {{ product.quantity }} sold</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table: Least Sale Products -->
        <div class="table">
          <table>
            <thead>
              <tr>
                <th class="table-header">Least Sale Products</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in leastSaleProducts" :key="index">
                <td>{{ index + 1 }}. {{ product.name }} - {{ product.quantity }} sold</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table: Sales Stats -->
        <div class="table">
          <table>
            <thead>
              <tr>
                <th class="table-header">Sales Stats</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Amount: ฿{{ totalSalesVolume.toFixed(2) }}</td>
              </tr>
              <tr>
                <td>Average Transaction: ฿{{ averageTransactionValue.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import { useReceiptStore } from 'src/stores/receiptStore'

// Store
const receiptStore = useReceiptStore()

// View Mode: 'daily' or 'monthly'
const viewMode = ref<'daily' | 'monthly'>('monthly')

// Current Date and Month
const currentDate = ref(new Date())
const currentMonth = computed(() => currentDate.value.toLocaleString('en', { month: 'long' }))
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonthYear = computed(() => `${currentMonth.value} ${currentYear.value}`)
const currentDateDisplay = computed(() =>
  currentDate.value.toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' }),
)

// Chart Instance
let chartInstance: Chart | null = null

// Filtered Data for Graph
const filteredReceipts = computed(() => {
  if (viewMode.value === 'daily') {
    const date = currentDate.value.toISOString().split('T')[0]
    return receiptStore.receipts.filter(
      (receipt) => new Date(receipt.createdDate).toISOString().split('T')[0] === date,
    )
  } else {
    const month = currentDate.value.getMonth()
    const year = currentDate.value.getFullYear()
    return receiptStore.receipts.filter((receipt) => {
      const receiptDate = new Date(receipt.createdDate)
      return receiptDate.getMonth() === month && receiptDate.getFullYear() === year
    })
  }
})

// Compute Top Sale Products
const topSaleProducts = computed(() => {
  const productSales: Record<string, number> = {}

  filteredReceipts.value.forEach((receipt) => {
    receipt.receiptDetails.forEach((detail) => {
      const productName = detail.productName || 'Unknown'
      productSales[productName] = (productSales[productName] || 0) + detail.qty
    })
  })

  return Object.entries(productSales)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
})

// Compute Least Sale Products
const leastSaleProducts = computed(() => {
  const productSales: Record<string, number> = {}

  filteredReceipts.value.forEach((receipt) => {
    receipt.receiptDetails.forEach((detail) => {
      const productName = detail.productName || 'Unknown'
      productSales[productName] = (productSales[productName] || 0) + detail.qty
    })
  })

  return Object.entries(productSales)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5)
})

// Compute Total Amount and Average Transaction
const totalSalesVolume = computed(() =>
  filteredReceipts.value.reduce((sum, receipt) => sum + receipt.total, 0),
)
const averageTransactionValue = computed(() =>
  filteredReceipts.value.length > 0 ? totalSalesVolume.value / filteredReceipts.value.length : 0,
)

// Toggle Button Functions
const setDaily = () => {
  viewMode.value = 'daily'
  moveToggle('0')
  renderGraph()
}

const setMonthly = () => {
  viewMode.value = 'monthly'
  moveToggle('110px')
  renderGraph()
}

const moveToggle = (position: string) => {
  const btn = document.getElementById('btn') as HTMLElement
  if (btn) {
    btn.style.left = position
  }
}

// Navigation Functions
const previousPeriod = () => {
  if (viewMode.value === 'daily') {
    currentDate.value.setDate(currentDate.value.getDate() - 1)
  } else {
    currentDate.value.setMonth(currentDate.value.getMonth() - 1)
  }
  currentDate.value = new Date(currentDate.value)
}

const nextPeriod = () => {
  if (viewMode.value === 'daily') {
    currentDate.value.setDate(currentDate.value.getDate() + 1)
  } else {
    currentDate.value.setMonth(currentDate.value.getMonth() + 1)
  }
  currentDate.value = new Date(currentDate.value)
}

// Render Graph
const renderGraph = () => {
  const ctx = document.getElementById('salesGraph') as HTMLCanvasElement

  // Destroy existing chart before creating a new one
  if (chartInstance) {
    chartInstance.destroy()
  }

  const labels =
    viewMode.value === 'daily'
      ? Array.from({ length: 24 }, (_, hour) => `${hour}:00`)
      : Array.from(
          { length: new Date(currentYear.value, currentDate.value.getMonth() + 1, 0).getDate() },
          (_, i) => (i + 1).toString(),
        )

  const data =
    viewMode.value === 'daily'
      ? Array.from({ length: 24 }, (_, hour) => {
          return filteredReceipts.value
            .filter((receipt) => {
              const receiptDate = new Date(receipt.createdDate)
              return (
                receiptDate.getDate() === currentDate.value.getDate() &&
                receiptDate.getMonth() === currentDate.value.getMonth() &&
                receiptDate.getFullYear() === currentDate.value.getFullYear() &&
                receiptDate.getHours() === hour // ตรวจสอบชั่วโมง
              )
            })
            .reduce((sum, receipt) => sum + receipt.total, 0)
        })
      : Array.from({ length: labels.length }, (_, dayIndex) => {
          return filteredReceipts.value
            .filter((receipt) => {
              const receiptDate = new Date(receipt.createdDate)
              return (
                receiptDate.getDate() === dayIndex + 1 &&
                receiptDate.getMonth() === currentDate.value.getMonth() &&
                receiptDate.getFullYear() === currentDate.value.getFullYear()
              )
            })
            .reduce((sum, receipt) => sum + receipt.total, 0)
        })

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Sales',
          data,
          backgroundColor: 'rgba(36, 12, 16, 0.2)',
          borderColor: '#240c10',
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { title: { display: true, text: viewMode.value === 'daily' ? 'Hour' : 'Date' } },
        y: { title: { display: true, text: 'Sales (฿)' } },
      },
    },
  })
}
// Initialize and Watch Changes
onMounted(() => {
  setMonthly()
})

watch([viewMode, currentDate], renderGraph)
</script>

<style scoped>
.button-box {
  width: 220px;
  height: 50px;
  margin: 20px auto;
  position: relative;
  border-radius: 30px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toggle-btn {
  width: 50%;
  height: 100%;
  text-align: center;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-weight: bold;
  z-index: 10;
  color: #240c10; /* สีปกติ */
  transition: color 0.3s ease; /* กำหนด transition */
}

.toggle-btn.active {
  color: white; /* สีเมื่อเลือก */
}

.toggle-btn.inactive {
  color: #240c10; /* สีเมื่อไม่ได้เลือก */
}

#btn {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: #240c10; /* สี toggle */
  border-radius: 30px;
  transition: 0.3s ease; /* กำหนด transition */
}

.tables {
  display: flex;
  justify-content: space-between;
  gap: 20px; /* เพิ่มระยะห่างระหว่างตาราง */
}

.table {
  width: 32%; /* กำหนดขนาดตารางให้เท่ากัน */
  border: 1px solid #ddd; /* เส้นขอบของตาราง */
  border-radius: 8px; /* ขอบมน */
  background-color: white; /* สีพื้นหลังของตาราง */
  overflow: hidden; /* ป้องกันการล้นของเนื้อหา */
}

table {
  width: 100%;
  border-collapse: collapse; /* รวมเส้นขอบ */
}

.tables {
  display: flex;
  justify-content: space-between;
  gap: 20px; /* เพิ่มระยะห่างระหว่างตาราง */
}

.table {
  width: 32%; /* กำหนดขนาดตารางให้เท่ากัน */
  border: 1px solid #ddd; /* เส้นขอบของตาราง */
  border-radius: 8px; /* ขอบมน */
  background-color: white; /* สีพื้นหลังของตาราง */
  overflow: hidden; /* ป้องกันการล้นของเนื้อหา */
}

table {
  width: 100%;
  border-collapse: collapse; /* รวมเส้นขอบ */
}

.table-header {
  background-color: #240c10; /* สีน้ำตาล */
  color: white; /* สีข้อความ */
  text-align: center; /* จัดข้อความให้อยู่ตรงกลาง */
  font-weight: bold; /* ตัวหนา */
  padding: 10px; /* เพิ่มระยะห่างภายใน */
  font-size: 16px; /* ขนาดข้อความ */
}

thead th {
  border-bottom: 1px solid #ddd; /* เส้นขอบด้านล่างของหัวตาราง */
}

tbody td {
  text-align: left; /* จัดข้อความชิดซ้าย */
  padding: 10px; /* ระยะห่างในแต่ละเซลล์ */
  font-size: 14px; /* ขนาดข้อความ */
}

/* สลับสีพื้นหลังของแถว */
tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}

tbody tr:nth-child(even) {
  background-color: #ffffff;
}

/* ลบเส้นขอบระหว่างแถว */
tbody tr {
  border: none;
}
.overview-graph {
  margin: 20px 0;
}

.graph-content {
  height: 300px;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
