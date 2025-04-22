export interface Product {
  id: number
  name: string
  price: number
  size?: string[] // Optional
  sweetLevel?: number[]
  type?: string[] // Optional
  image: string
  categoryId: number
}
export interface Receipt {
  id: number
  createdDate: Date
  total: number
  cash: number
  change: number
  totalQty: number
  userId: number
  customerId?: number
  customer?: Customer
  receiptDetails: ReceiptDetail[]
}
export interface ReceiptDetail {
  id: number
  productId: number
  productName: string
  productPrice: number
  qty: number
  totalPrice: number
  receiptId: number
  productSize: string
  productSweetLevel: string
  productType: string
}
export interface Category {
  id: number
  name: string
}
export interface User {
  id?: number
  name: string
  email: string
  gender: string
  roles: Role[]
  password: string
}

export interface Payment {
  id?: number
  amount: number
  date: string
  status: 'Pending' | 'Completed' | 'Failed'
  method: string // e.g., 'Credit Card', 'PayPal', etc.
  currency: string // e.g., 'USD', 'EUR', etc.
  name: string
}

export interface CheckInOut {
  id?: number
  userId: number
  name: string
  checkInTime: string
  checkOutTime: string
  totalHours: number
  salaryId: number
}

export interface Customer {
  id: number
  name: string
  phone: string
  point: number
}

export interface CheckStockItem {
  code: string
  name: string
  category: string
  systemQty: number
  actualQty: number
  difference: number
  note: string
}

export interface CheckStock {
  id: number
  date: string
  checker: string
  note: string
  status: 'กำลังดำเนินการ' | 'เสร็จสิ้น'
  items: CheckStockItem[]
}

export interface Salary {
  id?: number
  paydate: string
  amount: number
  userID: number
  totalHours: number
  paymentMethod?: 'cash' | 'transfer'
}

export interface Role {
  id: number
}

export interface InventoryItem {
  id: number
  name: string
  quantity: number
  unit: number
  minStock: number
  price: number
  supplier: string
  lastOrder: string
  categoryId: number
  category: Category // เพิ่ม category เป็น object ที่มี type 'Category'
  branchId: number
  orderQuantity: number
}

export interface CartItem {
  id: number
  orderQuantity: number
  total: number
  lastOrder: string
  unit: string
  price: number
  supplier: string
  name: string
  category: string
  quantity: number
  minStock: number
}

export interface OrderRecord {
  id: number
  orderDate: Date
  staffName: string
  status: string
  deliveryDate: Date | null
  note: string
  totalAmount: number
  userId: number
  tempStatus?: string
}

export interface OrderDetail {
  id: number
  name: string
  quantity: number
  unit: string
  price: number
  total: number
  supplier: string
  orderRecordId: number
  inventoryItemId: number
}
