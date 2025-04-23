import { defineStore, acceptHMRUpdate } from 'pinia'
import { type Receipt } from 'src/models'

export const useReceiptStore = defineStore('receiptStore', {
  state: () => ({
    receipts: [
      {
        id: 1,
        createdDate: new Date('2025-01-01T14:30:00'),
        cash: 200,
        change: 70, // cash - total
        totalQty: 3,
        userId: 1,
        customerId: 1,
        customer: {
          id: 1,
          name: 'chanyut',
          phone: '0999999999',
          point: 10,
        },
        receiptDetails: [
          {
            id: 1,
            productId: 1,
            productName: 'Americano',
            productPrice: 40,
            qty: 2,
            totalPrice: 80, // 40 * 2
            receiptId: 1,
            productSize: 'M',
            productSweetLevel: 'Low Sugar',
            productType: 'Hot',
          },
          {
            id: 2,
            productId: 7,
            productName: 'Bagel',
            productPrice: 25,
            qty: 2,
            totalPrice: 50, // 25 * 2
            receiptId: 1,
            productSize: 'N/A',
            productSweetLevel: 'N/A',
            productType: 'N/A',
          },
        ],
        total: 130, // รวม totalPrice ของทุก product ใน receiptDetails
      },
      {
        id: 2,
        createdDate: new Date('2025-01-02T23:59:59'),
        cash: 100,
        change: 10, // cash - total
        totalQty: 2,
        userId: 2,
        customerId: 2,
        customer: {
          id: 2,
          name: 'pimruda',
          phone: '0999999998',
          point: 20,
        },
        receiptDetails: [
          {
            id: 3,
            productId: 2,
            productName: 'Latte',
            productPrice: 45,
            qty: 2,
            totalPrice: 90, // 45 * 2
            receiptId: 2,
            productSize: 'L',
            productSweetLevel: 'Normal Sugar',
            productType: 'Cold',
          },
        ],
        total: 90, // รวม totalPrice ของทุก product ใน receiptDetails
      },
      {
        id: 3,
        createdDate: new Date('2025-01-03T14:10:20'),
        cash: 150,
        change: 20, // cash - total
        totalQty: 3,
        userId: 1,
        customerId: 3,
        customer: {
          id: 3,
          name: 'natthaphon',
          phone: '0999999991',
          point: 30,
        },
        receiptDetails: [
          {
            id: 4,
            productId: 3,
            productName: 'Mocha',
            productPrice: 50,
            qty: 2,
            totalPrice: 100, // 50 * 2
            receiptId: 3,
            productSize: 'S',
            productSweetLevel: 'Extra Sugar',
            productType: 'Hot',
          },
          {
            id: 5,
            productId: 8,
            productName: 'Muffin',
            productPrice: 30,
            qty: 1,
            totalPrice: 30, // 30 * 1
            receiptId: 3,
            productSize: 'N/A',
            productSweetLevel: 'N/A',
            productType: 'N/A',
          },
        ],
        total: 130, // รวม totalPrice ของทุก product ใน receiptDetails
      },
      {
        id: 4,
        createdDate: new Date('2025-01-04T08:30:00'),
        cash: 300,
        change: 90, // cash - total
        totalQty: 4,
        userId: 1,
        customerId: 1,
        customer: {
          id: 1,
          name: 'chanyut',
          phone: '0999999999',
          point: 15,
        },
        receiptDetails: [
          {
            id: 6,
            productId: 4,
            productName: 'Cappuccino',
            productPrice: 35,
            qty: 4,
            totalPrice: 140, // 35 * 4
            receiptId: 4,
            productSize: 'M',
            productSweetLevel: 'Normal Sugar',
            productType: 'Hot',
          },
        ],
        total: 140,
      },
      {
        id: 5,
        createdDate: new Date('2025-01-05T12:13:00'),
        cash: 250,
        change: 80, // cash - total
        totalQty: 5,
        userId: 2,
        customerId: 2,
        customer: {
          id: 2,
          name: 'pimruda',
          phone: '0999999998',
          point: 25,
        },
        receiptDetails: [
          {
            id: 7,
            productId: 1,
            productName: 'Americano',
            productPrice: 40,
            qty: 3,
            totalPrice: 120, // 40 * 3
            receiptId: 5,
            productSize: 'S',
            productSweetLevel: 'Low Sugar',
            productType: 'Hot',
          },
          {
            id: 8,
            productId: 7,
            productName: 'Bagel',
            productPrice: 25,
            qty: 1,
            totalPrice: 25, // 25 * 1
            receiptId: 5,
            productSize: 'N/A',
            productSweetLevel: 'N/A',
            productType: 'N/A',
          },
        ],
        total: 145,
      },
      {
        id: 6,
        createdDate: new Date('2025-01-06T10:50:20'),
        cash: 400,
        change: 90, // cash - total
        totalQty: 6,
        userId: 1,
        customerId: 3,
        customer: {
          id: 3,
          name: 'natthaphon',
          phone: '0999999991',
          point: 35,
        },
        receiptDetails: [
          {
            id: 9,
            productId: 2,
            productName: 'Latte',
            productPrice: 45,
            qty: 5,
            totalPrice: 225, // 45 * 5
            receiptId: 6,
            productSize: 'L',
            productSweetLevel: 'Normal Sugar',
            productType: 'Cold',
          },
          {
            id: 10,
            productId: 9,
            productName: 'Baguette',
            productPrice: 35,
            qty: 2,
            totalPrice: 70, // 35 * 2
            receiptId: 6,
            productSize: 'N/A',
            productSweetLevel: 'N/A',
            productType: 'N/A',
          },
        ],
        total: 295,
      },
      {
        id: 7,
        createdDate: new Date('2025-01-07T11:50:23'),
        cash: 500,
        change: 150, // cash - total
        totalQty: 8,
        userId: 2,
        customerId: 1,
        customer: {
          id: 1,
          name: 'chanyut',
          phone: '0999999999',
          point: 20,
        },
        receiptDetails: [
          {
            id: 11,
            productId: 3,
            productName: 'Mocha',
            productPrice: 50,
            qty: 4,
            totalPrice: 200, // 50 * 4
            receiptId: 7,
            productSize: 'M',
            productSweetLevel: 'Low Sugar',
            productType: 'Hot',
          },
          {
            id: 12,
            productId: 5,
            productName: 'Espresso',
            productPrice: 40,
            qty: 3,
            totalPrice: 120, // 40 * 3
            receiptId: 7,
            productSize: 'S',
            productSweetLevel: 'Normal Sugar',
            productType: 'Hot',
          },
        ],
        total: 320,
      },
      {
        id: 8,
        createdDate: new Date('2025-01-08T14:10:26'),
        cash: 450,
        change: 170, // cash - total
        totalQty: 9,
        userId: 1,
        customerId: 2,
        customer: {
          id: 2,
          name: 'pimruda',
          phone: '0999999998',
          point: 30,
        },
        receiptDetails: [
          {
            id: 13,
            productId: 4,
            productName: 'Cappuccino',
            productPrice: 35,
            qty: 6,
            totalPrice: 210, // 35 * 6
            receiptId: 8,
            productSize: 'L',
            productSweetLevel: 'Normal Sugar',
            productType: 'Cold',
          },
          {
            id: 14,
            productId: 6,
            productName: 'Croissant',
            productPrice: 20,
            qty: 5,
            totalPrice: 100, // 20 * 5
            receiptId: 8,
            productSize: 'N/A',
            productSweetLevel: 'N/A',
            productType: 'N/A',
          },
        ],
        total: 310,
      },
      {
        id: 9,
        createdDate: new Date('2025-01-09T12:10:11'),
        cash: 500,
        change: 120,
        totalQty: 5,
        userId: 2,
        customerId: 1,
        customer: {
          id: 1,
          name: 'chanyut',
          phone: '0999999999',
          point: 40,
        },
        receiptDetails: [
          {
            id: 15,
            productId: 1,
            productName: 'Americano',
            productPrice: 40,
            qty: 2,
            totalPrice: 80,
            receiptId: 9,
            productSize: 'M',
            productSweetLevel: 'Low Sugar',
            productType: 'Hot',
          },
          {
            id: 16,
            productId: 3,
            productName: 'Mocha',
            productPrice: 50,
            qty: 3,
            totalPrice: 150,
            receiptId: 9,
            productSize: 'S',
            productSweetLevel: 'Extra Sugar',
            productType: 'Hot',
          },
        ],
        total: 230,
      },
      {
        id: 10,
        createdDate: new Date('2025-01-10T13:32:00'),
        cash: 300,
        change: 50,
        totalQty: 4,
        userId: 1,
        customerId: 3,
        customer: {
          id: 3,
          name: 'natthaphon',
          phone: '0999999991',
          point: 50,
        },
        receiptDetails: [
          {
            id: 17,
            productId: 4,
            productName: 'Cappuccino',
            productPrice: 35,
            qty: 4,
            totalPrice: 140,
            receiptId: 10,
            productSize: 'M',
            productSweetLevel: 'Normal Sugar',
            productType: 'Hot',
          },
        ],
        total: 250,
      },
      {
        id: 11,
        createdDate: new Date('2025-01-11T18:29:30'),
        cash: 350,
        change: 100,
        totalQty: 6,
        userId: 2,
        customerId: 2,
        customer: {
          id: 2,
          name: 'pimruda',
          phone: '0999999998',
          point: 60,
        },
        receiptDetails: [
          {
            id: 18,
            productId: 2,
            productName: 'Latte',
            productPrice: 45,
            qty: 3,
            totalPrice: 135,
            receiptId: 11,
            productSize: 'L',
            productSweetLevel: 'Normal Sugar',
            productType: 'Cold',
          },
          {
            id: 19,
            productId: 7,
            productName: 'Bagel',
            productPrice: 25,
            qty: 3,
            totalPrice: 75,
            receiptId: 11,
            productSize: 'N/A',
            productSweetLevel: 'N/A',
            productType: 'N/A',
          },
        ],
        total: 210,
      },
      {
        id: 12,
        createdDate: new Date('2025-01-12T18:10:12'),
        cash: 400,
        change: 150,
        totalQty: 7,
        userId: 1,
        customerId: 1,
        customer: {
          id: 1,
          name: 'chanyut',
          phone: '0999999999',
          point: 70,
        },
        receiptDetails: [
          {
            id: 20,
            productId: 1,
            productName: 'Americano',
            productPrice: 40,
            qty: 4,
            totalPrice: 160,
            receiptId: 12,
            productSize: 'L',
            productSweetLevel: 'Normal Sugar',
            productType: 'Cold',
          },
          {
            id: 21,
            productId: 8,
            productName: 'Muffin',
            productPrice: 30,
            qty: 3,
            totalPrice: 90,
            receiptId: 12,
            productSize: 'N/A',
            productSweetLevel: 'N/A',
            productType: 'N/A',
          },
        ],
        total: 250,
      },
      {
        id: 13,
        createdDate: new Date('2025-01-13T16:30:23'),
        cash: 550,
        change: 200,
        totalQty: 6,
        userId: 2,
        customerId: 3,
        customer: {
          id: 3,
          name: 'natthaphon',
          phone: '0999999991',
          point: 80,
        },
        receiptDetails: [
          {
            id: 22,
            productId: 5,
            productName: 'Espresso',
            productPrice: 40,
            qty: 5,
            totalPrice: 200,
            receiptId: 13,
            productSize: 'M',
            productSweetLevel: 'Normal Sugar',
            productType: 'Hot',
          },
        ],
        total: 350,
      },{
        id: 14,
        createdDate: new Date('2025-01-14T09:15:00'),
        cash: 150,
        change: 20, // cash - total
        totalQty: 3,
        userId: 1,
        customerId: 2, // มีสมาชิก
        customer: {
          id: 2,
          name: 'pimruda',
          phone: '0999999998',
          point: 25,
        },
        receiptDetails: [
          {
            id: 23,
            productId: 6,
            productName: 'Croissant',
            productPrice: 20,
            qty: 3,
            totalPrice: 60, // 20 * 3
            receiptId: 14,
            productSize: 'N/A',
            productSweetLevel: 'N/A',
            productType: 'N/A',
          },
          {
            id: 24,
            productId: 5,
            productName: 'Espresso',
            productPrice: 40,
            qty: 2,
            totalPrice: 80, // 40 * 2
            receiptId: 14,
            productSize: 'M',
            productSweetLevel: 'Low Sugar',
            productType: 'Hot',
          },
        ],
        total: 140, // รวม totalPrice ของทุก product ใน receiptDetails
      },
      {
        id: 15,
        createdDate: new Date('2025-01-14T11:45:00'),
        cash: 300,
        change: 60, // cash - total
        totalQty: 6,
        userId: 2,

        receiptDetails: [
          {
            id: 25,
            productId: 12,
            productName: 'Sandwich',
            productPrice: 55,
            qty: 4,
            totalPrice: 220, // 55 * 4
            receiptId: 15,
            productSize: 'N/A',
            productSweetLevel: 'N/A',
            productType: 'N/A',
          },
          {
            id: 26,
            productId: 19,
            productName: 'Milk Tea',
            productPrice: 30,
            qty: 2,
            totalPrice: 60, // 30 * 2
            receiptId: 15,
            productSize: 'M',
            productSweetLevel: '2',
            productType: 'C',
          },
        ],
        total: 280,
      },
      {
        id: 16,
        createdDate: new Date('2025-01-14T14:20:00'),
        cash: 500,
        change: 130, // cash - total
        totalQty: 10,
        userId: 1,
        customerId: 3, // มีสมาชิก
        customer: {
          id: 3,
          name: 'natthaphon',
          phone: '0999999991',
          point: 50,
        },
        receiptDetails: [
          {
            id: 27,
            productId: 3,
            productName: 'Mocha',
            productPrice: 50,
            qty: 5,
            totalPrice: 250, // 50 * 5
            receiptId: 16,
            productSize: 'L',
            productSweetLevel: '3',
            productType: 'Cold',
          },
          {
            id: 28,
            productId: 18,
            productName: 'Brownie',
            productPrice: 25,
            qty: 10,
            totalPrice: 250, // 25 * 10
            receiptId: 16,
            productSize: 'N/A',
            productSweetLevel: 'N/A',
            productType: 'N/A',
          },
        ],
        total: 370,
      },
      {
        id: 17,
        createdDate: new Date('2025-01-14T16:30:00'),
        cash: 400,
        change: 50, // cash - total
        totalQty: 7,
        userId: 2,

        receiptDetails: [
          {
            id: 29,
            productId: 2,
            productName: 'Latte',
            productPrice: 45,
            qty: 4,
            totalPrice: 180, // 45 * 4
            receiptId: 17,
            productSize: 'M',
            productSweetLevel: '2',
            productType: 'Hot',
          },
          {
            id: 30,
            productId: 14,
            productName: 'Salad',
            productPrice: 40,
            qty: 3,
            totalPrice: 120, // 40 * 3
            receiptId: 17,
            productSize: 'N/A',
            productSweetLevel: 'N/A',
            productType: 'N/A',
          },
        ],
        total: 350,
      },
      {
        id: 18,
        createdDate: new Date('2025-01-14T18:45:00'),
        cash: 200,
        change: 20, // cash - total
        totalQty: 4,
        userId: 1,
        customerId: 1, // มีสมาชิก
        customer: {
          id: 1,
          name: 'chanyut',
          phone: '0999999999',
          point: 30,
        },
        receiptDetails: [
          {
            id: 31,
            productId: 7,
            productName: 'Bagel',
            productPrice: 25,
            qty: 4,
            totalPrice: 100, // 25 * 4
            receiptId: 18,
            productSize: 'N/A',
            productSweetLevel: 'N/A',
            productType: 'N/A',
          },
          {
            id: 32,
            productId: 16,
            productName: 'Hot Chocolate',
            productPrice: 30,
            qty: 3,
            totalPrice: 90, // 30 * 3
            receiptId: 18,
            productSize: 'M',
            productSweetLevel: '2',
            productType: 'Hot',
          },
        ],
        total: 180,
      },
      {
        id: 19,
        createdDate: new Date('2025-01-14T21:15:00'),
        cash: 150,
        change: 10, // cash - total
        totalQty: 2,
        userId: 2,

        receiptDetails: [
          {
            id: 33,
            productId: 11,
            productName: 'Pizza Slice',
            productPrice: 50,
            qty: 1,
            totalPrice: 50, // 50 * 1
            receiptId: 19,
            productSize: 'N/A',
            productSweetLevel: 'N/A',
            productType: 'N/A',
          },
          {
            id: 34,
            productId: 20,
            productName: 'Grilled Cheese',
            productPrice: 45,
            qty: 2,
            totalPrice: 90, // 45 * 2
            receiptId: 19,
            productSize: 'N/A',
            productSweetLevel: 'N/A',
            productType: 'N/A',
          },
        ],
        total: 140,
      },
      {
        id: 20,
        createdDate: new Date('2025-01-14T22:00:00'),
        cash: 250,
        change: 75, // cash - total
        totalQty: 3,
        userId: 1,

        receiptDetails: [
          {
            id: 35,
            productId: 19,
            productName: 'Milk Tea',
            productPrice: 30,
            qty: 2,
            totalPrice: 60, // 30 * 2
            receiptId: 20,
            productSize: 'M',
            productSweetLevel: '3',
            productType: 'Cold',
          },
          {
            id: 36,
            productId: 9,
            productName: 'Baguette',
            productPrice: 35,
            qty: 3,
            totalPrice: 105, // 35 * 3
            receiptId: 20,
            productSize: 'N/A',
            productSweetLevel: 'N/A',
            productType: 'N/A',
          },
        ],
        total: 175,
      },
      // ... เพิ่มได้ตามต้องการ
    ],
    nextReceiptId: 21, // ID สำหรับใบเสร็จถัดไป
  }),

  getters: {
    /**
     * ดึงรายการใบเสร็จทั้งหมด
     * @returns ใบเสร็จใน store
     */
    getAllReceipts: (state) => state.receipts,
  },

  actions: {
    /**
     * เพิ่มใบเสร็จใหม่
     * @param receiptData ข้อมูลใบเสร็จใหม่ที่ต้องการเพิ่ม
     */
    addReceipt(receiptData: Omit<Receipt, 'id' | 'createdDate' |'total'>) {
      // หาก nextReceiptId ยังไม่ได้กำหนดหรือผิดพลาด ให้คำนวณใหม่จาก receipts
      if (this.nextReceiptId <= 0) {
        this.nextReceiptId =
          this.receipts.length > 0 ? Math.max(...this.receipts.map((receipt) => receipt.id)) + 1 : 1
      }

      // คำนวณ total จาก receiptDetails
      const calculatedTotal = receiptData.receiptDetails.reduce(
        (sum, detail) => sum + detail.totalPrice,
        0,
      )

      // สร้างใบเสร็จใหม่
      const newReceipt: Receipt = {
        ...receiptData,
        id: this.nextReceiptId++, // ใช้ค่า nextReceiptId และเพิ่มขึ้น
        createdDate: new Date(),
        total: calculatedTotal,

      }

      // เพิ่มใบเสร็จใหม่ใน store
      this.receipts.push(newReceipt)
    },

    /**
     * ค้นหาใบเสร็จตาม ID
     * @param id ID ของใบเสร็จ
     * @returns ใบเสร็จที่ค้นพบ หรือ undefined หากไม่พบ
     */
    getReceiptById(id: number): Receipt | undefined {
      return this.receipts.find((receipt) => receipt.id === id)
    },

    /**
     * ลบใบเสร็จตาม ID
     * @param id ID ของใบเสร็จที่ต้องการลบ
     */
    deleteReceiptById(id: number) {
      this.receipts = this.receipts.filter((receipt) => receipt.id !== id)
    },

    /**
     * ลบใบเสร็จทั้งหมดในระบบ
     */
    clearAllReceipts() {
      this.receipts = []
      this.nextReceiptId = 1
    },
  },
})

// รองรับ Hot Module Replacement (HMR)
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useReceiptStore, import.meta.hot))
}
