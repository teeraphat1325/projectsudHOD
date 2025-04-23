<template>
  <q-page padding style="height: 100%; background-color: #fff">
    <div class="row justify-between q-pa-xs">
      <!-- Left Section (Menu and Products) -->
      <div class="col-8">
        <!-- Menu, Search, และ Popular -->
        <div class="row q-gutter-md items-center">
          <div class="text-h6">Menu</div>
          <q-input
            outlined
            dense
            v-model="searchQuery"
            placeholder="Search"
            style="max-width: 250px"
            clearable
            @input="updateSearchResults"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <!-- <q-btn
            style="margin-left: 330px; height: 32px; font-size: 14px"
            outlined
            label="Popular •••"
          /> -->
        </div>
        <div class="row q-mt-md q-ml-sm">
          <q-tabs
            dense
            v-model="selectedTab"
            active-class="selected-tab"
            normal-class="unselected-tab"
            indicator-color="transparent"
          >
            <q-tab name="all" label="All" />
            <q-tab name="coffee" label="Coffee" />
            <q-tab name="bakery" label="Bakery" />
            <q-tab name="food" label="Food" />
          </q-tabs>
        </div>
        <div
          class="q-ml-sm"
          style="
            background-color: #240c10;
            max-width: 100%;
            margin-top: 0px;
            border: 10px solid #240c10;
          "
        >
          <q-scroll-area class="scroll-area q-ml-lg" style="height: 615px; max-width: 100%">
            <div class="row">
              <q-intersection
                v-for="p in filteredProducts"
                :key="p.id"
                once
                transition="scale"
                class="example-item col-4 q-mb-md"
              >
                <ProductCard class="product-card" :product="p" @select="addToCart"></ProductCard>
              </q-intersection>
            </div>
          </q-scroll-area>
        </div>
      </div>

      <!-- Right Section (Order List) -->
      <div class="col-4">
        <div class="order-section q-ml-sm">
          <!-- Header -->
          <div class="order-header">
            <q-icon name="receipt" size="25px" class="q-mr-sm" />
            <div class="order-header-details">
              <div class="text-bold text-h6">Order Number</div>
              <div>#{{ receiptStore.nextReceiptId }}</div>
            </div>
            <q-icon name="edit" size="25px" class="q-ml-sm" />
          </div>
          <q-separator />
          <!-- Order Items -->
          <div class="order-items">
            <div v-if="productItems.length === 0" class="no-item">
              <div class="text-center text-bold" style="height: 345px">No Item Selected</div>
            </div>
            <div v-else>
              <q-scroll-area style="height: 345px">
                <div v-for="item in productItems" :key="item.id" class="order-item">
                  <div class="row q-pa-xs">
                    <q-img
                      :src="item.product.image"
                      style="width: 80px; height: 80px; border-radius: 4px"
                    />

                    <div class="item-details q-ml-sm">
                      <div class="item-name text-bold" style="font-size: 17px">
                        {{ item.product.name }}
                      </div>
                      <div class="row">
                        <div class="col">
                          <q-chip outline dense square class="q-mr-sm">
                            Type: {{ item.type }}
                          </q-chip>

                          <q-chip outline dense square class="q-mr-sm">
                            Size: {{ item.size }}
                          </q-chip>
                        </div>
                      </div>
                      <q-chip outline dense square> Sweet: {{ item.sweetLevel * 50 }} % </q-chip>
                    </div>

                    <div class="row">
                      <div class="item-actions">
                        <!-- Delete Button -->
                        <div>
                          <q-btn
                            flat
                            dense
                            round
                            icon="delete"
                            color="red"
                            class="delete-button"
                            @click="removeItem(item.id)"
                          />
                        </div>
                        <!-- Amount Controls -->
                        <div class="amount-controls">
                          <q-btn flat round dense icon="remove" @click="decreaseAmount(item.id)" />
                          <div class="item-amount">{{ item.amount }}</div>
                          <q-btn flat round dense icon="add" @click="increaseAmount(item.id)" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-scroll-area>
            </div>
            <q-separator />
          </div>

          <!-- Member Information -->
          <div class="member-info">
            <div class="title text-center text-bold">Member Information</div>
            <div class="row q-mt-xs justify-between">
              <q-btn flat label="Register" class="action-button" @click="showRegisterDialog" />
              <q-btn flat label="Search" class="action-button" @click="showSearchDialog" />
              <q-btn flat label="No Member" class="action-button" @click="clearMember" />
            </div>
            <div style="height: 60px">
              <div v-if="selectedCustomer" class="q-ml-md">
                <div class="row justify-between">
                  <div class="text-bold">Name:</div>
                  <div class="text-bold">{{ selectedCustomer.name }}</div>
                </div>
                <div class="row justify-between">
                  <div class="text-bold">Phone:</div>
                  <div class="text-bold">{{ selectedCustomer.phone }}</div>
                </div>
                <div class="row justify-between">
                  <div class="text-bold">Points:</div>
                  <div class="text-bold">{{ selectedCustomer.point }}</div>
                </div>
              </div>
              <div v-else class="q-ml-md text-bold">No customer selected.</div>
            </div>
          </div>

          <!-- Search Dialog -->
          <q-dialog v-model="isSearchDialogVisible">
            <q-card>
              <q-card-section>
                <div class="text-h6">Search Customer</div>
              </q-card-section>
              <q-card-section>
                <q-input
                  v-model="searchPhone"
                  label="Enter Phone Number"
                  outlined
                  dense
                  type="tel"
                  required
                />
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="negative" @click="cancelSearch" />
                <q-btn flat label="Search" color="positive" @click="confirmSearch" />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <!-- Register Dialog -->
          <q-dialog v-model="isRegisterDialogVisible">
            <q-card>
              <q-card-section>
                <div class="text-h6">Register New Member</div>
              </q-card-section>
              <q-card-section>
                <q-input v-model="newCustomer.name" label="Name" outlined dense required />
                <q-input
                  v-model="newCustomer.phone"
                  label="Phone"
                  outlined
                  dense
                  type="tel"
                  required
                  class="q-mt-sm"
                />
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="negative" @click="cancelRegister" />
                <q-btn flat label="Confirm" color="positive" @click="confirmRegister" />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <!-- Total -->
          <div class="order-summary q-pa-xs q-mt-md">
            <div class="row justify-between">
              <div class="text-bold">TOTAL:</div>
              <div class="text-bold">{{ calculateTotal }} ฿</div>
            </div>
            <div class="row justify-between q-mt-sm">
              <div class="text-bold">CASH:</div>
              <div class="text-bold">{{ cash.toFixed(2) }} ฿</div>
            </div>
            <div class="row justify-between q-mt-sm">
              <div class="text-bold">CHANGE:</div>
              <div class="text-bold">{{ change.toFixed(2) }} ฿</div>
            </div>
          </div>

          <!-- Payment Buttons -->
          <div class="row q-mt-xs justify-between">
            <q-btn flat label="Cash" class="action-button" @click="showCashDialog" />
            <q-btn flat label="QR Code" class="action-button" />
            <q-btn flat label="Credit Card" class="action-button" />
          </div>

          <!-- Bottom Buttons -->
          <div class="row q-mt-xs justify-between">
            <q-btn label="OPEN BILLS" color="primary" class="large-button" />
            <q-btn label="PAY NOW" color="brown" class="large-button" @click="handlePayNow" />
          </div>
        </div>
      </div>
    </div>

    <!-- Cash Dialog -->
    <q-dialog v-model="isCashDialogVisible">
      <q-card>
        <q-card-section>
          <div class="text-h6">Enter Cash Amount</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="cashInput" label="Cash Amount" outlined dense autofocus />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="negative" @click="cancelCash" />
          <q-btn flat label="Confirm" color="positive" @click="confirmCash" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog สำหรับแสดงบิล -->
    <q-dialog v-model="isReceiptDialogVisible">
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-center">
            <q-img class="q-ml-sm" src="/dcoffee.png" style="height: 100px; width: 100px" />
            <div class="store-name text-bold text-h5">D-Coffee</div>
            <div class="store-address">
              169 Long Had Bangsaen Rd <br />
              Tambon Saen Suk <br />
              Amphoe Mueang Chon Buri <br />
              Chang Wat Chon Buri 20131
            </div>
          </div>
        </q-card-section>

        <!-- ข้อมูลสมาชิก -->
        <q-card-section v-if="selectedCustomer" class="q-mb-md">
          <div class="text-bold">Member: {{ selectedCustomer.name }}</div>
          <div class="text-caption">Phone: {{ selectedCustomer.phone }}</div>
          <div class="text-caption">Points: {{ selectedCustomer.point }}</div>
          <div class="text-caption text-green">Earned Points This Order: +{{ earnedPoints }}</div>
        </q-card-section>

        <!-- หากไม่มีสมาชิก -->
        <q-card-section v-else class="q-mb-md">
          <div class="text-bold">No Member</div>
        </q-card-section>

        <!-- รายการสินค้า -->
        <q-card-section>
          <div v-for="item in productItems" :key="item.id" class="row q-pb-sm">
            <div class="col-6">{{ item.product.name }}</div>
            <div class="col-2 text-right">{{ item.amount }}x</div>
            <div class="col-4 text-right">{{ item.total.toFixed(2) }} ฿</div>
          </div>
          <q-separator />

          <!-- สรุปยอดรวม -->
          <div class="row q-py-sm">
            <div class="col-6 text-bold">Total</div>
            <div class="col-6 text-right text-bold">{{ calculateTotal }} ฿</div>
          </div>
          <div class="row q-py-sm">
            <div class="col-6">Cash</div>
            <div class="col-6 text-right">{{ cash.toFixed(2) }} ฿</div>
          </div>
          <div class="row q-py-sm">
            <div class="col-6">Change</div>
            <div class="col-6 text-right">{{ change.toFixed(2) }} ฿</div>
          </div>
        </q-card-section>

        <!-- Footer -->
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="negative" @click="cancelReceipt" />
          <q-btn flat label="Confirm" color="positive" @click="confirmReceipt" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { useProductStore } from 'src/stores/productStore'
