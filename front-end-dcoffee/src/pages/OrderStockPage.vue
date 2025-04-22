<template>
  <q-page class="q-pa-md" style="height: 800px">
    <div class="text-h6 q-mb-lg" style="margin-left: 15px; margin-top: 10px">Inventory Order</div>
    <q-tabs v-model="tab" dense align="left" style="margin-left: 20px">
      <q-tab name="order-history" label="รายการคำสั่งซื้อ" />
      <q-tab name="all-products" label="สินค้าทั้งหมด" />
      <q-tab name="report" label="รายงาน" />
    </q-tabs>

    <q-separator />

    <!-- ใช้ q-tab-panels เดียว -->
    <q-tab-panels v-model="tab" style="height: 690px">
      <!-- ประวัติการสั่งซื้อ -->
      <q-tab-panel name="order-history">
        <q-card-section>
          <div class="text-head">รายการคำสั่งซื้อ</div>

          <!-- ฟิลเตอร์การค้นหาคำสั่งซื้อ -->
          <div class="q-mb-md" style="display: flex; justify-content: flex-start; gap: 10px">
            <!-- ค้นหาตาม ID คำสั่งซื้อ -->
            <q-input
              v-model="searchOrderTerm"
              placeholder="ค้นหาตาม ID คำสั่งซื้อ หรือ ชื่อผู้สั่ง"
              outlined
              dense
              class="q-w-100"
              style="width: 90%"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <!-- เลือกสถานะ -->
            <q-select
              v-model="statusFilter"
              :options="statuses"
              label="เลือกสถานะ"
              outlined
              dense
              class="q-w-100"
              style="width: 10%"
            />
          </div>
          <div style="display: flex; gap: 10px; width: 40%; margin-bottom: 17px">
            <div class="text-date">จากวันที่ :</div>
            <q-input
              v-model="startDate"
              label="จากวันที่"
              outlined
              dense
              type="date"
              class="date-align"
            />
            <div class="text-date">ถึงวันที่ :</div>
            <q-input
              v-model="endDate"
              label="ถึงวันที่"
              outlined
              dense
              type="date"
              class="date-align"
              style="margin-left: -20px"
            />
          </div>

          <q-table :rows="filteredOrders" :columns="orderColumns" row-key="id" class="q-pa-sm">
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <div :class="statusClass(props.row.status)" class="status-badge">
                  {{ props.row.status }}
                </div>
              </q-td>
            </template>
            <!-- Slot สำหรับการอัปเดตสถานะ -->
            <template v-slot:body-cell-updateStatus="props">
              <q-td :props="props">
                <div style="display: flex; justify-content:">
                  <!-- เลือกสถานะ -->
                  <q-select
                    v-if="props.row.status !== 'delivered'"
                    v-model="props.row.tempStatus"
                    :options="statusesUpdate"
                    outlined
                    dense
                    class="q-w-100"
                    style="max-width: 120px; margin-right: 20px"
                  />
                  <!-- ปุ่มยืนยันการอัปเดต -->
                  <q-btn
                    v-if="props.row.status !== 'delivered'"
                    label="ยืนยัน"
                    color="green"
                    class="q-mt-sm"
                    style="margin: 1px; margin-right: 10px"
                    @click="updateStatus(props.row)"
                  />
                  <!-- ปุ่มดูรายละเอียด -->
                  <q-btn
                    label="ดูรายละเอียด"
                    color="primary"
                    class="q-mt-sm"
                    style="margin: 1px"
                    @click="viewDetails(props.row)"
                  />
                </div>
              </q-td>
            </template>
          </q-table>
        </q-card-section>

        <div class="orderTab-button-margin">
          <q-btn
            label="รายงานและการวิเคราะห์ข้อมูล"
            color="purple-5"
            class="q-mt-md"
            @click="tab = 'report'"
          />
          <q-btn
            label="สั่งซื้อสินค้าใหม่"
            color="primary"
            class="q-mt-md"
            icon-right="keyboard_arrow_right"
            @click="tab = 'all-products'"
          />
        </div>
      </q-tab-panel>

      <!-- สินค้าทั้งหมด -->
      <q-tab-panel name="all-products">
        <div style="display: flex; gap: 10px; width: 100%; margin-bottom: 17px">
          <q-card-section style="width: 60%">
            <!-- ฟิลเตอร์การค้นหา -->
            <div class="q-mb-md" style="display: flex; align-items: center; margin-bottom: 10px">
              <!-- ค้นหาสินค้า -->
              <div class="menu-text">Menu</div>
              <q-input
                v-model="searchTerm"
                placeholder="ค้นหาสินค้า"
                outlined
                dense
                class="q-w-100"
                style="width: 30%"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>

            <q-tabs
              v-model="selectedTab"
              dense
              align="left"
              active-class="selected-tab"
              normal-class="unselected-tab"
              indicator-color="transparent"
            >
              <q-tab name="all-products" label="All" />
              <q-tab name="1" label="Coffee" />
              <q-tab name="2" label="Bakery" />
              <q-tab name="3" label="Food" />
              <q-tab name="4" label="Beverage" />
            </q-tabs>

            <!-- แสดงสินค้า -->

            <div class="q-gutter-md">
              <div
                style="
                  display: flex;
                  width: 100%;
                  height: 550px;
                  background-color: #240c10;
                  justify-content: center;
                "
              >
                <div
                  style="
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    width: 99%;
                    margin-bottom: 17px;
                    overflow-y: auto;
                    height: 530px;
                    margin: 10px;
                  "
                >
                  <div
                    v-for="product in filteredProducts"
                    :key="product.id"
                    class="col"
                    style="box-sizing: border-box; height: 230px"
                  >
                    <div
                      style="
                        height: 100%;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        background-color: #ffffff;
                      "
                    >
                      <q-card-section>
                        <div class="text-h6">{{ product.name }}</div>
                        <div class="text-price">ราคา: {{ product.price }} บาท</div>
                        <div class="text-detail">คงเหลือ: {{ product.quantity }} ชิ้น</div>
                        <div class="text-detail">ซัพพลายเออร์: {{ product.supplier }}</div>
                        <div class="text-detail">สั่งซื้อล่าสุด: {{ product.lastOrder }}</div>
                      </q-card-section>
                      <q-card-actions style="justify-content: flex-start">
                        <q-input
                          v-model.number="product.orderQuantity"
                          type="text"
                          min="1"
                          max="100"
                          outlined
                          dense
                          style="width: 50%; margin-right: 10px"
                        >
                          <template v-slot:append>
                            <q-btn flat icon="remove" @click="decreaseQuantity(product)" />
                            <q-btn flat icon="add" @click="increaseQuantity(product)" />
                          </template>
                        </q-input>
                        <q-btn label="เพิ่มลงตะกร้า" color="primary" @click="addToCart(product)" />
                      </q-card-actions>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-section style="width: 40%">
            <div class="text-head-cart">
              Order Number
              <div style="font-size: 19px; margin-bottom: 10px">#{{ orderId }}</div>
            </div>
            <q-table :rows="cartItems" :columns="cartColumns" row-key="id" class="q-pa-sm">
              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <!-- ปุ่มลบ -->
                  <q-btn
                    color="negative"
                    icon="delete"
                    flat
                    @click="removeItemFromCart(props.row)"
                  />
                </q-td>
              </template>

              <!-- แสดงข้อความเมื่อไม่มีข้อมูล -->
              <template v-slot:no-data>
                <div style="text-align: center; width: 100%; padding: 20px; color: grey">
                  No Item Selected
                </div>
              </template>
            </q-table>

            <!-- แสดงราคารวม -->
            <div class="text-price">ราคารวม: {{ totalPrice }} บาท</div>

            <!-- ปุ่มดำเนินการ -->
            <q-btn
              label="ยืนยันการสั่งซื้อ"
              color="primary"
              class="q-mt-md"
              @click="openOrderDialog"
            />
          </q-card-section>
        </div>
      </q-tab-panel>

      <!-- ตะกร้าสินค้า -->

      <q-tab-panel name="report">
        <q-card-section>
          <div class="text-head">รายงานและวิเคราะห์ข้อมูล</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="handleOrderFilter" class="q-gutter-md">
            <!-- เลือกประเภทการรายงาน -->
            <div>ประเภทการรายงาน</div>
            <q-select v-model="reportType" :options="reportOptions" dense outlined required />
            <!-- แสดงเฉพาะเมื่อเลือก 'รายงานรายวัน' -->
            <div v-if="reportType === 'รายงานรายวัน'">
              <div>วันที่</div>
              <q-input
                v-model="reportDate"
                label="วันที่"
                outlined
                dense
                type="date"
                class="date-align"
              />
            </div>
            <div>เดือน</div>
            <q-select v-model="mont" :options="montOption" dense outlined required />
            <!-- เลือกปี -->
            <div>ปี</div>
            <q-select v-model="year" :options="years" dense outlined required />

            <!-- เลือกประเภทการวิเคราะห์ -->
          </q-form>
          <!-- ปุ่มแสดงรายงาน -->
          <q-btn label="แสดงรายงาน" type="submit" color="primary" class="q-mt-sm" />
          <q-table :rows="filteredOrders" :columns="orderColumns" row-key="id" class="q-pa-sm">
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <div :class="statusClass(props.row.status)" class="status-badge">
                  {{ props.row.status }}
                </div>
              </q-td>
            </template>
            <!-- Slot สำหรับการอัปเดตสถานะ -->
            <template v-slot:body-cell-updateStatus="props">
              <q-td :props="props">
                <div style="display: flex; justify-content:">
                  <!-- เลือกสถานะ -->
                  <q-select
                    v-if="props.row.status !== 'delivered'"
                    v-model="props.row.tempStatus"
                    :options="statusesUpdate"
                    outlined
                    dense
                    class="q-w-100"
                    style="max-width: 120px; margin-right: 20px"
                  />
                  <!-- ปุ่มยืนยันการอัปเดต -->
                  <q-btn
                    v-if="props.row.status !== 'delivered'"
                    label="ยืนยัน"
                    color="green"
                    class="q-mt-sm"
                    style="margin: 1px; margin-right: 10px"
                    @click="updateStatus(props.row)"
                  />
                  <!-- ปุ่มดูรายละเอียด -->
                  <q-btn
                    label="ดูรายละเอียด"
                    color="primary"
                    class="q-mt-sm"
                    style="margin: 1px"
                    @click="viewDetails(props.row)"
                  />
                </div>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-tab-panel>
    </q-tab-panels>

    <!-- QDialog for Order Details -->
    <q-dialog v-model="dialogVisible">
      <q-card>
        <q-card-section>
          <div>
            <strong>Order ID:</strong> {{ selectedOrder?.id }}<br />
            <strong>Order Date:</strong> {{ selectedOrder?.orderDate }}<br />
            <strong>Staff Name:</strong> {{ selectedOrder?.staffName }}<br />
            <strong>Status:</strong> {{ selectedOrder?.status }}<br />
            <strong>Delivery Date:</strong> {{ selectedOrder?.deliveryDate || 'Not delivered yet'
            }}<br />
            <strong>Amount:</strong> {{ selectedOrder?.totalAmount }}<br />
            <strong>Note:</strong> {{ selectedOrder?.note }}<br />
          </div>

          <div>
            <strong>Order Details:</strong>
            <q-table :rows="orderDetail" :columns="orderDetailColumns" row-key="id" />
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn label="Close" color="primary" @click="closeDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- QDialog สำหรับยืนยันการสั่งซื้อ -->
    <q-dialog v-model="isOrderDialogVisible">
      <q-card class="dialog">
        <q-card-section class="q-pa-md">
          <div class="text-h6">ยืนยันคำสั่งซื้อ</div>
          <div class="q-mt-md" style="background-color: aqua">
            <div>เลขที่คำสั่งซื้อ</div>
            {{ orderId }}
            <q-input
              v-model="userId"
              placeholder="กรุณากรอก ID ผู้สั่ง"
              outlined
              dense
              class="q-w-100"
              style="width: 30%"
            >
            </q-input>
            <q-input
              v-model="staffName"
              placeholder="กรุณากรอกชื่อผู้สั่ง"
              outlined
              dense
              class="q-w-100"
              style="width: 30%"
            >
            </q-input>
            <div>หมายเหตุ :</div>
            <q-input
              v-model="note"
              placeholder="เพิ่มหมายเหตุเพิ่มเติมหรือรายละเอียด (ถ้ามี)"
              outlined
              dense
              type="textarea"
              autogrow
              class="q-w-100"
              style="width: 50%"
            >
            </q-input>
          </div>

          <q-table :rows="cartItems" :columns="cartColumns" row-key="id" class="q-pa-sm" />
        </q-card-section>
        <!-- แสดงราคารวม -->
        <div class="text-price">ราคารวม: {{ totalPrice }} บาท</div>
        <q-card-actions
          class="q-pt-none"
          style="margin-top: auto; display: flex; justify-content: flex-end; align-items: flex-end"
        >
          <q-btn label="ยืนยัน" color="primary" @click="confirmOrder" style="margin-right: 10px" />
          <q-btn label="ยกเลิก" color="secondary" @click="isOrderDialogVisible = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue'
