import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useProductStore = defineStore('productStore', () => {
  const route = useRoute()
  const router = useRouter()
  
  // ==================== STATE ====================
  const state = ref({
    // Product data
    products: [],
    filteredAndSortedProducts: [],
    allProducts: [],
    pagination: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
      perPage: 12,
      from: 0,
      to: 0
    },
    
    // Filter options
    categories: [],
    colors: [],
    sizes: [],
    brands: [],
    
    // Filter counts
    categoryCounts: {},
    brandCounts: {},
    colorCounts: {},
    sizeCounts: {},
    
    // Current filters
    filters: {
      category: '',
      sortBy: 'popularity',
      page: 1,
      limit: 12,
      color: '',
      size: '',
      brand: '',
      minPrice: 0,
      maxPrice: 50000
    },
    
    isLoading: false,
    hasInitialized: false,
    isUpdatingFromURL: false,
    urlUpdateInProgress: false
  })

  // ==================== GETTERS ====================
  
  const products = computed(() => state.value.filteredAndSortedProducts)
  const categories = computed(() => state.value.categories)
  const colors = computed(() => state.value.colors)
  const sizes = computed(() => state.value.sizes)
  const brands = computed(() => state.value.brands)
  const pagination = computed(() => state.value.pagination)
  const filters = computed(() => state.value.filters)
  const isLoading = computed(() => state.value.isLoading)
  const hasInitialized = computed(() => state.value.hasInitialized)
  
  const availableColors = computed(() => {
    if (!state.value.allProducts.length || !state.value.colors.length) {
      return []
    }
    
    return state.value.colors.map(color => ({
      name: color,
      hex: getColorHex(color),
      count: state.value.colorCounts[color] || 0
    })).filter(color => color.count > 0)
  })
  
  const availableSizes = computed(() => {
    if (!state.value.allProducts.length) return []
    
    return state.value.sizes.map(size => ({
      name: size.name,
      count: state.value.sizeCounts[size.name] || 0
    })).filter(size => size.count > 0)
  })
  
  const availableBrands = computed(() => {
    if (!state.value.allProducts.length) return []
    
    return state.value.brands.map(brand => ({
      ...brand,
      count: state.value.brandCounts[brand.name] || 0
    })).filter(brand => brand.count > 0)
  })
  
  const hasActiveFilters = computed(() => {
    const f = state.value.filters
    return f.category || f.color || f.size || f.brand || 
           f.minPrice > 0 || f.maxPrice < defaultMaxPrice.value ||
           f.sortBy !== 'popularity'
  })
  
  const defaultMaxPrice = computed(() => {
    if (state.value.allProducts.length === 0) return 50000
    const maxPrice = Math.max(...state.value.allProducts.map(p => p.price || 0), 50000)
    return Math.ceil(maxPrice / 1000) * 1000
  })

  // ==================== API ENDPOINTS ====================
  
  const API_ENDPOINTS = {
    categories: 'https://kartmania-api.vibrantick.org/common/product-category/read',
    colors: 'https://kartmania-api.vibrantick.org/common/color/read',
    sizes: 'https://kartmania-api.vibrantick.org/common/size/read',
    brands: 'https://kartmania-api.vibrantick.org/common/brand/read',
    graphql: 'https://kartmania-api.vibrantick.org/graphql'
  }
  
  // ==================== HELPER FUNCTIONS ====================
  
  const getProductColor = (product) => {
    return product.attributes?.[0]?.color || null
  }
  
  const getProductSize = (product) => {
    return product.attributes?.[0]?.size || null
  }
  
  const getProductBrand = (product) => {
    return product.brand?.name || null
  }
  
  const getDiscountedPrice = (product) => {
    if (!product.price) return 0
    const price = Number(product.price)
    if (product.discountValue && product.discountValue > 0) {
      return Math.round(price * (1 - product.discountValue / 100))
    }
    return price
  }
  
  const getProductRating = (product) => {
    if (!product.reviews?.length) return 0
    const total = product.reviews.reduce((sum, review) => sum + (review.rating || 0), 0)
    return total / product.reviews.length
  }
  
  const getColorHex = (colorName) => {
    if (!colorName) return '#007bff'
    
    const colorMap = {
      'Black': '#000000',
      'Blue': '#007bff',
      'Green': '#28a745',
      'Red': '#dc3545',
      'White': '#ffffff',
      'Gray': '#6c757d',
      'Grey': '#6c757d',
      'Purple': '#6f42c1',
      'Pink': '#e83e8c',
      'Yellow': '#ffc107',
      'Orange': '#fd7e14',
      'Brown': '#795548',
      'Navy': '#001f3f',
      'Teal': '#20c997',
      'Maroon': '#800000',
      'Gold': '#ffd700'
    }
    return colorMap[colorName] || '#007bff'
  }
  
  const getProductImage = (product) => {
    if (!product.images || !product.images.length) {
      return '/assets/images/placeholder.jpg'
    }
    
    // Try to find primary image
    const primaryImage = product.images.find(img => img.isPrimary === true)
    if (primaryImage?.imageUrl) {
      return primaryImage.imageUrl
    }
    
    // Otherwise return first image
    const firstImage = product.images[0]?.imageUrl
    if (firstImage) {
      return firstImage
    }
    
    return '/assets/images/placeholder.jpg'
  }
  
  // ==================== CLIENT-SIDE SORTING ====================
  
  const applySorting = (products, sortType) => {
    if (!products.length || !sortType || sortType === 'popularity') {
      return [...products].sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    }
    
    const sorted = [...products]
    
    switch(sortType) {
      case 'price-low':
        return sorted.sort((a, b) => {
          const priceA = getDiscountedPrice(a)
          const priceB = getDiscountedPrice(b)
          return priceA - priceB
        })
        
      case 'price-high':
        return sorted.sort((a, b) => {
          const priceA = getDiscountedPrice(a)
          const priceB = getDiscountedPrice(b)
          return priceB - priceA
        })
        
      case 'newest':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0)
          const dateB = new Date(b.createdAt || 0)
          return dateB - dateA
        })
        
      case 'brand':
        return sorted.sort((a, b) => {
          const brandA = getProductBrand(a) || ''
          const brandB = getProductBrand(b) || ''
          return brandA.localeCompare(brandB)
        })
        
      default:
        return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    }
  }
  
  // ==================== FILTER & SORT PRODUCTS ====================
  
  const filterAndSortProducts = () => {
    console.log('=== FILTER AND SORT START ===')
    console.log('All products count:', state.value.allProducts.length)
    console.log('Current filters:', state.value.filters)
    
    if (state.value.allProducts.length === 0) {
      console.log('No products to filter')
      state.value.filteredAndSortedProducts = []
      state.value.pagination = {
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 12,
        from: 0,
        to: 0
      }
      return
    }
    
    // Start with all products
    let filtered = [...state.value.allProducts]
    const currentFilters = state.value.filters
    
    // Apply filters
    if (currentFilters.category) {
      filtered = filtered.filter(product => 
        product.category?.name === currentFilters.category
      )
    }
    
    if (currentFilters.color) {
      filtered = filtered.filter(product => 
        getProductColor(product) === currentFilters.color
      )
    }
    
    if (currentFilters.size) {
      filtered = filtered.filter(product => 
        getProductSize(product) === currentFilters.size
      )
    }
    
    if (currentFilters.brand) {
      filtered = filtered.filter(product => 
        product.brand?.name === currentFilters.brand
      )
    }
    
    // Apply price filter
    if (currentFilters.minPrice > 0 || currentFilters.maxPrice < defaultMaxPrice.value) {
      filtered = filtered.filter(product => {
        const price = getDiscountedPrice(product)
        return price >= currentFilters.minPrice && price <= currentFilters.maxPrice
      })
    }
    
    // Apply sorting
    filtered = applySorting(filtered, currentFilters.sortBy)
    
    // Update products
    state.value.products = filtered
    
    // Apply pagination
    const page = currentFilters.page
    const limit = currentFilters.limit
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    
    // Update filtered and sorted products
    state.value.filteredAndSortedProducts = filtered.slice(startIndex, endIndex)
    
    // Update pagination
    state.value.pagination = {
      currentPage: page,
      lastPage: Math.ceil(filtered.length / limit),
      total: filtered.length,
      perPage: limit,
      from: startIndex + 1,
      to: Math.min(endIndex, filtered.length)
    }
    
    console.log('Filtered products:', state.value.filteredAndSortedProducts.length)
    console.log('Pagination:', state.value.pagination)
    console.log('=== FILTER AND SORT END ===')
  }
  
  // ==================== URL SYNC FUNCTIONS ====================
  
  const parseFiltersFromURL = () => {
    const query = route.query
    
    const newFilters = { 
      category: '',
      sortBy: 'popularity',
      page: 1,
      limit: 12,
      color: '',
      size: '',
      brand: '',
      minPrice: 0,
      maxPrice: defaultMaxPrice.value
    }
    
    // Parse from URL
    if (query.category) {
      newFilters.category = decodeURIComponent(query.category)
    }
    
    if (query.color) {
      newFilters.color = query.color
    }
    
    if (query.size) {
      newFilters.size = query.size
    }
    
    if (query.brand) {
      newFilters.brand = decodeURIComponent(query.brand)
    }
    
    if (query.sort) {
      newFilters.sortBy = query.sort
    }
    
    if (query.page) {
      newFilters.page = parseInt(query.page) || 1
    }
    
    if (query.min_price) {
      newFilters.minPrice = parseInt(query.min_price) || 0
    }
    
    if (query.max_price) {
      newFilters.maxPrice = parseInt(query.max_price) || defaultMaxPrice.value
    }
    
    return newFilters
  }
  
  const updateURLFromFilters = (filters) => {
    if (state.value.urlUpdateInProgress) {
      return
    }
    
    const query = {}
    
    // Only add to URL if filter is active
    if (filters.category) query.category = encodeURIComponent(filters.category)
    if (filters.color) query.color = filters.color
    if (filters.size) query.size = filters.size
    if (filters.brand) query.brand = encodeURIComponent(filters.brand)
    if (filters.sortBy !== 'popularity') query.sort = filters.sortBy
    if (filters.minPrice > 0) query.min_price = filters.minPrice
    if (filters.maxPrice < defaultMaxPrice.value) query.max_price = filters.maxPrice
    if (filters.page > 1) query.page = filters.page
    
    // Mark that we're updating URL
    state.value.urlUpdateInProgress = true
    
    router.push({ 
      path: route.path, 
      query 
    }, undefined, { 
      shallow: true 
    }).finally(() => {
      // Small delay to ensure everything is processed
      setTimeout(() => {
        state.value.urlUpdateInProgress = false
      }, 50)
    })
  }
  
  // ==================== CALCULATE FILTER COUNTS ====================
  
  const calculateFilterCounts = (products) => {
    const categoryCounts = {}
    const brandCounts = {}
    const colorCounts = {}
    const sizeCounts = {}
    
    products.forEach(product => {
      // Category count
      const categoryName = product.category?.name || 'Uncategorized'
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1
      
      // Brand count
      const brandName = product.brand?.name
      if (brandName) {
        brandCounts[brandName] = (brandCounts[brandName] || 0) + 1
      }
      
      // Color count
      const color = getProductColor(product)
      if (color) {
        colorCounts[color] = (colorCounts[color] || 0) + 1
      }
      
      // Size count
      const size = getProductSize(product)
      if (size) {
        sizeCounts[size] = (sizeCounts[size] || 0) + 1
      }
    })
    
    state.value.categoryCounts = categoryCounts
    state.value.brandCounts = brandCounts
    state.value.colorCounts = colorCounts
    state.value.sizeCounts = sizeCounts
  }
  
  // ==================== CREATE FALLBACK DATA ====================
  
  const createFallbackData = () => {
    const dummyProducts = [ 
      {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 2999,
        discountValue: 15,
        stock: 25,
        popularity: 8,
        createdAt: new Date().toISOString(),
        brand: { name: "AudioTech", logo: null },
        category: { id: 1, name: "Electronics" },
        images: [{ 
          isPrimary: true, 
          imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
        }],
        reviews: [
          { rating: 4, review: "Good sound quality" },
          { rating: 5, review: "Excellent battery life" }
        ],
        attributes: [{ id: 1, color: "Black", size: null }]
      },
      {
        id: 2,
        name: "Men's Casual T-Shirt",
        price: 899,
        discountValue: 0,
        stock: 50,
        popularity: 6,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        brand: { name: "UrbanWear", logo: null },
        category: { id: 2, name: "Clothing" },
        images: [{ 
          isPrimary: true, 
          imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
        }],
        reviews: [
          { rating: 5, review: "Very comfortable" },
          { rating: 4, review: "Good quality fabric" }
        ],
        attributes: [{ id: 2, color: "Blue", size: "M" }]
      },
      {
        id: 3,
        name: "Smart Watch Series 5",
        price: 12999,
        discountValue: 20,
        stock: 15,
        popularity: 9,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        brand: { name: "TechWear", logo: null },
        category: { id: 1, name: "Electronics" },
        images: [{ 
          isPrimary: true, 
          imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
        }],
        reviews: [
          { rating: 5, review: "Amazing features" },
          { rating: 4, review: "Good battery backup" }
        ],
        attributes: [{ id: 3, color: "Black", size: null }]
      },
      {
        id: 4,
        name: "Running Shoes",
        price: 3499,
        discountValue: 10,
        stock: 30,
        popularity: 7,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        brand: { name: "RunFast", logo: null },
        category: { id: 3, name: "Footwear" },
        images: [{ 
          isPrimary: true, 
          imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
        }],
        reviews: [
          { rating: 5, review: "Very comfortable for running" },
          { rating: 4, review: "Good grip" }
        ],
        attributes: [{ id: 4, color: "Red", size: "9" }]
      }
    ]
    
    state.value.allProducts = dummyProducts
    calculateFilterCounts(dummyProducts)
  }
  
  // ==================== ACTIONS ====================
  
  const fetchFilterOptions = async () => {
    try {
      const [categoriesRes, colorsRes, sizesRes, brandsRes] = await Promise.all([
        fetch(API_ENDPOINTS.categories),
        fetch(API_ENDPOINTS.colors),
        fetch(API_ENDPOINTS.sizes),
        fetch(API_ENDPOINTS.brands)
      ])
      
      const [categoriesData, colorsData, sizesData, brandsData] = await Promise.all([
        categoriesRes.json(),
        colorsRes.json(),
        sizesRes.json(),
        brandsRes.json()
      ])
      
      // Categories
      if (categoriesData.data?.length) {
        state.value.categories = categoriesData.data.map(cat => ({
          id: cat.id,
          name: cat.name,
          image: cat.image,
          productCount: cat._count?.products || 0
        }))
      }
      
      // Colors - handle different response formats
      if (colorsData.colors && Array.isArray(colorsData.colors)) {
        state.value.colors = colorsData.colors
      } else if (colorsData.data && Array.isArray(colorsData.data)) {
        state.value.colors = colorsData.data.map(c => c.name || c.color)
      } else if (colorsData && Array.isArray(colorsData)) {
        state.value.colors = colorsData
      } else {
        state.value.colors = ["Black", "White", "Blue", "Red", "Green", "Yellow", "Pink", "Purple", "Gray"]
      }
      
      // Sizes
      if (sizesData.sizes?.length) {
        state.value.sizes = sizesData.sizes.map(size => ({
          id: size.id,
          name: size.size
        }))
      }
      
      // Brands
      if (brandsData.data?.length) {
        state.value.brands = brandsData.data.map(brand => ({
          id: brand.id,
          name: brand.name,
          logo: brand.logo,
          description: brand.description,
          seller: brand.Seller?.name || ''
        }))
      }
      
      return true
    } catch (error) {
      console.error('Error fetching filter options:', error)
      
      // Fallback data
      state.value.colors = ["Black", "White", "Blue", "Red", "Green"]
      state.value.categories = []
      state.value.sizes = []
      state.value.brands = []
      
      return false
    }
  }
  
  const fetchAllProducts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.graphql, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query AllProducts {
              productFilter(
                page: 1,
                limit: 1000,
                minPrice: 0,
                maxPrice: 50000
              ) {
                data {
                  id
                  name
                  price
                  discountValue
                  stock
                  popularity
                  createdAt
                  brand {
                    name
                    logo
                  }
                  category {
                    id
                    name
                  }
                  images {
                    isPrimary
                    imageUrl
                  }
                  reviews {
                    rating
                    review
                  }
                  attributes {
                    id
                    color
                    size
                  }
                }
                pagination {
                  total
                }
              }
            }
          `
        })
      })
      
      const result = await response.json()
      
      if (result.data?.productFilter?.data) {
        state.value.allProducts = result.data.productFilter.data.map(product => {
          // Fix image URLs
          if (product.images?.length > 0) {
            product.images = product.images.map(img => {
              if (img.imageUrl && !img.imageUrl.startsWith('http')) {
                if (img.imageUrl.startsWith('/')) {
                  img.imageUrl = `https://kartmania-api.vibrantick.org${img.imageUrl}`
                } else {
                  img.imageUrl = `https://kartmania-api.vibrantick.org/${img.imageUrl}`
                }
              }
              return img
            })
          }
          return product
        })
        
        // Calculate all counts
        calculateFilterCounts(state.value.allProducts)
        
        // Set default max price
        if (state.value.allProducts.length > 0) {
          const maxProductPrice = Math.max(...state.value.allProducts.map(p => p.price || 0))
          const calculatedMaxPrice = Math.ceil(maxProductPrice / 1000) * 1000
          state.value.filters.maxPrice = calculatedMaxPrice
        }
        
        return true
      } else {
        console.error('No products data in response:', result.errors)
        createFallbackData()
        return true
      }
    } catch (error) {
      console.error('Error fetching all products:', error)
      createFallbackData()
      return true
    }
  }
  
  // ==================== MAIN PRODUCT FETCH ====================
  
  const fetchProducts = async () => {
    state.value.isLoading = true
    
    try {
      // Apply filters and sorting locally
      filterAndSortProducts()
      
      return {
        products: state.value.filteredAndSortedProducts,
        pagination: state.value.pagination
      }
    } catch (error) {
      console.error('Error in fetchProducts:', error)
      state.value.products = []
      state.value.filteredAndSortedProducts = []
      state.value.pagination = {
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 12,
        from: 0,
        to: 0
      }
      throw error
    } finally {
      state.value.isLoading = false
    }
  }
  
  // ==================== UPDATE FILTERS ====================
  
  const updateFilters = (newFilters) => {
    // Merge new filters with current filters
    const updatedFilters = { ...state.value.filters, ...newFilters }
    
    // Reset to page 1 if any filter except page changes
    if (Object.keys(newFilters).some(key => key !== 'page')) {
      updatedFilters.page = 1
    }
    
    // Update state
    state.value.filters = updatedFilters
    
    // Update URL
    updateURLFromFilters(updatedFilters)
    
    // Apply filters immediately
    filterAndSortProducts()
  }
  
  const clearAllFilters = () => {
    state.value.filters = {
      category: '',
      sortBy: 'popularity',
      page: 1,
      limit: 12,
      color: '',
      size: '',
      brand: '',
      minPrice: 0,
      maxPrice: defaultMaxPrice.value
    }
    
    // Update URL
    updateURLFromFilters(state.value.filters)
    
    // Apply filters immediately
    filterAndSortProducts()
  }
  
  const clearFilter = (filterName) => {
    const newFilters = { ...state.value.filters }
    
    if (filterName === 'category') {
      newFilters.category = ''
    } else if (filterName === 'color') {
      newFilters.color = ''
    } else if (filterName === 'size') {
      newFilters.size = ''
    } else if (filterName === 'brand') {
      newFilters.brand = ''
    } else if (filterName === 'price') {
      newFilters.minPrice = 0
      newFilters.maxPrice = defaultMaxPrice.value
    } else if (filterName === 'sort') {
      newFilters.sortBy = 'popularity'
    }
    
    newFilters.page = 1
    state.value.filters = newFilters
    
    // Update URL
    updateURLFromFilters(newFilters)
    
    // Apply filters immediately
    filterAndSortProducts()
  }
  
  const getCategoryCount = (categoryName) => {
    if (!categoryName) {
      return state.value.allProducts.length || 0
    }
    
    return state.value.categoryCounts[categoryName] || 0
  }
  
  const getBrandCount = (brandName) => {
    if (!brandName) {
      return state.value.allProducts.length || 0
    }
    
    return state.value.brandCounts[brandName] || 0
  }
  
  // ==================== URL SYNC ====================
  
  const syncFiltersFromURL = async () => {
    if (state.value.isUpdatingFromURL || state.value.urlUpdateInProgress) {
      return
    }
    
    state.value.isUpdatingFromURL = true
    
    try {
      // Get filters from URL
      const urlFilters = parseFiltersFromURL()
      
      // Update filters in state
      state.value.filters = urlFilters
      
      // Apply filters
      filterAndSortProducts()
      
    } catch (error) {
      console.error('Error syncing from URL:', error)
    } finally {
      setTimeout(() => {
        state.value.isUpdatingFromURL = false
      }, 50)
    }
  }
  
  // ==================== INITIALIZATION ====================
  
  const initialize = async () => {
    if (state.value.hasInitialized) {
      return true
    }
    
    try {
      state.value.isLoading = true
      
      // Load filter options
      await fetchFilterOptions()
      
      // Load all products
      await fetchAllProducts()
      
      // Sync with URL
      await syncFiltersFromURL()
      
      state.value.hasInitialized = true
      state.value.isLoading = false
      
      return true
      
    } catch (error) {
      console.error('Failed to initialize store:', error)
      state.value.isLoading = false
      state.value.hasInitialized = true
      return false
    }
  }
  
  // ==================== WATCHERS ====================
  
  watch(() => route.query, (newQuery, oldQuery) => {
    if (JSON.stringify(newQuery) === JSON.stringify(oldQuery)) {
      return
    }
    
    if (!state.value.isUpdatingFromURL && !state.value.urlUpdateInProgress) {
      syncFiltersFromURL()
    }
  }, { deep: true })
  
  // ==================== EXPORTS ====================
  
  return {
    // Getters
    products,
    categories,
    colors,
    sizes,
    brands,
    pagination,
    filters,
    isLoading,
    hasInitialized,
    availableColors,
    availableSizes,
    availableBrands,
    hasActiveFilters,
    defaultMaxPrice,
    
    // Actions
    fetchProducts,
    updateFilters,
    clearAllFilters,
    clearFilter,
    initialize,
    syncFiltersFromURL,
    getCategoryCount,
    getBrandCount,
    
    // Helper functions
    getProductColor,
    getProductSize,
    getProductBrand,
    getDiscountedPrice,
    getProductRating,
    getColorHex,
    getProductImage
  }
})