import { ref, computed } from 'vue'
import ProductCard from 'src/components/ProductCard.vue'
import { type Customer, type Product } from 'src/models'
import { Notify } from 'quasar'
import { watch } from 'vue'
import { useCustomerStore } from 'src/stores/customerStore'
import { useReceiptStore } from 'src/stores/receiptStore'
import { useUserStore } from 'src/stores/userStore'

const receiptStore = useReceiptStore()
const userStore = useUserStore()

const isReceiptDialogVisible = ref(false)

const handlePayNow = () => {
  earnedPoints.value = Math.floor(parseFloat(calculateTotal.value) / 100)
  if (productItems.value.length === 0) {
    Notify.create({
      message: 'No items in the order.',
      color: 'negative',
      position: 'top',
    })
    return
  }

  if (change.value < 0) {
    Notify.create({
      message: 'Not enough cash. Please enter a valid amount.',
      color: 'negative',
      position: 'top',
    })
    return
  }

  // เปิด Dialog เพื่อแสดงบิล
  isReceiptDialogVisible.value = true
}

const cancelReceipt = () => {
  // ปิด Dialog โดยไม่บันทึก
  isReceiptDialogVisible.value = false
}
const earnedPoints = ref(0) // เก็บแต้มที่ได้รับจากการซื้อครั้งนี้
const confirmReceipt = () => {
  // คำนวณแต้มสะสม
  earnedPoints.value = Math.floor(parseFloat(calculateTotal.value) / 100)
  // อัปเดตแต้มเฉพาะกรณีที่มีสมาชิก
  if (selectedCustomer.value) {
    const customerIndex = customerStore.customers.findIndex(
      (c) => c.id === selectedCustomer.value?.id,
    )
    if (customerIndex !== -1) {
      const customer = customerStore.customers[customerIndex]
      if (customer) {
        customer.point += earnedPoints.value // เพิ่มแต้มสะสม
      }
    }
  }

  // บันทึกข้อมูล Receipt
  const newReceipt = {
    cash: cash.value,
    change: change.value,
    totalQty: productItems.value.reduce((sum, item) => sum + item.amount, 0),
    userId: userStore.currentUser?.id || 0,
    customerId: selectedCustomer.value?.id || 0, // ใช้ 0 หากไม่มีสมาชิก
    customer: selectedCustomer.value || {
      id: 0,
      name: 'No Member',
      phone: 'N/A',
      point: 0,
    },
    receiptDetails: productItems.value.map((item) => ({
      id: 0,
      productId: item.product.id,
      productName: item.product.name,
      productPrice: item.product.price,
      qty: item.amount,
      totalPrice: item.total,
      receiptId: 0,
      productSize: item.size,
      productSweetLevel: `${item.sweetLevel * 50}%`,
      productType: item.type,
    })),
  }

  receiptStore.addReceipt(newReceipt)

  // รีเซ็ตสถานะหลังการยืนยัน
  productItems.value = []
  cash.value = 0
  selectedCustomer.value = null
  isReceiptDialogVisible.value = false
  Notify.create({
    message: `Order completed! ${selectedCustomer.value ? `Earned ${earnedPoints.value} points.` : ''}`,
    color: 'positive',
    position: 'top',
  })
}

