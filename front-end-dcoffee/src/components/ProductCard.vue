<template>
  <q-card class="my-card">
    <!-- ข้อมูลสินค้า -->
    <div class="row q-mt-sm">
      <div class="col">
        <q-img class="q-ml-sm" :src="product.image" style="height: 100px; width: 80px" />
      </div>
      <div class="col q-mr-md">
        <div class="custom-h6 q-mt-md">{{ product.name }}</div>
        <div class="custom-h6">฿ {{ product.price.toFixed(2) }}</div>
      </div>
    </div>

    <!-- Type และ Size -->
    <div class="row">
      <div class="col">
        <div class="q-ml-md" style="font-size: 13px">Type</div>
        <div class="q-ml-md">
          <q-btn
            v-for="type in formattedTypes"
            :key="type"
            :label="type"
            flat
            round
            dense
            class="q-mr-xs bg-grey-4 font-btn"
            :class="{
              'btn-primary': selectedType === type,
              'btn-no-border': selectedType !== type,
              'btn-disabled': isBakeryOrFood,
            }"
            :disable="isBakeryOrFood"
            @click="selectType(type)"
          />
        </div>
      </div>

      <div class="col">
        <div class="q-ml-sm" style="font-size: 13px">Size</div>
        <div class="q-ml-sm">
          <q-btn
            v-for="size in formattedSizes"
            :key="size"
            :label="size"
            flat
            round
            dense
            class="q-mr-xs bg-grey-4 font-btn"
            :class="{
              'btn-primary': selectedSize === size,
              'btn-no-border': selectedSize !== size,
              'btn-disabled': isBakeryOrFood,
            }"
            :disable="isBakeryOrFood"
            @click="selectSize(size)"
          />
        </div>
      </div>
    </div>

    <!-- Sweet Level และ Amount -->
    <div class="row">
      <div class="col">
        <div class="q-ml-md q-mt-sm" style="font-size: 13px">Sweet Level</div>
        <div class="q-ml-md">
          <q-select
            outlined
            dense
            v-model="selectedSweetLevel"
            :options="formattedSweetLevels"
            emit-value
            map-options
            class="custom-select"
            style="width: 80px; font-size: 11px"
            :disable="isBakeryOrFood"
          />
        </div>
      </div>

      <div class="col">
        <div class="q-ml-sm q-mt-sm" style="font-size: 13px">Amount</div>
        <div class="q-ml-sm amount-buttons">
          <q-btn
            flat
            round
            dense
            icon="remove"
            class="btn-amount bg-grey-4 font-btn q-mr-xs"
            :class="{ 'btn-no-border': amount > 1 }"
            @click="decreaseAmount"
          />
          <div class="q-mx-xs amount-display">{{ amount }}</div>
          <q-btn
            flat
            round
            dense
            icon="add"
            class="btn-amount bg-grey-4 font-btn q-mr-xs"
            @click="increaseAmount"
          />
        </div>
      </div>
    </div>

    <!-- Add to Cart Button -->
    <q-card-actions>
      <div class="row justify-center q-mt-sm">
        <q-btn
          label="Add To Cart"
          color="primary"
          class="rounded-button"
          style="width: 260px; height: 55px; font-size: 16px; font-weight: bold"
          @click="select"
        />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { type Product } from 'src/models'
import { ref, computed, onMounted } from 'vue'
import { Notify } from 'quasar'

// ตัวแปรสำหรับ Type, Size, Sweet Level และ Amount
const selectedType = ref<string | null>(null)
const selectedSize = ref<string | null>(null)
const selectedSweetLevel = ref<number | null>(null)
const amount = ref<number>(1)

const props = defineProps<{
  product: Product
}>()

// ตรวจสอบว่าเป็น Bakery หรือ Food
const isBakeryOrFood = computed(
  () => props.product.categoryId === 2 || props.product.categoryId === 3,
)

// Type และ Size
const formattedTypes = computed(() => {
  return isBakeryOrFood.value ? ['none'] : props.product.type || []
})

const formattedSizes = computed(() => {
  return isBakeryOrFood.value ? ['none'] : props.product.size || []
})

// Sweet Level
const formattedSweetLevels = computed(() => {
  return isBakeryOrFood.value
    ? [{ label: 'none', value: 0 }]
    : (props.product.sweetLevel || []).map((level) => ({
        label: `${level * 50}%`,
        value: level,
      }))
})

onMounted(() => {
  selectedSweetLevel.value = isBakeryOrFood.value ? 0 : 2
})

const selectType = (type: string) => {
  if (!isBakeryOrFood.value) {
    selectedType.value = selectedType.value === type ? null : type
  }
}

const selectSize = (size: string) => {
  if (!isBakeryOrFood.value) {
    selectedSize.value = selectedSize.value === size ? null : size
  }
}

const increaseAmount = () => {
  amount.value++
}

const decreaseAmount = () => {
  if (amount.value > 1) amount.value--
}

// Emit เมื่อเลือก
const emit = defineEmits<{
  select: [
    product: Product,
    selectedType: string | null,
    selectedSize: string | null,
    selectedSweetLevel: number | null,
    amount: number,
  ]
}>()

const select = () => {
  if (!selectedType.value && !isBakeryOrFood.value) {
    Notify.create({
      message: 'Please select a Type before adding to cart.',
      color: 'negative',
      position: 'top',
    })
    return
  }

  if (!selectedSize.value && !isBakeryOrFood.value) {
    Notify.create({
      message: 'Please select a Size before adding to cart.',
      color: 'negative',
      position: 'top',
    })
    return
  }

  emit(
    'select',
    props.product,
    selectedType.value,
    selectedSize.value,
    selectedSweetLevel.value,
    amount.value,
  )

  // Reset ค่า
  selectedType.value = null
  selectedSize.value = null
  selectedSweetLevel.value = isBakeryOrFood.value ? 0 : 2
  amount.value = 1
}
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 180px;
}

.btn-no-border {
  border: none;
  color: black;
}

.btn-primary {
  border: 2px solid var(--q-primary);
  color: black;
}

.font-btn {
  font-size: 11px;
}

.amount-buttons {
  display: flex;
  align-items: center;
}

.btn-amount {
  width: 28px;
  height: 28px;
  font-size: 12px;
  border-radius: 50%;
}

.amount-display {
  font-size: 15px;
  text-align: center;
  min-width: 20px;
}

.custom-h6 {
  font-family: var(--q-font-family);
  font-weight: 600;
  font-size: 18px;
  line-height: 1.3;
  color: var(--q-dark);
}
</style>
