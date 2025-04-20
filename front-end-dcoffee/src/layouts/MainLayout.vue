<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="custom-header">
      <q-toolbar>
        <!-- Toggle Button with Custom Color -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          color="#FFF"
        />

        <q-toolbar-title class="header-title"></q-toolbar-title>

        <!-- Current Date and Time -->
        <div class="q-ml-auto row items-center q-gutter-sm">
          <!-- Date -->
          <q-chip outline class="q-pa-sm custom-chip">
            <q-icon name="event" class="q-mr-sm chip-icon" />
            <span class="chip-text">{{ currentDate }}</span>
          </q-chip>

          <!-- Time -->
          <q-chip outline class="q-pa-sm custom-chip">
            <q-icon name="access_time" class="q-mr-sm chip-icon" />
            <span class="chip-text">{{ currentTime }}</span>
          </q-chip>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer v-model="leftDrawerOpen" overlay bordered>
      <!-- User Profile Section -->
      <div class="q-pa-md">
        <div class="row items-center q-gutter-sm">
          <!-- Avatar -->
          <q-avatar size="64px" rounded>
            <img src="https://cdn.quasar.dev/img/avatar.png" alt="User Avatar" />
          </q-avatar>

          <!-- Name and Role -->
          <div>
            <div class="text-bold text-lg custom-text-color">
              {{ userStore.currentUser?.name || 'Guest' }}
            </div>
            <div class="text-caption custom-text-color">
              {{ userStore.currentUser?.roles || 'Visitor' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Links List -->
      <q-list>
        <q-item-label header class="custom-text-color"></q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>

      <!-- Spacer to push Log Out button to the bottom -->
      <div class="q-mt-auto"></div>

      <!-- Log Out Button -->
      <div class="logout-container">
        <q-btn
          dense
          flat
          outline
          class="full-width custom-logout-btn"
          icon="logout"
          label="Log Out"
          color="primary"
          @click="handleLogout"
        />
      </div>
    </q-drawer>

    <!-- Overlay Background -->
    <div v-if="leftDrawerOpen" class="overlay-background" @click="toggleLeftDrawer"></div>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/userStore'

// Reactive state for current date and time
const currentDate = ref('')
const currentTime = ref('')
const userStore = useUserStore()

// Function to update the date and time
function updateDateTime() {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Update time every second
onMounted(() => {
  updateDateTime()
  setInterval(updateDateTime, 1000)
})

// Drawer toggle logic
const leftDrawerOpen = ref(false)
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Links list
const linksList: EssentialLinkProps[] = [
  {
    title: 'Main Menu',
    caption: 'Main Menu',
    icon: 'home',
    link: 'mainmenu',
  },
  {
    title: 'Point Of Sale',
    caption: 'Point Of Sale',
    icon: 'point_of_sale',
    link: 'pos',
  },
  {
    title: 'Order',
    caption: 'Order Management',
    icon: 'receipt',
    link: 'order',
  },
  {
    title: 'Customer',
    caption: 'Customer Management',
    icon: 'shopping_cart',
    link: 'customer',
  },
  {
    title: 'Product',
    caption: 'Product management',
    icon: 'coffee',
    link: 'product',
  },
  {
    title: 'Stock',
    caption: 'Stock Management',
    icon: 'inventory',
    link: 'stock',
  },
  {
    title: 'OrderStock',
    caption: 'OrderStock Management',
    icon: 'inventory',
    link: 'orderstock',
  },
  {
    title: 'Check Time',
    caption: 'Check Time',
    icon: 'schedule',
    link: 'checktime',
  },
  {
    title: 'User',
    caption: 'User Management',
    icon: 'manage_accounts',
    link: 'user',
  },
  {
    title: 'Payment',
    caption: 'Payment management',
    icon: 'money',
    link: 'payment',
  },
  {
    title: 'Salary',
    caption: 'Salary management',
    icon: 'monetization_on',
    link: 'salary',
  },
]

// Router instance
const router = useRouter()

// Handle logout
function handleLogout() {
  router.push('/login') // Redirect to the login page
}
</script>

<style scoped>
/* Header styles */
.custom-header {
  background-color: #240c10; /* Header background color */
  border-bottom: 2px solid #fff; /* Optional border color */
}

/* Header title text */
.header-title {
  color: #fff; /* Header text color */
  font-family: 'Inter', sans-serif; /* Font family */
  font-weight: bold; /* Bold font */
}

/* Chip styles */
.custom-chip {
  border-color: #fff; /* Chip outline color */
  color: #fff; /* Text color inside chip */
}

.chip-icon {
  color: #fff; /* Icon color inside chip */
}

.chip-text {
  font-family: 'Inter', sans-serif; /* Font family for chip text */
  font-weight: bold; /* Bold text */
}

/* Avatar name and role colors */
.custom-text-color {
  color: #240c10; /* Text color */
}

/* Overlay background */
.overlay-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
  z-index: 999; /* Above content but below drawer */
}

/* Log Out Button Styles */
.logout-container {
  position: absolute;
  bottom: 0;
  width: 100%; /* Ensure the button spans the full width */
  padding: 16px; /* Add padding around the button */
  background: #fff; /* Optional: background color to match the drawer */
}

.custom-logout-btn {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  border-color: #fff; /* Border color */
  color: #fff; /* Text and icon color */
}

.full-width {
  width: 100%; /* Make button span the full width */
}

/* Spacer to push content */
.q-mt-auto {
  flex-grow: 1;
}
</style>