const customerStore = useCustomerStore()
const productStore = useProductStore()
const selectedTab = ref('all')

// State สำหรับ Dialog และข้อมูลลูกค้า
const isSearchDialogVisible = ref(false)
const searchPhone = ref('')
const selectedCustomer = ref<Customer | null>(null)

// ฟังก์ชันแสดง Dialog Search
const showSearchDialog = () => {
  isSearchDialogVisible.value = true
}

// ฟังก์ชันยกเลิกการค้นหา
const cancelSearch = () => {
  searchPhone.value = ''
  isSearchDialogVisible.value = false
}

// ฟังก์ชันยืนยันการค้นหา
const confirmSearch = () => {
  const customer = customerStore.customers.find((c) => c.phone === searchPhone.value)
  if (customer) {
    selectedCustomer.value = customer
    Notify.create({
      message: `Customer found: ${customer.name}`,
      color: 'positive',
      position: 'top',
    })
  } else {
    selectedCustomer.value = null
    Notify.create({
      message: 'Customer not found.',
      color: 'negative',
      position: 'top',
    })
  }
  // ล้างค่าหลังจากการค้นหา
  searchPhone.value = ''
  isSearchDialogVisible.value = false
}

// ฟังก์ชันล้างข้อมูลลูกค้า
const clearMember = () => {
  selectedCustomer.value = null
}

