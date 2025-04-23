<template>
  <q-page class="flex flex-center column login-page">
    <div class="row full-width justify-center items-center">
      <!-- Left side - Image -->
      <div class="col-6 image-container">
        <img src="public/hot_chocolate_logo.jpg" alt="Coffee" class="coffee-image" />
      </div>

      <!-- Right side - Login Form -->
      <div class="col-6 form-container">
        <q-card class="login-card q-pa-lg">
          <!-- Coffee Icon -->
          <div class="text-center q-mb-lg">
            <q-icon name="coffee" size="4rem" color="brown-9" />
          </div>

          <!-- Login Header -->
          <q-card-section>
            <div class="text-h4 text-weight-bold text-center q-mb-sm">LOGIN</div>
            <div class="text-subtitle1 text-center q-mb-lg">Alphabet Coffee Shop</div>
          </q-card-section>

          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <!-- Email Input -->
            <q-input
              filled
              v-model="email"
              label="Username"
              class="input-field"
              :rules="[
                (val) => (val && val.length > 0) || 'Email is required',
                (val) => /.+@.+\..+/.test(val) || 'Please enter a valid email',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="person" color="brown-9" />
              </template>
            </q-input>

            <!-- Password Input -->
            <q-input
              filled
              type="password"
              v-model="password"
              label="Password"
              class="input-field"
              :rules="[(val) => (val && val.length > 0) || 'Password is required']"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="brown-9" />
              </template>
            </q-input>

            <!-- Login Button -->
            <div class="row justify-center q-mt-lg">
              <q-btn
                label="LOGIN"
                type="submit"
                class="full-width login-btn"
                size="large"
                color="brown-9"
              />
            </div>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/authStore'
const $q = useQuasar()
const router = useRouter()
const email = ref('')
const password = ref('')
const authStore = useAuthStore()
async function onSubmit() {
  if (await authStore.login(email.value, password.value)) {
    const user = authStore.user
    console.log('Logged in user:', user)
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      type: 'positive',
      position: 'top',
      message: `Welcome, ${user?.name}!`,
      icon: 'cloud_done',
    })
    router.push('/mainmenu') // เปลี่ยนไปยังหน้าหลัก
  } else {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      type: 'negative',
      position: 'top',
      message: 'Invalid email or password',
      icon: 'error',
    })
  }
}

function onReset() {
  email.value = ''
  password.value = ''
}
</script>

<style scoped>
.login-page {
  background-color: #240c10;
  min-height: 100vh;
}

.image-container {
  padding: 2rem;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coffee-image {
  width: 90%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 16px;
}

.form-container {
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 450px;
  border-radius: 16px;
  background: white;
}

.input-field {
  border-radius: 8px;
}

.input-field :deep(.q-field__control) {
  background-color: #f5f5f5;
}

.login-btn {
  border-radius: 8px;
  font-weight: bold;
}
</style>
