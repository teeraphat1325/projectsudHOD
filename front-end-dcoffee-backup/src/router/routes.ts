import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/FullScreen.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/mainmenu',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/MainMenuPage.vue') }],
  },
  {
    path: '/stock',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/StockPage.vue') }],
  },
  {
    path: '/stock-detail/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/StockDetailPage.vue') }],
  },
  {
    path: '/pos',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/POSPage.vue') }],
  },
  {
    path: '/order',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/OrderPage.vue') }],
  },
  {
    path: '/customer',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/CustomerPage.vue') }],
  },
  {
    path: '/product',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ProductPage.vue') }],
  },
  {
    path: '/checktime',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/CheckTimePage.vue') }],
  },
  {
    path: '/user',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/UserPage.vue') }],
  },
  {
    path: '/salary',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SalaryPage.vue') }],
  },
  {
    path: '/payment',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/PaymentPage.vue') }],
  },
  {
    path: '/login',
    component: () => import('layouts/FullScreen.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/stock',
    name: 'StockPage',
    component: () => import('pages/StockPage.vue'),
    children: [
      {
        path: 'detail/:id',
        name: 'StockDetailPage',
        component: () => import('pages/StockDetailPage.vue'),
      },
    ],
  },
  {
    path: '/orderstock',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/OrderStockPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