const isRegisterDialogVisible = ref(false)
const newCustomer = ref({
  name: '',
  phone: '',
  point: 0,
})

const showRegisterDialog = () => {
  isRegisterDialogVisible.value = true
}

const cancelRegister = () => {
  // รีเซ็ตข้อมูลและปิด Dialog
  newCustomer.value = { name: '', phone: '', point: 0 }
  isRegisterDialogVisible.value = false
}

const confirmRegister = () => {
  // ตรวจสอบข้อมูลก่อนบันทึก
  if (!newCustomer.value.name || !newCustomer.value.phone) {
    Notify.create({
      message: 'Please fill in all required fields.',
      color: 'negative',
      position: 'top',
    })
    return
  }

  // บันทึกลง customerStore
  customerStore.addCustomer({ ...newCustomer.value })

  Notify.create({
    message: 'Member registered successfully!',
    color: 'positive',
    position: 'top',
  })

  // รีเซ็ตข้อมูลและปิด Dialog
  newCustomer.value = { name: '', phone: '', point: 0 }
  isRegisterDialogVisible.value = false
}

interface ProductItem {
  id: number
  product: Product
  type: string
  size: string
  sweetLevel: number
  amount: number
  total: number
}

let lastProductItemId = 1
const productItems = ref<ProductItem[]>([])

// Computed property for filtered products
const searchQuery = ref('')

// ฟังก์ชันอัปเดตผลลัพธ์การค้นหา
const updateSearchResults = () => {
  filteredProductsKey.value++ // บังคับให้รีเฟรชผลลัพธ์การกรอง
}