import { Notify, type QTableColumn } from 'quasar'
import axios from 'axios'

import type { CartItem, InventoryItem, OrderDetail, OrderRecord } from 'src/models'
export default defineComponent({
  setup() {
    const tab = ref('order-history') // กำหนดค่าเริ่มต้นให้แสดงแท็บ "รายการคำสั่งซื้อ"

    const products = ref<InventoryItem[]>([])
    const cartItems = ref<CartItem[]>([])
    const orderHistory = ref<OrderRecord[]>([])
    const orderDetail = ref<OrderDetail[]>([])
    const orderHistoryReport = ref<OrderRecord[]>([])

    const searchTerm = ref('')
    const selectedCategory = ref('ทั้งหมด')
    const searchOrderTerm = ref('')
    const statusFilter = ref('ทั้งหมด')
    const startDate = ref('')
    const endDate = ref('')
    const reportDate = ref('')

    const categories = ['ทั้งหมด', 'อุปกรณ์สำนักงาน', 'เครื่องใช้ไฟฟ้า', 'อิเล็กทรอนิกส์']
    const statuses = ['ทั้งหมด', 'pending', 'delivered']
    const statusesUpdate = ['pending', 'delivered']

    const dialogVisible = ref(false)
    const selectedOrder = ref<OrderRecord | null>(null)

    const selectedQuantity = ref(1)

    const isOrderDialogVisible = ref(false) // ใช้สำหรับควบคุมการแสดง/ซ่อนไดอะล็อกยืนยันการสั่งซื้อ
    const isDetailsDialogVisible = ref(false) // ใช้สำหรับควบคุมการแสดง/ซ่อนไดอะล็อกรายละเอียดการสั่งซื้อ

    const userId = ref()
    const orderId = ref(0)
    const staffName = ref('')
    const note = ref('Urgent order for weekend')

    const selectedTab = ref('all-products')

    // กร๊าฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟฟ
    const today = ref(new Date().toISOString().split('T')[0])
    const reportType = ref('รายงานรายวัน')
    const year = ref('มกราคม')

    const mont = ref('2025')

    const reportOptions = ['รายงานรายวัน', 'รายงานรายเดือน', 'รายงานรายปี', 'กราฟและแผนภูมิ']
    const montOption = [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม',
    ]
    const years = ['2025', '2024', '2023', '2022', '2021']

    //--------------------------------------------------

    const orderData = {
      staffName: staffName.value, // ชื่อผู้สั่งซื้อ
      note: note.value || 'Urgent order for weekend', // หมายเหตุ (ถ้ามี)
      userId: userId.value || 0, // ใช้ id ของผู้ใช้งานที่ล็อกอิน
    }

    const findOrderId = () => {
      // คำนวณ orderId โดยการหาค่า ID ที่สูงที่สุดใน orderHistory แล้วบวก 1
      const maxOrderId = Math.max(...orderHistory.value.map((order: OrderRecord) => order.id), 0)
      orderId.value = maxOrderId + 1
    }

    const openOrderDialog = () => {
      findOrderId()
      isOrderDialogVisible.value = true
    }

    // ฟังก์ชันปิดไดอะล็อกยืนยันการสั่งซื้อ
    const closeOrderDialog = () => {
      isOrderDialogVisible.value = false
    }

    const ahh = () => {
      console.log(staffName.value)
      console.log(userId.value)
      console.log(note.value)
    }

    // ฟังก์ชันยืนยันการสั่งซื้อ
    const confirmOrder = async () => {
      const orderData = {
        staffName: staffName.value, // ชื่อผู้สั่งซื้อ
        note: note.value || 'Urgent order for weekend', // หมายเหตุ (ถ้ามี)
        userId: Number(userId.value) || 0, // ใช้ id ของผู้ใช้งานที่ล็อกอิน
      }

      try {
        // ตรวจสอบว่า orderData มีค่าเต็ม
        console.log('Data to send:', orderData)

        // เรียกใช้ API เพื่อสร้างคำสั่งซื้อจากตะกร้า
        const response = await axios.post(
          'http://localhost:5002/order-records/from-cart',
          orderData,
        )

        // ตรวจสอบการตอบกลับจาก API
        if (response.status === 200) {
          console.log('Order successfully created:', response.data)
        } else {
          console.error('Error from API:', response)
        }

        // ปิดไดอะล็อกหลังจากการยืนยัน
        loadCart()
        closeOrderDialog()
      } catch (error) {
        console.error('Error confirming order:', error)
        // แสดงข้อความแจ้งข้อผิดพลาด
        Notify.create({
          message: 'ไม่สามารถยืนยันคำสั่งซื้อได้',
          color: 'negative',
          position: 'top',
        })
      }
    }

    const increaseQuantity = (product: InventoryItem) => {
      product.orderQuantity += 1
    }

    const decreaseQuantity = (product: InventoryItem) => {
      if (product.orderQuantity > 1) {
        product.orderQuantity -= 1
      }
    }

    const viewDetails = async (row: OrderRecord) => {
      selectedOrder.value = row // เก็บข้อมูลคำสั่งซื้อ
      dialogVisible.value = true // เปิด dialog
      await getOrderDetails(row.id) // เรียกข้อมูล orderDetail สำหรับคำสั่งซื้อที่คลิก
    }

    const closeDialog = () => {
      dialogVisible.value = false
      orderDetail.value = []
    }

    const loadProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5002/inventory-items')
        // แปลงข้อมูลให้เป็น categoryId แทน category object
        products.value = response.data.map((item: InventoryItem) => ({
          ...item,
          categoryId: item.category?.id || item.categoryId,
          orderQuantity: item.orderQuantity || 1, // ดึง id จาก category ถ้ามี
        }))
      } catch (error) {
        console.error('Error loading products:', error)
      }
    }

    const loadCart = async () => {
      try {
        const response = await axios.get('http://localhost:5002/cart-item')
        cartItems.value = response.data
        console.log('ข้อมูลตะกร้า:', cartItems.value) // ตรวจสอบข้อมูลที่ดึงมา
      } catch (error) {
        console.error('Error loading cart items:', error)
      }
    }

    const loadOrderHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5002/order-records')
        orderHistory.value = response.data.map((order: OrderRecord) => ({
          ...order,
          tempStatus: order.status, // ตั้งค่า tempStatus เริ่มต้นจาก status
        }))
      } catch (error) {
        console.error('Error loading order history:', error)
      }
    }

    const loadOrderHistoryForRecord = async () => {
      try {
        const response = await axios.get('http://localhost:5002/order-records')
        orderHistoryReport.value = response.data.map((order: OrderRecord) => ({
          ...order,
          tempStatus: order.status, // ตั้งค่า tempStatus เริ่มต้นจาก status
        }))
      } catch (error) {
        console.error('Error loading order history:', error)
      }
    }

    const loadDataForTab = () => {
      if (tab.value === 'all-products') {
        loadProducts()
      } else if (tab.value === 'cart') {
        loadCart()
      } else if (tab.value === 'order-history') {
        loadOrderHistory()
      }
    }

    onMounted(() => {
      loadDataForTab()
      loadProducts()
      loadCart()
      findOrderId()
      // loadUserData()
    })

    watch(tab, () => {
      loadDataForTab()
      findOrderId()
    })

    const updateStatus = async (row: OrderRecord) => {
      try {
        const selectedStatus = row.tempStatus // ใช้สถานะจาก tempStatus ที่เลือกใน dropdown
        if (!selectedStatus) {
          console.error('Status is missing!')
          return
        }

        // เรียก API เพื่ออัปเดตสถานะของคำสั่งซื้อ
        await axios.patch(`http://localhost:5002/order-records/${row.id}/status/${selectedStatus}`)

        // อัปเดตสถานะจริงใน row หลังจากที่ได้รับการยืนยัน
        row.status = selectedStatus

        console.log('สถานะคำสั่งซื้ออัปเดตแล้ว')
        // คุณสามารถเพิ่มการรีเฟรชข้อมูลหรือแสดงข้อความแสดงสถานะอัปเดต

        // รีเฟรชข้อมูลของแท็บนี้หลังจากการอัปเดต
        loadDataForTab() // รีเฟรชข้อมูลทั้งหมด
      } catch (error) {
        console.error('Error updating status:', error)
      }
    }

    const statusClass = (status: string) => {
      console.log('Current Status:', status) // ตรวจสอบค่าของ status
      if (status === 'delivered') {
        return 'bg-green text-white'
      } else if (status === 'pending') {
        return 'bg-blue text-white'
      }
      return ''
    }
    const columns: QTableColumn[] = [
      { name: 'id', label: 'ID', align: 'center', field: 'id' },
      { name: 'name', label: 'ชื่อ', align: 'center', field: 'name' },
      { name: 'quantity', label: 'จำนวนทั้งหมด', align: 'center', field: 'quantity' },
      { name: 'unit', label: 'หน่วย', align: 'center', field: 'unit' },
      { name: 'minStock', label: 'จำนวนที่เหลือ', align: 'center', field: 'minStock' },
      { name: 'price', label: 'ราคา/unit', align: 'center', field: 'price' },
      { name: 'supplier', label: 'นำเข้าจาก', align: 'center', field: 'supplier' },
      { name: 'lastOrder', label: 'วันที่นำเข้าล่าสุด', align: 'center', field: 'lastOrder' },
    ]

    const cartColumns: QTableColumn[] = [
      { name: 'name', label: 'ชื่อสินค้า', align: 'center', field: 'name' },
      { name: 'orderQuantity', label: 'จำนวน', align: 'center', field: 'orderQuantity' },
      { name: 'unit', label: 'หน่วย', align: 'center', field: 'unit' },
      { name: 'supplier', label: 'นำเข้าจาก', align: 'center', field: 'supplier' },
      { name: 'total', label: 'ราคารวม', align: 'center', field: 'total' },
      { name: 'action', label: 'ลบสินค้า', align: 'center', field: 'action' }, // คอลัมน์สำหรับปุ่มลบ
    ]

    const orderColumns: QTableColumn[] = [
      { name: 'id', label: 'Order ID', align: 'center', field: 'id' },
      { name: 'orderDate', label: 'วันที่', align: 'center', field: 'orderDate' },
      { name: 'staffName', label: 'ชื่อหนักงาน', align: 'center', field: 'staffName' },
      { name: 'status', label: 'สถานะ', align: 'center', field: 'status' },
      { name: 'deliveryDate', label: 'วันที่ได้รับสินค้า', align: 'center', field: 'deliveryDate' },
      { name: 'note', label: 'หมายเหตุ', align: 'center', field: 'note' },
      { name: 'totalAmount', label: 'ยอดรวม', align: 'center', field: 'totalAmount' },
      { name: 'updateStatus', label: 'การดำเนินการ', align: 'center', field: 'updateStatus' },
    ]

    const orderDetailColumns: QTableColumn[] = [
      { name: 'productName', label: 'Product Name', align: 'center', field: 'name' },
      { name: 'quantity', label: 'Quantity', align: 'center', field: 'quantity' },
      { name: 'unitPrice', label: 'Unit Price', align: 'center', field: 'unit' },
      { name: 'total', label: 'Total', align: 'center', field: 'total' },
    ]

    const orderColumnsReport: QTableColumn[] = [
      { name: 'id', label: 'Order ID', align: 'center', field: 'id' },
      { name: 'orderDate', label: 'วันที่', align: 'center', field: 'orderDate' },
      { name: 'staffName', label: 'ชื่อพนักงาน', align: 'center', field: 'staffName' },
      { name: 'status', label: 'สถานะ', align: 'center', field: 'status' },
      { name: 'totalAmount', label: 'ยอดรวม', align: 'center', field: 'totalAmount' },
      { name: 'updateStatus', label: 'การดำเนินการ', align: 'center', field: 'updateStatus' },
    ]

    const getOrderDetails = async (orderId: number) => {
      try {
        // ดึงข้อมูลทั้งหมดจาก API
        const response = await axios.get('http://localhost:5002/order-detail')

        // ตรวจสอบข้อมูลที่ได้รับจาก API
        console.log('API Response:', response.data)

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          // กรองข้อมูลเฉพาะรายการที่ orderDetailId ตรงกับ orderId จาก row ที่เลือก
          orderDetail.value = response.data.filter((item) => item.orderRecordId === orderId)

          // ถ้าไม่มีข้อมูลที่ตรงกับ orderRecordId
          if (orderDetail.value.length === 0) {
            console.error('No matching order details found for this order ID.')
          }
        } else {
          console.error('No valid order detail data found.')
          orderDetail.value = []
        }

        console.log('Filtered Order Details:', orderDetail.value) // ดูข้อมูลที่กรองแล้ว
      } catch (error) {
        console.error('Error fetching order details:', error)
      }
    }

    const filteredOrders = computed(() => {
      let filteredData = orderHistory.value

      // กรองตามสถานะ
      if (statusFilter.value !== 'ทั้งหมด') {
        filteredData = filteredData.filter((order) => order.status === statusFilter.value)
      }

      // กรองตามช่วงวันที่
      if (startDate.value) {
        filteredData = filteredData.filter(
          (order) => new Date(order.orderDate) >= new Date(startDate.value),
        )
      }
      if (endDate.value) {
        filteredData = filteredData.filter(
          (order) => new Date(order.orderDate) <= new Date(endDate.value),
        )
      }

      // กรองตามคำค้นหาในช่องค้นหา (searchTerm)
      if (searchOrderTerm.value) {
        filteredData = filteredData.filter(
          (order) =>
            order.id.toString().includes(searchOrderTerm.value) || // ค้นหาตาม ID
            order.staffName.includes(searchOrderTerm.value), // ค้นหาตามชื่อผู้สั่ง
        )
      }

      return filteredData
    })

    const deliveredOrders = computed(() => {
      return filteredOrders.value.filter((order) => order.status === 'delivered')
    })

    const filteredProducts = computed(() => {
      console.log('Selected Tab:', selectedTab.value) // ตรวจสอบค่า selectedTab
      if (selectedTab.value === 'all-products') {
        console.log('All products:', products.value) // ตรวจสอบว่ามีข้อมูลสินค้าหรือไม่
        return products.value
      } else {
        const categoryId = parseInt(selectedTab.value) // แปลง selectedTab เป็นเลข
        console.log('categoryId:', categoryId) // ตรวจสอบ categoryId ที่แปลงแล้ว
        console.log('Products:', products.value)
        return products.value.filter((product) => product.categoryId === categoryId)
      }
    })

    const addToCart = async (product: InventoryItem) => {
      try {
        const itemToAdd = {
          items: [
            {
              inventoryItemId: product.id, // ใช้ inventoryItemId แทน productId
              orderQuantity: product.orderQuantity, // ใช้ orderQuantity แทน quantity
            },
          ],
        }

        await axios.post('http://localhost:5002/cart-item', itemToAdd)
        console.log('เพิ่มสินค้าลงตะกร้าแล้ว')
        loadCart() // รีเฟรชข้อมูลตะกร้าหลังจากเพิ่มสินค้า
      } catch (error) {
        console.error('Error adding to cart:', error)
      }
      // loadDataForTab()
    }

    const totalPrice = computed(() => {
      return cartItems.value.reduce((sum, item) => {
        return sum + item.orderQuantity * item.price // คำนวณ totalPrice สำหรับแต่ละรายการ
      }, 0)
    })

    const removeItemFromCart = async (item: CartItem) => {
      try {
        // item จะเป็น props.row ที่ได้รับ
        console.log(item) // จะมีข้อมูลของแถวสินค้านั้นๆ เช่น { id: 1, name: 'Product A', orderQuantity: 2, unit: 'pcs', total: 100 }

        // เรียก API เพื่อลบสินค้าจากตะกร้าโดยใช้ item.id
        await axios.delete(`http://localhost:5002/cart-item/${item.id}`)

        // รีเฟรชข้อมูลตะกร้า
        loadCart()
      } catch (error) {
        console.error('Error removing item from cart:', error)
      }
    }
    const handleOrderFilter = () => {}

    return {
      tab,
      products,
      columns,
      cartItems,
      cartColumns,
      orderHistory,
      orderColumns,
      searchTerm,
      selectedCategory,
      searchOrderTerm,
      statusFilter,
      categories,
      statuses,
      startDate,
      endDate,
      filteredOrders,
      updateStatus,
      viewDetails,
      statusesUpdate,
      statusClass,
      dialogVisible,
      selectedOrder,
      closeDialog,
      filteredProducts,
      addToCart,
      selectedQuantity,
      increaseQuantity,
      decreaseQuantity,
      isOrderDialogVisible,
      isDetailsDialogVisible,
      openOrderDialog,
      closeOrderDialog,
      confirmOrder,
      note,
      userId,
      staffName,
      orderId,
      orderData,
      ahh,
      selectedTab,
      findOrderId,
      totalPrice,
      removeItemFromCart,
      orderDetail,
      getOrderDetails,
      orderDetailColumns,
      reportType,
      year,
      reportOptions,
      years,
      handleOrderFilter,
      today,
      montOption,
      mont,
      orderHistoryReport,
      orderColumnsReport,
      loadOrderHistoryForRecord,
      deliveredOrders,
      reportDate,
    }
  },
})
</script>

