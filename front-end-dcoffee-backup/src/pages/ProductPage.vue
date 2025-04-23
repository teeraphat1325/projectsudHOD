<template>
  <q-page padding>
    <div>
      <div class="text-h6 q-mb-lg">Product Management</div>
      <div class="row justify-between items-center q-mb-lg">
        <q-input
          filled
          v-model="search"
          label="Search Product"
          debounce="300"
          class="q-mr-md"
          dense
        >
          <template v-slot:append>
            <q-icon name="search" class="cursor-pointer" />
          </template>
        </q-input>
        <q-btn icon="add" color="brown-10" @click="openDialog">Add</q-btn>
      </div>
    </div>

    <q-table :columns="columns" :rows="filteredProducts" flat bordered dense>
      <template v-slot:body-cell-operation="{ row }">
        <div style="display: flex; gap: 8px; justify-content: center">
          <q-img :src="row.image" style="width: 70px; height: 70px; border-radius: 4px" />
          <q-btn flat icon="edit" @click="edit(row)" />
          <q-btn flat icon="delete" @click="remove(row)" />
        </div>
      </template>
    </q-table>

    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 600px">
        <q-card-section>
          <div class="text-h6">{{ id === 0 ? 'Add New Product' : 'Edit Product' }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form ref="form" @submit="save" @reset="reset" class="q-gutter-md">
            <!-- Name Input -->
            <q-input
              filled
              v-model="name"
              label="Name *"
              lazy-rules
              :rules="[(val) => !!val || 'Name is required']"
            />

            <!-- Price Input -->
            <q-input
              filled
              v-model="price"
              type="number"
              label="Price *"
              lazy-rules
              :rules="[(val) => !!val || 'Price is required']"
            />

            <!-- Category Select -->
            <q-select
              v-model="categoryId"
              :options="categories"
              label="Category *"
              lazy-rules
              emit-value
              map-options
              :rules="[(val) => !!val || 'Category is required']"
            />

            <!-- Type Section -->
            <div class="q-mt-lg">
              <div class="text-subtitle2 q-mb-sm">Type</div>
              <q-row>
                <q-col>
                  <q-option-group
                    v-model="type"
                    :options="typeOptions"
                    type="checkbox"
                    label="Select Type"
                    inline
                  />
                </q-col>
              </q-row>
            </div>

            <!-- Size Section -->
            <div class="q-mt-lg">
              <div class="text-subtitle2 q-mb-sm">Size</div>
              <q-row>
                <q-col>
                  <q-option-group
                    v-model="size"
                    :options="sizeOptions"
                    type="checkbox"
                    label="Select Size"
                    inline
                  />
                </q-col>
              </q-row>
            </div>

            <!-- Sweet Level Section -->
            <div class="q-mt-lg">
              <div class="text-subtitle2 q-mb-sm">Sweet Level</div>
              <q-row>
                <q-col>
                  <q-option-group
                    v-model="sweetLevel"
                    :options="sweetLevelOptions"
                    type="checkbox"
                    label="Select Sweet Level"
                    inline
                  />
                </q-col>
              </q-row>
            </div>

            <!-- Image Uploader -->
            <q-uploader
              v-model="imageFiles"
              label="Upload Image"
              accept="image/*"
              @added="onFileChange"
              class="q-mt-lg"
            />

            <!-- Actions -->
            <div>
              <q-btn label="Submit" type="submit" color="primary" />
              <q-btn label="Cancel" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { type QForm, type QTableColumn } from 'quasar'
import { useProductStore } from 'src/stores/productStore'
import type { Product } from 'src/models'
import { useCategoryStore } from 'src/stores/categoryStore'

const productStore = useProductStore()
const search = ref<string>('') // For search input
const dialog = ref(false)
const form = ref<QForm | null>(null)
const id = ref(0)
const name = ref('')
const price = ref(0)
const image = ref<string | null>(null)
const categoryId = ref<number | null>(null)
const type = ref<string[]>([]) // Always an array
const size = ref<string[]>([]) // Always an array
const sweetLevel = ref<number[]>([]) // Always an array

const categoryStore = useCategoryStore()
const categories = computed(() =>
  categoryStore.categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  })),
)

const typeOptions = ref([
  { label: 'Hot', value: 'H' },
  { label: 'Cold', value: 'C' },
  { label: 'Frappe', value: 'F' },
])

const sizeOptions = ref([
  { label: 'Small', value: 'S' },
  { label: 'Medium', value: 'M' },
  { label: 'Large', value: 'L' },
])

const sweetLevelOptions = ref([
  { label: 'No Sugar', value: 0 },
  { label: 'Low Sugar', value: 1 },
  { label: 'Normal Sugar', value: 2 },
  { label: 'Extra Sugar', value: 3 },
])

const columns: QTableColumn[] = [
  { name: 'id', label: 'ID', field: 'id', align: 'center', sortable: true },
  { name: 'name', label: 'Name', field: 'name', align: 'center' },
  {
    name: 'price',
    label: 'Price',
    field: 'price',
    align: 'center',
    format: (val: number) => `${val} ฿`,
  },
  {
    name: 'categoryId',
    label: 'Category',
    field: 'categoryId',
    align: 'center',
    format: (val: number) => {
      console.log('CategoryId Value:', val)
      const category = categories.value.find((cat) => cat.value === val)
      console.log('Mapped Category:', category)
      return category ? category.label : '-'
    },
  },
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    align: 'center',
    format: (val: string[]) => val?.join(', ') || '-',
  },
  {
    name: 'size',
    label: 'Size',
    field: 'size',
    align: 'center',
    format: (val: string[]) => val?.join(', ') || '-',
  },
  {
    name: 'sweetLevel',
    label: 'Sweet Level',
    field: 'sweetLevel',
    align: 'center',
    format: (val: number[]) => val?.join(', ') || '-',
  },
  { name: 'operation', label: '', field: 'operation', align: 'center' },
]

const filteredProducts = computed(() =>
  search.value
    ? productStore.products.filter((product) =>
        product.name.toLowerCase().includes(search.value.toLowerCase()),
      )
    : productStore.products,
)

function openDialog() {
  reset()
  dialog.value = true
}

function edit(row: Product) {
  id.value = row.id
  name.value = row.name
  price.value = row.price
  categoryId.value = row.categoryId
  type.value = row.type || []
  size.value = row.size || []
  sweetLevel.value = row.sweetLevel || []
  image.value = row.image || null
  dialog.value = true
}

function remove(row: Product) {
  productStore.products = productStore.products.filter((p) => p.id !== row.id)
}

function save() {
  console.log('Selected categoryId:', categoryId.value) // ตรวจสอบค่าที่เลือก
  form.value?.validate().then((success) => {
    if (success) {
      const product: Product = {
        id: id.value || productStore.products.length + 1,
        name: name.value,
        price: price.value,
        categoryId: categoryId.value!, // ต้องเป็น 1, 2, หรือ 3
        type: type.value,
        size: size.value,
        sweetLevel: sweetLevel.value,
        image: image.value || '',
      }

      if (id.value === 0) {
        productStore.products.push(product)
      } else {
        const index = productStore.products.findIndex((p) => p.id === id.value)
        if (index !== -1) productStore.products[index] = product
      }

      dialog.value = false
      reset()
    }
  })
}

function reset() {
  form.value?.resetValidation()
  id.value = 0
  name.value = ''
  price.value = 0
  categoryId.value = 0
  type.value = []
  size.value = []
  sweetLevel.value = []
  image.value = null
  dialog.value = false
}

const imageFiles = ref<File[]>([])
function onFileChange(files: readonly File[]) {
  const file = files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      image.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}
</script>