const filteredProducts = computed(() => {
  // เริ่มกรองตามหมวดหมู่
  const categoryFiltered =
    selectedTab.value === 'all'
      ? productStore.products
      : productStore.products.filter((product) => {
          if (selectedTab.value === 'coffee') return product.categoryId === 1
          if (selectedTab.value === 'bakery') return product.categoryId === 2
          if (selectedTab.value === 'food') return product.categoryId === 3
          return false
        })

  // กรองเพิ่มเติมตามคำค้นหา
  return searchQuery.value
    ? categoryFiltered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
      )
    : categoryFiltered
})

const filteredProductsKey = ref(0)

// Watch filteredProducts and update the key
watch(filteredProducts, () => {
  filteredProductsKey.value++
})

const addToCart = (
  product: Product,
  selectedType: string | null,
  selectedSize: string | null,
  selectedSweetLevel: number | null,
  amount: number,
) => {
  // ตรวจสอบเฉพาะสินค้าที่ไม่ใช่ Bakery และ Food
  if (product.categoryId !== 2 && product.categoryId !== 3) {
    if (!selectedType || !selectedSize) {
      Notify.create({
        message: 'Please select Type and Size before adding to cart.',
        color: 'negative',
        position: 'top',
      })
      return
    }
  }

  let existingItem

  // แยกเงื่อนไขการค้นหาสำหรับ Bakery และ Food
  if (product.categoryId === 2 || product.categoryId === 3) {
    // Bakery และ Food: ค้นหาเฉพาะ `product.id`
    existingItem = productItems.value.find((item) => item.product.id === product.id)
  } else {
    // สินค้าอื่น: ค้นหาจาก `product.id`, `type`, `size`, และ `sweetLevel`
    existingItem = productItems.value.find(
      (item) =>
        item.product.id === product.id &&
        item.type === selectedType &&
        item.size === selectedSize &&
        item.sweetLevel === selectedSweetLevel,
    )
  }

  // หากเจอสินค้าเดิมในตะกร้า
  if (existingItem) {
    existingItem.amount += amount
    existingItem.total = existingItem.amount * product.price
  } else {
    // หากไม่เจอสินค้าเดิม เพิ่มเป็นรายการใหม่
    productItems.value.push({
      id: lastProductItemId++,
      product,
      type: selectedType ?? '', // Default to empty string if null
      size: selectedSize ?? '', // Default to empty string if null
      sweetLevel: selectedSweetLevel ?? 0, // Default to 0 if null
      amount,
      total: amount * product.price,
    })
  }
}

const decreaseAmount = (id: number) => {
  const item = productItems.value.find((item) => item.id === id)
  if (item && item.amount > 1) {
    item.amount--
    item.total = item.amount * item.product.price // อัปเดต total
  }
}

const increaseAmount = (id: number) => {
  const item = productItems.value.find((item) => item.id === id)
  if (item) {
    item.amount++
    item.total = item.amount * item.product.price // อัปเดต total
  }
}

const removeItem = (id: number) => {
  productItems.value = productItems.value.filter((item) => item.id !== id)
}

const calculateTotal = computed(() =>
  productItems.value.reduce((sum, item) => sum + item.total, 0).toFixed(2),
)

const isCashDialogVisible = ref(false)
const cashInput = ref(0)
const cash = ref(0)

const showCashDialog = () => {
  isCashDialogVisible.value = true
}

const cancelCash = () => {
  cashInput.value = 0
  isCashDialogVisible.value = false
}

const confirmCash = () => {
  cash.value = parseFloat(cashInput.value.toString())
  isCashDialogVisible.value = false
}

const change = computed(() => cash.value - parseFloat(calculateTotal.value))
</script>

<style scoped>
.product-card {
  max-width: 280px;
  height: 290px;
}
.order-item {
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: #f9f9f9;
}

.item-details {
  flex: 1;
}

.item-actions {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.delete-button {
  margin-bottom: auto;
}

.amount-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.item-amount {
  font-size: 16px;
  font-weight: bold;
}
.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 9px;
}

.order-header-details {
  text-align: center;
}
.selected-tab {
  color: white;
  background-color: #240c10; /* สี active */
  font-weight: bold;
}

.unselected-tab {
  color: #240c10; /* สี default */
  background-color: white; /* สีพื้นหลัง tab */
}
.large-button {
  width: 140px;
  height: 45px;
}
.action-button {
  height: 20px;
}
</style>
