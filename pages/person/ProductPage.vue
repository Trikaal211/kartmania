<script setup>
import { onMounted } from "vue"
import { productFilter} from "../../store/useCatalogStore"

const store = productFilter()

onMounted(() => {
  store.fetchProducts()
})
</script>

<template>
  <div style="display:flex; gap:40px">

    <!-- 🔹 FILTER + SORT SECTION -->
    <div style="width:250px">
      <h3>Category</h3>

      <button @click="store.setCategory('electronics')">
        Electronics
      </button>
      <br />

      <button @click="store.setCategory('jewelery')">
        Jewelery
      </button>
      <br />

      <button @click="store.setCategory('men\'s clothing')">
        Men's Clothing
      </button>

      <hr />

      <h3>Sort by Price</h3>

      <button @click="store.setSort('price-low')">
        Low → High
      </button>
      <br />

      <button @click="store.setSort('price-high')">
        High → Low
      </button>

      <hr />

      <button @click="store.clearAll()">
        Clear All
      </button>
    </div>

    <!-- 🔹 PRODUCT LIST SECTION -->
    <div style="flex:1">
      <p v-if="store.loading">Loading products...</p>

      <div v-else>
        <div
          v-for="p in store.filteredProducts"
          :key="p.id"
          style="border:1px solid #ccc; margin-bottom:20px; padding:10px"
        >
          <img :src="p.image" width="100" />
          <h4>{{ p.title }}</h4>
          <p>₹ {{ p.price }}</p>
          <small>{{ p.category }}</small>
        </div>
      </div>
    </div>

  </div>
</template>