<style scoped>
.text-head {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: -15px;
  margin-bottom: 15px;
}
.text-head-cart {
  text-align: center;
  font-size: 25px;
  font-weight: bold;
  margin-top: -15px;
}

.q-input,
.q-select {
  width: 100%;
}

.q-w-100 {
  width: 20%;
}

.q-mt-sm {
  margin-top: 8px;
}

.q-mb-md {
  margin-bottom: 16px;
}

.text-date {
  width: 30%;
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  font-weight: bold;
  margin-right: -2%;
}
.orderTab-button-margin {
  display: flex;
  justify-content: space-between;
  width: 98.4%;
  margin-bottom: 17px;
  margin-left: 15px;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px; /* ทำให้ป้ายมีขอบมน */
  font-weight: bold;
  text-align: center;
  font-size: 14px;
  text-transform: capitalize; /* ทำให้ข้อความเริ่มต้นตัวพิมพ์ใหญ่ */
}

.bg-green {
  background-color: #90ee90; /* สีเขียว */
}

.bg-blue {
  background-color: #007bff; /* สีน้ำเงิน */
}

.text-white {
  color: white;
}
.dialog {
  width: 100%; /* กำหนดความกว้างของ dialog */
  max-width: 900px; /* กำหนดความกว้างสูงสุด */
  height: 900px; /* ความสูงปรับตามเนื้อหา */
  max-height: 1000px; /* กำหนดความสูงสูงสุด */
  overflow: hidden;
}

