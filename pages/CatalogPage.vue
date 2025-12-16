<script setup>
import { onMounted } from "vue"
import { useCatalogStore } from "../store/useCatalogStore"

const catalogStore = useCatalogStore()

onMounted(() => {
  catalogStore.fetchProducts()
})
</script>

<template>
  <div style="display:flex; gap:32px">

    <!-- 🔹 FILTER / SORT UI -->
    <div style="width:240px">
      <h2>Rating:{{ catalogStore.filters.rating ?? 1 }}</h2>
<input
  type="range"
  min="1"
  max="7"
  step="0.1"
  :value = "catalogStore.filters.rating?? 1"
    @input="catalogStore.setRating($event.target.value)"
>


      <h3>Category</h3>

      <button @click="catalogStore.setCategory('electronics')">
        Electronics
      </button>
      <br />

      <button @click="catalogStore.setCategory('jewelery')">
        Jewelery
      </button>
      <br />

      <button @click="catalogStore.setCategory('men\'s clothing')">
        Men's Clothing
      </button>

      <hr />

      <h3>Sort by Price</h3>

      <button @click="catalogStore.setSort('price-low')">
        Low → High
      </button>
      <br />

      <button @click="catalogStore.setSort('price-high')">
        High → Low
      </button>

      <hr />

      <button @click="catalogStore.clearAll()">
        Clear All
      </button>
    </div>

    <!-- 🔹 PRODUCT LIST -->
    <div style="flex:1">
      <p v-if="catalogStore.loading">Loading products...</p>

      <div v-else>
        <div
          v-for="item in catalogStore.filteredProducts"
          :key="item.id"
          style="border:1px solid #ddd; padding:12px; margin-bottom:16px"
        >
          <img :src="item.image" width="90" />
          <h4>{{ item.title }}</h4>
          <p>₹ {{ item.price }}</p>
          <small>{{ item.category }}</small>
        </div>
      </div>
    </div>

  </div>
</template>
