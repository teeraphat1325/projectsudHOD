<template>
  <q-page padding>
    <div class="header-title">Salary Management</div>
    <div class="search-container">
      <q-input filled v-model="search" label="Search" debounce="300" dense>
        <template v-slot:append>
          <q-icon name="search" @click="handleSearch" class="cursor-pointer" />
        </template>
      </q-input>
    </div>

    <div>
      <q-table :columns="columns" :rows="userStore.users">
        <template v-slot:body-cell-operation="props">
          <q-td class="operation-cell">
            <q-btn icon="paid" class="pay-btn" @click="openDialog(props.row)">Pay</q-btn>
            <q-btn icon="assignment_late" class="info-btn" @click="openDialog2(props.row)"
              >Info</q-btn
            >
          </q-td>
        </template>
      </q-table>
    </div>
    <br />
    <div>
      <h5>All salary payments</h5>
      <q-table :columns="columns3" :rows="salaryStore.salaries" />
    </div>

    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 1000px">
        <q-card-section>
          <q-table :columns="columns2" :rows="salaryStore.InOutNotPaidByID" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="processPayment" class="q-gutter-md">
            <q-input
              filled
              v-model="totalHours"
              label="Total Hours *"
              disable
              lazy-rules
              :rules="[(val) => (val && val > 0) || 'Invalid total hours']"
            />
            <q-input
              filled
              v-model="payPerHour"
              label="Pay Per Hour"
              disable
              lazy-rules
              :rules="[(val) => (val !== null && val > 0) || 'Invalid pay rate']"
            />
            <div class="row justify-between items-center">
              <h6 style="margin: 0">Total : {{ total }}</h6>
              <div>
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn label="Pay" type="submit" color="green" />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialog2" persistent>
      <q-card style="min-width: 1000px">
        <q-card-section>
          <q-table :columns="columns3" :rows="salaryStore.SelectSalaryByID" />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Exit" v-close-popup color="red" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Notify } from 'quasar'
import type { QTableColumn } from 'quasar'
import type { Salary, User } from 'src/models'
import { useSalaryStore } from 'src/stores/salaryStore'
import { useUserStore } from 'src/stores/userStore'

// State
const dialog = ref(false)
const dialog2 = ref(false)
const totalHours = ref(0)
const payPerHour = ref(45)
const total = computed(() => totalHours.value * payPerHour.value) // ใช้ computed อย่างถูกต้อง
const selectedUserID = ref(0)
const search = ref<string>('')

onMounted(async () => {
  await userStore.getUsers()
  await salaryStore.getSalaries()
})

// Stores
const userStore = useUserStore()
const salaryStore = useSalaryStore()

// Columns
const columns: QTableColumn[] = [
  { name: 'id', field: 'id', label: 'ID', align: 'center' },
  { name: 'name', field: 'name', label: 'Name', align: 'center' },
  { name: 'gender', field: 'gender', label: 'Gender', align: 'center' },
  { name: 'role', field: 'role', label: 'Role', align: 'center' },
  { name: 'operation', field: 'operation', label: 'Operation', align: 'center' },
]

const columns2: QTableColumn[] = [
  { name: 'id', field: 'id', label: 'ID', align: 'center' },
  { name: 'name', field: 'name', label: 'Name', align: 'center' },
  { name: 'checkInTime', field: 'checkInTime', label: 'Check In Time', align: 'center' },
  { name: 'checkOutTime', field: 'checkOutTime', label: 'Check Out Time', align: 'center' },
  { name: 'totalHours', field: 'totalHours', label: 'Total Hours', align: 'center' },
  { name: 'salaryId', field: 'salaryId', label: 'Salary ID', align: 'center' },
]

const columns3: QTableColumn[] = [
  { name: 'id', field: 'id', label: 'ID', align: 'center' },
  { name: 'userID', field: 'userID', label: 'User ID', align: 'center' },
  { name: 'paydate', field: 'payDate', label: 'Pay Date', align: 'center' },
  { name: 'amount', field: 'amount', label: 'Amount', align: 'center' },
]

// Functions
function openDialog(row: User) {
  if (row.id !== undefined) {
    selectedUserID.value = row.id
  } else {
    // คุณสามารถตั้งค่าความปลอดภัยให้กับ selectedUserID หรือแสดง error message
    console.error('User ID is undefined')
    return
  }
  salaryStore.updateInOutNotPaidByID(selectedUserID.value)

  // ดึงข้อมูล Check-In/Out ของผู้ใช้งานจาก store
  const userCheckIns = salaryStore.InOutNotPaidByID

  if (!userCheckIns || userCheckIns.length === 0) {
    Notify.create({
      message: 'No unpaid Check-In/Out records found for this user.',
      color: 'warning',
      position: 'top',
    })
    dialog.value = false
    return
  }

  // คำนวณ Total Hours ใหม่จากข้อมูลล่าสุด
  const hours = userCheckIns.reduce((sum, entry) => sum + Number(entry.totalHours || 0), 0)
  totalHours.value = hours

  dialog.value = true
}

function openDialog2(row: User) {
  dialog2.value = true
  if (row.id !== undefined) {
    selectedUserID.value = row.id
  } else {
    // คุณสามารถตั้งค่าความปลอดภัยให้กับ selectedUserID หรือแสดง error message
    console.error('User ID is undefined')
    return
  }
  salaryStore.updateSelectSalaryByID(selectedUserID.value)
}

function handleSearch() {
  userStore.updateFilteredUsers(search.value)
}

function processPayment() {
  if (total.value <= 0) {
    Notify.create({
      message: 'Invalid total amount.',
      color: 'negative',
      position: 'top',
    })
    return
  }

  // const alreadyPaid = salaryStore.salaries.some(
  //   (salary) => salary.userID === selectedUserID.value && salary.isPaid,
  // )

  // if (alreadyPaid) {
  //   Notify.create({
  //     message: 'This user has already been paid.',
  //     color: 'warning',
  //     position: 'top',
  //   })
  //   return
  // }

  // ดึงวันที่วันนี้ให้เป็น string เสมอ
  const todayDate = new Date().toISOString().split('T')[0] || ''

  const newSalary: Salary = {
    id: salaryStore.salaries.length + 1,
    userID: selectedUserID.value,
    paydate: todayDate, // กำหนดให้เป็น string แน่นอน
    amount: total.value,
    totalHours: totalHours.value,
  }

  salaryStore.addSalary(newSalary)
  salaryStore.markEntriesAsPaid(selectedUserID.value)

  dialog.value = false
}
</script>

<style scoped>
.header-title {
  margin-top: 10px;
  font-weight: bold;
  font-size: 2rem;
}

.search-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;

  .q-input {
    width: 500px;
  }
}

.operation-cell {
  width: 300px;
}

.pay-btn {
  margin-right: 5px;
  background-color: #3cd100;
  color: white;
}

.info-btn {
  background-color: #2079e4;
  color: white;
}
</style>
