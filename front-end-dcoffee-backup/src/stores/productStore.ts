import { defineStore, acceptHMRUpdate } from 'pinia'
import { type Product } from 'src/models'
import { ref } from 'vue'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([
    // Coffee
    {
      id: 1,
      name: 'Americano',
      price: 40,
      image: 'product1.png',
      size: ['S', 'M', 'L'],
      type: ['H', 'C'],
      sweetLevel: [0, 1, 2, 3],
      categoryId: 1,
    },
    {
      id: 2,
      name: 'Latte',
      price: 45,
      image: 'product2.png',
      size: ['S', 'M', 'L'],
      type: ['H', 'C', 'F'],
      sweetLevel: [0, 1, 2, 3],
      categoryId: 1,
    },
    {
      id: 3,
      name: 'Mocha',
      price: 50,
      image: 'product3.png',
      size: ['S', 'M', 'L'],
      type: ['H', 'C', 'F'],
      sweetLevel: [0, 1, 2, 3],
      categoryId: 1,
    },
    {
      id: 4,
      name: 'Cappuccino',
      price: 35,
      image: 'product4.png',
      size: ['S', 'M', 'L'],
      type: ['H', 'C'],
      sweetLevel: [0, 1, 2, 3],
      categoryId: 1,
    },
    {
      id: 5,
      name: 'Espresso',
      price: 40,
      image: 'product5.png',
      size: ['S', 'M', 'L'],
      type: ['H'],
      sweetLevel: [0, 1, 2, 3],
      categoryId: 1,
    },
    {
      id: 16,
      name: 'Hot Chocolate',
      price: 30,
      image: 'product16.png',
      size: ['S', 'M', 'L'],
      type: ['H'],
      sweetLevel: [0, 1, 2],
      categoryId: 1,
    },
    {
      id: 19,
      name: 'Milk Tea',
      price: 30,
      image: 'product19.png',
      size: ['S', 'M', 'L'],
      type: ['C', 'F'],
      sweetLevel: [0, 1, 2, 3],
      categoryId: 1,
    },

    // Bakery
    {
      id: 6,
      name: 'Croissant',
      price: 20,
      image: 'product6.png',
      categoryId: 2,
    },
    {
      id: 7,
      name: 'Bagel',
      price: 25,
      image: 'product7.png',
      categoryId: 2,
    },
    {
      id: 8,
      name: 'Muffin',
      price: 30,
      image: 'product8.png',
      categoryId: 2,
    },
    {
      id: 9,
      name: 'Baguette',
      price: 35,
      image: 'product9.png',
      categoryId: 2,
    },
    {
      id: 10,
      name: 'Danish',
      price: 25,
      image: 'product10.png',
      categoryId: 2,
    },
    {
      id: 17,
      name: 'Cookie',
      price: 15,
      image: 'product17.png',
      categoryId: 2,
    },
    {
      id: 18,
      name: 'Brownie',
      price: 25,
      image: 'product18.png',
      categoryId: 2,
    },

    // Food
    {
      id: 11,
      name: 'Pizza Slice',
      price: 50,
      image: 'product11.png',
      categoryId: 3,
    },
    {
      id: 12,
      name: 'Sandwich',
      price: 55,
      image: 'product12.png',
      categoryId: 3,
    },
    {
      id: 13,
      name: 'Pasta',
      price: 60,
      image: 'product13.png',
      categoryId: 3,
    },
    {
      id: 14,
      name: 'Salad',
      price: 40,
      image: 'product14.png',
      categoryId: 3,
    },
    {
      id: 15,
      name: 'Soup',
      price: 35,
      image: 'product15.png',
      categoryId: 3,
    },
    {
      id: 20,
      name: 'Grilled Cheese',
      price: 45,
      image: 'product20.png',
      categoryId: 3,
    },
  ])

  return { products }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot))
}
