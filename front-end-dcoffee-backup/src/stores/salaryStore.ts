import { defineStore, acceptHMRUpdate } from 'pinia'
import { Loading, Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { type Salary } from 'src/models'
import { ref } from 'vue'

export const useSalaryStore = defineStore('SalaryStore', () => {
  interface CheckInOut {
    id: number
    userId: number
    name: string
    checkInTime: string
    checkOutTime: string
    totalHours: string | number
    salaryId: number
  }

  const SelectSalaryByID = ref<Salary[]>([])
  const salaries = ref<Salary[]>([])
  async function getSalaries() {
    try {
      const res = await api.get('/salaries')
      salaries.value = res.data
    } catch (error) {
      console.error('Error fetching salaries:', error)
      Notify.create({
        message: 'ไม่สามารถโหลดข้อมูลเงินเดือนได้',
        color: 'negative',
        position: 'top',
      })
      return []
    }
  }
  function updateSelectSalaryByID(id: number) {
    SelectSalaryByID.value = salaries.value.filter((Salary) => Salary.userID === id)
  }
  async function addSalary(newSalary: Salary) {
    console.log('newSalary', newSalary)
    try {
      Loading.show()
      const salaryData = {
        payDate: newSalary.paydate,
        amount: newSalary.amount,
        userID: newSalary.userID,
        totalHours: newSalary.totalHours,
      }

      const res = await api.post('/salaries', salaryData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log('res', res)
      await getSalaries()
      Notify.create({
        message: 'pay success',
        color: 'positive',
        position: 'top',
        icon: 'check',
      })
    } catch (error) {
      console.error(error)
      Notify.create({
        color: 'negative',
        position: 'top',
        message: 'pay failed',
        icon: 'report_problem',
      })
    } finally {
      console.log('finally')
      Loading.hide()
    }
  }

  ///////////////////////////////////////////////////
  //mockup data CheckInOut

  const checkInOutData = ref<CheckInOut[]>([
    {
      id: 1,
      userId: 1,
      name: 'New',
      checkInTime: '2025-01-08 08:33:21',
      checkOutTime: '2025-01-08 16:45:47',
      totalHours: '8',
      salaryId: 0,
    },
    {
      id: 2,
      userId: 2,
      name: 'chan',
      checkInTime: '2025-01-08 08:00:00',
      checkOutTime: '2025-01-08 16:00:00',
      totalHours: '8',
      salaryId: 0,
    },
    {
      id: 3,
      userId: 3,
      name: 'newnewnew',
      checkInTime: '2025-01-08 09:00:00',
      checkOutTime: '2025-01-08 17:00:00',
      totalHours: '8',
      salaryId: 0,
    },
    {
      id: 4,
      userId: 4,
      name: 'John Doe',
      checkInTime: '2025-01-09 09:00:00',
      checkOutTime: '2025-01-09 20:00:00',
      totalHours: '11',
      salaryId: 0,
    },
    {
      id: 4,
      userId: 4,
      name: 'John Doe',
      checkInTime: '2025-01-09 09:00:00',
      checkOutTime: '2025-01-09 20:00:00',
      totalHours: '45',
      salaryId: 0,
    },
  ])
  const InOutNotPaidByID = ref<CheckInOut[]>([])

  function updateInOutNotPaidByID(id: number) {
    InOutNotPaidByID.value = checkInOutData.value.filter(
      (CheckInOut) => CheckInOut.userId === id && CheckInOut.salaryId === 0,
    )
  }
  function getTotalHoursByUserID(userId: number): number {
    return checkInOutData.value
      .filter((entry) => entry.userId === userId && entry.salaryId === 0)
      .reduce((sum, entry) => sum + Number(entry.totalHours), 0)
  }

  function markEntriesAsPaid(userId: number) {
    checkInOutData.value.forEach((entry) => {
      if (entry.userId === userId && entry.salaryId === 0) {
        entry.salaryId = 1
      }
    })
  }

  return {
    salaries,
    SelectSalaryByID,
    updateSelectSalaryByID,
    addSalary,
    getSalaries,
    /////////////////////////////////////////////
    checkInOutData,
    InOutNotPaidByID,
    updateInOutNotPaidByID,
    getTotalHoursByUserID,
    markEntriesAsPaid,
    ///////////////////////////////////////////////////
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSalaryStore, import.meta.hot))
}
