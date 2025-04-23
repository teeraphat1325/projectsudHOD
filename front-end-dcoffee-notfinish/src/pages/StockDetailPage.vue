<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">รายละเอียดการเช็คสต็อก</div>
        <div>วันที่: {{ stockDetail.date }}</div>
        <div>ผู้ตรวจสอบ: {{ stockDetail.checker }}</div>
        <div>
          สถานะ:
          <q-badge :color="stockDetail.status === 'เสร็จสิ้น' ? 'positive' : 'warning'">{{
            stockDetail.status
          }}</q-badge>
        </div>
      </q-card-section>

      <q-card-section>
        <q-table :rows="stockDetail.items" :columns="columns" row-key="code" dense flat>
          <template v-slot:body-cell-actualQty="props">
            <q-input
              v-model.number="props.row.actualQty"
              dense
              type="number"
              @blur="updateDifference(props.row)"
              :disable="isCompleted"
            />
          </template>
          <template v-slot:body-cell-action="props">
            <q-btn
              label="ลบ"
              size="sm"
              color="negative"
              :disable="isCompleted"
              @click="removeItem(props.row.code)"
            />
          </template>
        </q-table>
        <q-btn
          label="บันทึกการเช็คสต็อก"
          color="positive"
          class="q-mt-md"
          @click="completeStockCheck"
          :disable="isCompleted"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCheckStockStore } from 'src/stores/checkStockStore'
import { type QTableColumn } from 'quasar'
import { type CheckStockItem, type CheckStock } from 'src/models'

export default defineComponent({
  setup() {
    const route = useRoute()
    const stockStore = useCheckStockStore()
    const stockId = Number(route.params.id)

    const stockDetail = reactive(
      stockStore.getStockCheckById(stockId) || {
        id: stockId,
        date: '',
        checker: '',
        status: 'กำลังดำเนินการ',
        items: [],
      },
    )

    const isCompleted = computed(() => stockDetail.status === 'เสร็จสิ้น')

    const columns: QTableColumn[] = [
      { name: 'code', label: 'รหัสสินค้า', field: 'code', align: 'left' },
      { name: 'code', label: 'รหัสสินค้า', field: 'code', align: 'left' },
      { name: 'name', label: 'ชื่อสินค้า', field: 'name', align: 'left' },
      { name: 'actualQty', label: 'จำนวนที่นับได้', field: 'actualQty', align: 'right' },
      { name: 'action', label: 'การจัดการ', field: 'action', align: 'center' },
    ]

    const updateDifference = (item: CheckStockItem) => {
      item.difference = item.actualQty - item.systemQty
    }

    const removeItem = (code: string) => {
      stockDetail.items = stockDetail.items.filter((item) => item.code !== code)
    }

    const completeStockCheck = () => {
      stockDetail.status = 'เสร็จสิ้น'
      stockStore.updateStockCheck(stockId, stockDetail as CheckStock)
    }

    return {
      stockDetail,
      columns,
      isCompleted,
      updateDifference,
      removeItem,
      completeStockCheck,
    }
  },
})
</script>
