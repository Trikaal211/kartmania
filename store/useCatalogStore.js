import { defineStore } from "pinia"

export const useCatalogStore = defineStore("catalog", {
  state: () => ({
    products: [],
    loading: false,

    filters: {
      category: null,
      rating:null
    },
 

    sortBy: null // 'price-low' | 'price-high'
  }),  

  actions: {
    async fetchProducts() {
      this.loading = true
      try {
        const res = await fetch("https://fakestoreapi.com/products")
        this.products = await res.json()
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
setRating(rating) {
  this.filters.rating = Number(rating)
},
    setCategory(category) {
      this.filters.category = category
    },

    setSort(sort) {
      this.sortBy = sort
    },

    clearAll() {
      this.filters.category = null
      this.sortBy = null,
      this.filters.rating = null
    }
  },

  getters: {
    filteredProducts(state) {
      let list = [...state.products]

      // CATEGORY FILTER
      if (state.filters.category) {
        list = list.filter(
          item => item.category === state.filters.category
        )
      }
    if (state.filters.rating) {
  list = list.filter(
    item => item.rating?.rate >= state.filters.rating
  )
}

      // SORTING
      if (state.sortBy === "price-low") {
        list.sort((a, b) => a.price - b.price)
      }

      if (state.sortBy === "price-high") {
        list.sort((a, b) => b.price - a.price)
      }

      return list
    }
  }
})
