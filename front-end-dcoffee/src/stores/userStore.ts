import { defineStore, acceptHMRUpdate } from 'pinia'
import { Loading, Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { type User } from 'src/models'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const filteredUsers = ref<User[]>([])
  const currentUser = ref<User | null>(null)

  function setCurrentUser(user: User | null) {
    currentUser.value = user
  }
  // ดึงข้อมูลผู้ใช้ทั้งหมด
  async function getUsers() {
    try {
      Loading.show({
        message: 'กำลังโหลดข้อมูลผู้ใช้...',
      })

      const res = await api.get('/users')
      users.value = res.data
      await getUser()
    } catch (error) {
      console.error('Error fetching users:', error)
      Notify.create({
        message: 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้',
        color: 'negative',
        position: 'top',
      })

      return []
    } finally {
      Loading.hide()
    }
  }

  // ค้นหาผู้ใช้ด้วยอีเมล
  async function getUserByEmail(email: string): Promise<User | undefined> {
    try {
      // ถ้า users array ว่างเปล่า ให้โหลดข้อมูลก่อน
      if (users.value.length === 0) {
        await getUsers()
      }

      // ค้นหาในข้อมูลที่มีอยู่
      const user = users.value.find((item) => item.email === email)
      if (user) return user

      // ถ้าไม่พบในข้อมูลที่มีอยู่ ให้ลองเรียก API เฉพาะ
      const res = await api.get(`/users?email=${email}`)
      console.log('API Response for email search:', res.data)

      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data[0]
      } else if (typeof res.data === 'object' && res.data !== null) {
        return res.data
      }

      return undefined
    } catch (err) {
      console.error('Error fetching user by email:', err)
      return undefined
    }
  }

  // เพิ่มผู้ใช้ใหม่
  async function addUser(user: User) {
    try {
      Loading.show()
      delete user.id
      const res = await api.post('/users', user)
      console.log(res.data)
      // เพิ่มผู้ใช้ใหม่ไปยังรายการ
      // users.value.push(res.data)
      await getUser()

      // อัปเดตรายการผู้ใช้ที่กรองแล้ว
      updateFilteredUsers('')

      Notify.create({
        message: 'เพิ่มผู้ใช้งานสำเร็จ',
        color: 'positive',
        position: 'top',
      })
    } catch (error) {
      console.error('Error adding user:', error)
      Notify.create({
        message: 'เพิ่มผู้ใช้งานไม่สำเร็จ',
        color: 'negative',
        position: 'top',
      })

      throw error
    } finally {
      Loading.hide()
    }
  }

  // อัปเดตข้อมูลผู้ใช้
  async function updateUser(user: User) {
    try {
      Loading.show({
        message: 'กำลังอัปเดตข้อมูลผู้ใช้...',
      })

      const res = await api.patch(`/users/${user.id}`, user)
      console.log(res.data)
      await getUser()
      // อัปเดตข้อมูลผู้ใช้ในรายการ
      // users.value = users.value.map((u) => (u.id === user.id ? res.data : u))

      // อัปเดตรายการผู้ใช้ที่กรองแล้ว
      updateFilteredUsers('')

      Notify.create({
        message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ',
        color: 'positive',
        position: 'top',
      })

      return res.data
    } catch (error) {
      console.error('Error updating user:', error)
      Notify.create({
        message: 'แก้ไขผู้ใช้งานไม่สำเร็จ',
        color: 'negative',
        position: 'top',
      })

      throw error
    } finally {
      Loading.hide()
    }
  }

  // ลบผู้ใช้
  async function deleteUser(u: User) {
    try {
      Loading.show({
        message: 'กำลังลบผู้ใช้...',
      })
      const res = await api.delete(`/users/${u.id}`)
      console.log(res.data)
      // ลบผู้ใช้ออกจากรายการ
      // users.value = users.value.filter((u) => u.id !== u.id)
      await getUser()

      // อัปเดตรายการผู้ใช้ที่กรองแล้ว
      updateFilteredUsers('')

      Notify.create({
        message: 'ลบผู้ใช้งานสำเร็จ',
        color: 'positive',
        position: 'top',
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      Notify.create({
        message: 'ลบผู้ใช้งานไม่สำเร็จ',
        color: 'negative',
        position: 'top',
      })

      throw error
    } finally {
      Loading.hide()
    }
  }

  // อัปเดตรายการผู้ใช้ที่กรองแล้ว
  function updateFilteredUsers(query: string) {
    if (!query) {
      // ถ้าไม่มี query ให้แสดงผู้ใช้ทั้งหมด
      filteredUsers.value = [...users.value]
      return
    }

    const isNumericQuery = !isNaN(Number(query))
    const queryLowerCase = query.toLowerCase()

    filteredUsers.value = users.value.filter((user) => {
      if (isNumericQuery) {
        // ถ้า query เป็นตัวเลข ให้ค้นหาตาม ID
        return user.id === Number(query)
      }

      // ค้นหาตามชื่อ อีเมล หรือบทบาท
      return (
        user.name.toLowerCase().includes(queryLowerCase) ||
        user.email.toLowerCase().includes(queryLowerCase) ||
        (queryLowerCase === 'admin' && user.roles?.some((r) => r.id === 1)) ||
        (queryLowerCase === 'user' && user.roles?.some((r) => r.id === 2))
      )
    })
  }

  async function getUser() {
    try {
      Loading.show()
      const res = await api.get('/users')
      console.log(res.data)
      users.value = res.data
    } catch (err) {
      console.error(err)
      console.log('finally')
      Loading.hide()
      Notify.create({
        color: 'negative',
        position: 'top',
        message: 'Loading failed',
        icon: 'report_problem',
      })
    } finally {
      console.log('finally')
      Loading.hide()
    }
  }
  getUser()
  return {
    users,
    filteredUsers,
    getUsers,
    getUserByEmail,
    addUser,
    updateUser,
    deleteUser,
    updateFilteredUsers,
    setCurrentUser,
    currentUser,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
