import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CheckInOut } from 'src/models'

export const useCheckInOutStore = defineStore('checkInOut', () => {
  const InOutNotPaidByID = ref<CheckInOut[]>([])
  const checkInOutData = ref<CheckInOut[]>([
    {
      id: 1,
      userId: 2,
      name: 'chan',
      checkInTime: '2025-01-08 08:33:21',
      checkOutTime: '2025-01-08 16:45:47',
      totalHours: 8,
      salaryId: 0,
    },
    {
      id: 2,
      userId: 6,
      name: 'bigu',
      checkInTime: '2025-01-08 08:00:00',
      checkOutTime: '2025-01-08 16:00:00',
      totalHours: 8,
      salaryId: 0,
    },
    {
      id: 3,
      userId: 1,
      name: 'New',
      checkInTime: '2025-01-08 09:00:00',
      checkOutTime: '2025-01-08 17:00:00',
      totalHours: 8,
      salaryId: 0,
    },
  ])

  function addCheckIn(employeeName: string) {
    const currentTime = new Date().toLocaleTimeString()
    const newCheckIn: CheckInOut = {
      id: checkInOutData.value.length + 1,
      userId: 0,
      name: employeeName,
      checkInTime: currentTime,
      checkOutTime: '',
      totalHours: 0,
      salaryId: 0,
    }
    checkInOutData.value.push(newCheckIn)
  }

  function addCheckOut(id: number) {
    const currentTime = new Date()
    const entry = checkInOutData.value.find((entry) => entry.id === id && entry.checkOutTime === '')

    if (entry) {
      entry.checkOutTime = formatTime(currentTime)

      // แปลง checkInTime string ให้เป็น Date object
      const checkInDate = new Date(`1970-01-01T${entry.checkInTime}Z`)

      // คำนวณความแตกต่างของเวลาเป็น milliseconds
      const totalMilliseconds = currentTime.getTime() - checkInDate.getTime()

      // แปลง milliseconds เป็นชั่วโมงในรูปแบบทศนิยม
      const totalHours = totalMilliseconds / (1000 * 60 * 60) // 1 hour = 3600000 ms

      // เก็บค่า totalHours เป็นตัวเลข
      entry.totalHours = totalHours

      console.log(
        `Check-in: ${entry.checkInTime}, Check-out: ${entry.checkOutTime}, Total hours: ${entry.totalHours.toFixed(2)}`,
      )
    } else {
      console.error('No check-in entry found or already checked out.')
    }
  }

  function formatTime(date: Date): string {
    return `${padToTwoDigits(date.getHours())}:${padToTwoDigits(date.getMinutes())}:${padToTwoDigits(date.getSeconds())}`
  }

  function padToTwoDigits(num: number): string {
    return num.toString().padStart(2, '0')
  }

  function removeEntry(id: number) {
    const index = checkInOutData.value.findIndex((entry) => entry.id === id)
    if (index !== -1) {
      checkInOutData.value.splice(index, 1)
    }
  }
  function updateInOutNotPaidByID(id: number) {
    InOutNotPaidByID.value = checkInOutData.value.filter(
      (CheckInOut) => CheckInOut.id === id && CheckInOut.salaryId === 0,
    )
  }
  function getTotalHoursByUserID(userId: number): number {
    return checkInOutData.value
      .filter((entry) => entry.id === userId && entry.salaryId === 0)
      .reduce((sum, entry) => sum + Number(entry.totalHours), 0)
  }
  function markEntriesAsPaid(userId: number) {
    checkInOutData.value.forEach((entry) => {
      if (entry.id === userId && entry.salaryId === 0) {
        entry.salaryId = 1
      }
    })
  }
  return {
    checkInOutData,
    addCheckIn,
    addCheckOut,
    removeEntry,
    InOutNotPaidByID,
    updateInOutNotPaidByID,
    markEntriesAsPaid,
    getTotalHoursByUserID,
  }
})
