<script setup>
import { ref, onMounted } from 'vue'
import { useShopStore } from '../../store/shop'

const filtered = ref([])
const minPrice = ref(1)
const maxPrice = ref(1000)

const store = useShopStore()

onMounted(() => {
  store.fetchProducts().then(() => {
    filtered.value = store.products   // default me sab show
  })
})

// CATEGORY FILTER
function filter(category) {
  filtered.value = store.products.filter(p => p.category === category)
}

// PRICE RANGE FILTER
function filterByRange() {
  filtered.value = store.products.filter(p => 
    p.price >= minPrice.value && p.price <= maxPrice.value
  )
}
</script>


<template>

  <!-- PRICE RANGE SLIDERS -->
  <div>
    <p>Min: {{ minPrice }}</p>
    <input 
      type="range"
      min="1"
      max="1000"
      step="10"
      v-model="minPrice"
      @input="filterByRange"
    >

    <p>Max: {{ maxPrice }}</p>
    <input 
      type="range"
      min="1"
      max="1000"
      step="10"
      v-model="maxPrice"
      @input="filterByRange"
    >
  </div>

  <!-- CATEGORY + PRICE LIST -->
  <div>
    <ul v-for="p in store.products" :key="p.id">
      <li @click="filter(p.category)">
        {{ p.category }}
      </li>

      <li @click="filtered = store.products.filter(x => x.price === p.price)">
        ₹{{ p.price }}
      </li>
    </ul>
  </div>

  <!-- FILTERED PRODUCT LIST -->
  <div>
    <p v-if="store.loading">Loading...</p>

    <ul v-else>
      <li v-for="c in filtered" :key="c.id">
        {{ c.id }}
        <img :src="c.image" alt="">
      </li>
    </ul>
  </div>

</template>