.row {
  display: flex;
  flex-wrap: wrap; /* ให้ย้ายสินค้าไปแถวใหม่เมื่อแถวเต็ม */
  justify-content: space-between; /* จัดระยะห่างระหว่างคอลัมน์ */
}

.col {
  flex: 1 1 30%; /* แบ่งพื้นที่ให้มี 3 คอลัมน์ */
  margin: 10px; /* ระยะห่างระหว่างคอลัมน์ */
}

.q-card {
  height: 100%; /* กำหนดความสูงให้เต็ม */
  border: 1px solid #ccc;
  border-radius: 8px;
}

.q-card-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* สำหรับหน้าจอที่มีขนาดเล็ก (มือถือ) แสดง 2 คอลัมน์ */
@media (max-width: 768px) {
  .col {
    flex: 1 1 45%; /* แสดง 2 คอลัมน์ */
  }
}

/* สำหรับหน้าจอที่มีขนาดเล็กมาก (มือถือแนวตั้ง) แสดง 1 คอลัมน์ */
@media (max-width: 480px) {
  .col {
    flex: 1 1 100%; /* แสดง 1 คอลัมน์ */
  }
}
.date-align {
  margin-left: -15px;
}
.text-price {
  font-size: large;
  margin-top: 5px;
  margin-bottom: 5px;
  font-weight: bold;
  color: #007bff;
}
.text-detail {
  color: #444444;
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
.menu-text {
  margin-right: 10px;
  font-weight: bold;
  font-size: large;
  color: #240c10;
}
</style>
