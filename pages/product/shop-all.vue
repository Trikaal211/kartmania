<template>
  <section class="shop py-80">
    <!-- Loading Overlay -->
    <div v-if="showInitialLoading" class="loading-overlay">
      <div class="spinner-border text-main-600" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-20 text-gray-600">Loading products...</p>
    </div>
    
    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="showMobileSidebar" 
      class="sidebar-overlay d-lg-none"
      @click="closeMobileSidebar"
    ></div>
    
    <div v-if="!showInitialLoading" class="container container-lg">
      <div class="row">
        <!-- Sidebar Start -->
        <div 
          class="col-lg-3 sidebar-mobile-wrapper"
          :class="{ 'mobile-open': showMobileSidebar }"
        >
          <div class="shop-sidebar">
            <!-- Close button for mobile -->
            <button
              type="button"
              class="shop-sidebar__close d-lg-none d-flex w-40 h-40 flex-center border border-gray-100 rounded-circle bg-white hover-bg-main-600 position-absolute inset-inline-end-0 me-16 mt-16 hover-text-white hover-border-main-600 z-index-1"
              @click="closeMobileSidebar"
            >
              <i class="ph ph-x"></i>
            </button>
              
            <!-- Product Category -->
            <div class="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
              <div class="flex-between align-items-center mb-24">
                <h6 class="text-xl m-0">Product Category</h6>
                <button v-if="filters.category" 
                        @click="clearCategoryFilter"
                        class="btn btn-link btn-sm p-0 text-danger-600 text-decoration-none">
                  Clear
                </button>
              </div>
              <ul class="max-h-540 overflow-y-auto scroll-sm">
                <li class="mb-16">
                  <div class="form-check">
                    <input 
                      class="form-check-input cursor-pointer" 
                      type="radio" 
                      name="categoryFilter"
                      id="category-all"
                      :checked="!filters.category"
                      @change="clearCategoryFilter"
                    >
                    <label class="form-check-label cursor-pointer d-flex justify-content-between w-100" 
                           for="category-all">
                      <span>All Categories</span>
                      <span class="text-gray-500 text-sm">({{ totalProductsCount }})</span>
                    </label>
                  </div>
                </li>
                <li v-for="category in categories" :key="category.id" class="mb-16">
                  <div class="form-check">
                    <input 
                      class="form-check-input cursor-pointer" 
                      type="radio" 
                      name="categoryFilter"
                      :id="`category-${category.id}`"
                      :checked="filters.category === category.name"
                      @change="filterByCategory(category.name)"
                    >
                    <label class="form-check-label cursor-pointer d-flex justify-content-between w-100" 
                           :for="`category-${category.id}`">
                      <span>{{ category.name }}</span>
                      <span class="text-gray-500 text-sm">({{ getCategoryCount(category.name) }})</span>
                    </label>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Filter by Brand -->
            <div v-if="availableBrands.length > 0" class="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
              <div class="flex-between align-items-center mb-24">
                <h6 class="text-xl m-0">Filter by Brand</h6>
                <button v-if="filters.brand" 
                        @click="clearBrandFilter"
                        class="btn btn-link btn-sm p-0 text-danger-600 text-decoration-none">
                  Clear
                </button>
              </div>
              <ul class="max-h-540 overflow-y-auto scroll-sm">
                <li class="mb-16">
                  <div class="form-check">
                    <input 
                      class="form-check-input cursor-pointer" 
                      type="radio" 
                      name="brandFilter"
                      id="brand-all"
                      :checked="!filters.brand"
                      @change="clearBrandFilter"
                    >
                    <label class="form-check-label cursor-pointer d-flex align-items-center justify-content-between w-100" 
                           for="brand-all">
                      <div class="d-flex align-items-center gap-8">
                        <span>All Brands</span>
                      </div>
                    </label>
                  </div>
                </li>
                <li v-for="brand in availableBrands" :key="brand.id" class="mb-16">
                  <div class="form-check">
                    <input 
                      class="form-check-input cursor-pointer" 
                      type="radio" 
                      name="brandFilter"
                      :id="`brand-${brand.id}`"
                      :checked="filters.brand === brand.name"
                      @change="selectBrandFilter(brand.name)"
                    >
                    <label class="form-check-label cursor-pointer d-flex align-items-center justify-content-between w-100" 
                           :for="`brand-${brand.id}`">
                      <div class="d-flex align-items-center gap-8">
                        <!-- Brand Logo -->
                        <img v-if="brand.logo" 
                             :src="brand.logo" 
                             :alt="brand.name"
                             class="brand-logo rounded"
                             style="width: 24px; height: 24px; object-fit: contain;"
                             @error="handleImageError">
                        <span>{{ brand.name }}</span>
                      </div>
                      <span class="text-gray-500 text-sm">
                        ({{ brand.count }})
                      </span>
                    </label>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Filter by Price -->
            <div class="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
              <div class="flex-between align-items-center mb-24">
                <h6 class="text-xl m-0">Filter by Price</h6>
                <button v-if="isPriceFilterApplied" 
                        @click="resetPriceFilter"
                        class="btn btn-link btn-sm p-0 text-danger-600 text-decoration-none">
                  Clear
                </button>
              </div>
              
              <!-- Price display -->
              <div class="mb-24">
                <p class="text-sm text-gray-600 mb-12">Price Range: ₹{{ formatPrice(filters.minPrice) }} - ₹{{ formatPrice(filters.maxPrice) }}</p>
                
                <!-- Min Price -->
                <div class="mb-16">
                  <label class="form-label text-sm text-gray-600 mb-8">Min Price: ₹{{ formatPrice(filters.minPrice) }}</label>
                  <input 
                    type="range"
                    :min="0"
                    :max="defaultMaxPrice"
                    v-model.number="priceRange.min"
                    class="form-range"
                    @change="applyPriceFilter"
                    :step="100"
                  >
                </div>
                
                <!-- Max Price -->
                <div class="mb-24">
                  <label class="form-label text-sm text-gray-600 mb-8">Max Price: ₹{{ formatPrice(filters.maxPrice) }}</label>
                  <input 
                    type="range"
                    :min="0"
                    :max="defaultMaxPrice"
                    v-model.number="priceRange.max"
                    class="form-range"
                    @change="applyPriceFilter"
                    :step="100"
                  >
                </div>
              </div>
            </div>

            <!-- Filter by Color -->
            <div v-if="availableColors.length > 0" class="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
              <div class="flex-between align-items-center mb-24">
                <h6 class="text-xl m-0">Filter by Color</h6>
                <button v-if="filters.color" 
                        @click="clearColorFilter"
                        class="btn btn-link btn-sm p-0 text-danger-600 text-decoration-none">
                  Clear
                </button>
              </div>
              <ul class="max-h-540 overflow-y-auto scroll-sm">
                <li class="mb-16">
                  <div class="form-check">
                    <input 
                      class="form-check-input cursor-pointer" 
                      type="radio" 
                      name="colorFilter"
                      id="color-all"
                      :checked="!filters.color"
                      @change="clearColorFilter"
                    >
                    <label class="form-check-label cursor-pointer d-flex align-items-center justify-content-between w-100" 
                           for="color-all">
                      <div class="d-flex align-items-center gap-8">
                        <span class="color-indicator rounded-circle d-inline-block border border-gray-300"
                              style="background-color: #e9ecef;"></span>
                        <span>All Colors</span>
                      </div>
                      <span class="text-gray-500 text-sm">
                        ({{ totalProductsCount }})
                      </span>
                    </label>
                  </div>
                </li>
                <li v-for="color in availableColors" :key="color.name" class="mb-16">
                  <div class="form-check">
                    <input 
                      class="form-check-input cursor-pointer" 
                      type="radio" 
                      name="colorFilter"
                      :id="`color-${color.name}`"
                      :checked="filters.color === color.name"
                      @change="selectColorFilter(color.name)"
                    >
                    <label class="form-check-label cursor-pointer d-flex align-items-center justify-content-between w-100" 
                           :for="`color-${color.name}`">
                      <div class="d-flex align-items-center gap-8">
                        <span 
                          class="color-indicator rounded-circle d-inline-block border border-gray-300"
                          :style="{ backgroundColor: color.hex }"
                          :title="color.name"
                        ></span>
                        <span>{{ color.name }}</span>
                      </div>
                      <span class="text-gray-500 text-sm">
                        ({{ color.count }})
                      </span>
                    </label>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Filter by Size -->
            <div v-if="availableSizes.length > 0" class="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
              <div class="flex-between align-items-center mb-24">
                <h6 class="text-xl m-0">Filter by Size</h6>
                <button v-if="filters.size" 
                        @click="clearSizeFilter"
                        class="btn btn-link btn-sm p-0 text-danger-600 text-decoration-none">
                  Clear
                </button>
              </div>
              <div class="size-filters d-flex flex-wrap gap-8">
                <button 
                  class="btn size-btn"
                  :class="{ 
                    'btn-main': !filters.size, 
                    'btn-outline-gray': filters.size 
                  }"
                  @click="clearSizeFilter"
                >
                  All Sizes
                </button>
                <button 
                  v-for="size in availableSizes" 
                  :key="size.id"
                  class="btn size-btn"
                  :class="{ 
                    'btn-main': filters.size === size.name, 
                    'btn-outline-gray': filters.size !== size.name 
                  }"
                  @click="selectSizeFilter(size.name)"
                >
                  {{ size.name }}
                </button>
              </div>
            </div>

            <!-- Sort By -->
            <div class="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
              <div class="flex-between align-items-center mb-24">
                <h6 class="text-xl m-0">Sort By</h6>
                <button v-if="filters.sortBy !== 'popularity'" 
                        @click="clearSortFilter"
                        class="btn btn-link btn-sm p-0 text-danger-600 text-decoration-none">
                  Reset
                </button>
              </div>
              <ul class="max-h-540 overflow-y-auto scroll-sm">
                <li v-for="option in sortOptions" :key="option.value" class="mb-16">
                  <div class="form-check">
                    <input 
                      class="form-check-input cursor-pointer" 
                      type="radio" 
                      name="sortFilter"
                      :id="`sort-${option.value}`"
                      :checked="filters.sortBy === option.value"
                      @change="selectSortFilter(option.value)"
                    >
                    <label class="form-check-label cursor-pointer d-flex justify-content-between w-100" 
                           :for="`sort-${option.value}`">
                      <span>{{ option.label }}</span>
                    </label>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Clear All Filters -->
            <div class="shop-sidebar__box clear-filter-box border border-gray-100 rounded-8 mb-32">
              <button 
                class="clear-btn w-100"
                @click="clearAllFilters"
                :disabled="!hasActiveFilters"
              >
                <i class="ph ph-x"></i>
                Clear All Filters
              </button>
            </div>

            <!-- Advertise -->
            <div class="shop-sidebar__box rounded-8 overflow-hidden">
              <img src="/assets/images/thumbs/advertise-img1.png" alt="Advertisement" class="w-100" @error="handleImageError">
            </div>
          </div>
        </div>
        <!-- Sidebar End -->

        <!-- Content Start -->
        <div class="col-lg-9">
          <!-- Top Bar -->
          <div class="product-topbar">
            <!-- Left Info Section -->
            <div class="topbar-info">
              <span class="count-text">
                Showing {{ pagination.from || 0 }}-{{ pagination.to || 0 }} of {{ pagination.total || 0 }} products
              </span>
              <span v-if="filters.category" class="active-category">
                in {{ filters.category }}
              </span>
              <span v-if="filters.brand" class="active-brand ms-2">
                from {{ filters.brand }}
              </span>
              <span v-if="filters.color" class="active-color ms-2">
                in {{ filters.color }}
              </span>
            </div>

            <!-- Right Controls -->
            <div class="topbar-actions">
              <!-- View Toggle -->
              <div class="view-toggle">
                <button 
                  class="toggle-btn"
                  :class="{ active: viewMode === 'grid' }"
                  @click="viewMode = 'grid'"
                  title="Grid View"
                >
                  <i class="ph ph-squares-four"></i>
                </button>
                <button 
                  class="toggle-btn"
                  :class="{ active: viewMode === 'list' }"
                  @click="viewMode = 'list'"
                  title="List View"
                >
                  <i class="ph-bold ph-list-dashes"></i>
                </button>
              </div>

              <!-- Sort Dropdown -->
              <div class="custom-dropdown d-none d-lg-block">
                <button class="custom-btn" @click="toggleSortDropdown">
                  <i class="ph ph-arrow-up-down me-2"></i>
                  <span>Sort by: {{ getSortLabel(filters.sortBy) }}</span>
                  <i class="arrow ms-2" :class="{ open: isSortDropdownOpen }">▼</i>
                </button>

                <ul v-if="isSortDropdownOpen" class="custom-menu">
                  <li v-for="option in sortOptions" :key="option.value">
                    <button
                      class="custom-item"
                      :class="{ active: filters.sortBy === option.value }"
                      @click="selectSortOption(option.value)"
                    >
                      {{ option.label }}
                    </button>
                  </li>
                </ul>
              </div>

              <!-- Mobile Sidebar Filter -->
              <button 
                class="toggle-btn mobile-filter d-lg-none"
                @click="toggleMobileSidebar"
                title="Open Filters"
              >
                <i class="ph-bold ph-funnel-simple"></i>
                <span v-if="hasActiveFilters" class="filter-badge"></span>
              </button>
            </div>
          </div>

          <!-- Active Filters Bar -->
          <!-- Active Filters Bar - FIXED VERSION -->
<div v-if="hasActiveFilters" class="mb-32">
  <div class="d-flex align-items-center gap-12 mb-16">
    <i class="ph ph-funnel text-main-600"></i>
    <span class="text-sm fw-medium">Active Filters:</span>
    
    <button @click="copyURLToClipboard" class="btn btn-sm btn-outline-main ms-auto">
      <i class="ph ph-copy me-2"></i>Copy Link
    </button>
  </div>
  
  <div class="d-flex flex-wrap gap-8 align-items-center">
    <!-- Category Filter -->
    <div v-if="filters.category" class="active-filter-item d-flex align-items-center gap-8">
      <span>{{ filters.category }}</span>
      <button @click="clearCategoryFilter" class="btn-close-filter">
        <i class="ph ph-x"></i>
      </button>
    </div>
    
    <!-- Brand Filter -->
    <div v-if="filters.brand" class="active-filter-item d-flex align-items-center gap-8">
      <div class="d-flex align-items-center gap-8">
        <img v-if="getBrandLogo(filters.brand)" 
              :src="getBrandLogo(filters.brand)" 
              :alt="filters.brand"
              class="brand-logo-sm rounded"
              style="width: 16px; height: 16px; object-fit: contain;"
              @error="handleImageError">
        <span>{{ filters.brand }}</span>
      </div>
      <button @click="clearBrandFilter" class="btn-close-filter">
        <i class="ph ph-x"></i>
      </button>
    </div>
    
    <!-- Color Filter -->
    <div v-if="filters.color" class="active-filter-item d-flex align-items-center gap-8">
      <div class="d-flex align-items-center gap-8">
        <span class="color-dot" :style="{ backgroundColor: getColorHex(filters.color) }"></span>
        <span>{{ filters.color }}</span>
      </div>
      <button @click="clearColorFilter" class="btn-close-filter">
        <i class="ph ph-x"></i>
      </button>
    </div>
    
    <!-- Size Filter -->
    <div v-if="filters.size" class="active-filter-item d-flex align-items-center gap-8">
      <span>Size: {{ filters.size }}</span>
      <button @click="clearSizeFilter" class="btn-close-filter">
        <i class="ph ph-x"></i>
      </button>
    </div>
    
    <!-- Price Filter -->
    <div v-if="isPriceFilterApplied" class="active-filter-item d-flex align-items-center gap-8">
      <span>Price: ₹{{ formatPrice(filters.minPrice) }} - ₹{{ formatPrice(filters.maxPrice) }}</span>
      <button @click="resetPriceFilter" class="btn-close-filter">
        <i class="ph ph-x"></i>
      </button>
    </div>
    
    <!-- Sort Filter -->
    <div v-if="filters.sortBy !== 'popularity'" class="active-filter-item d-flex align-items-center gap-8">
      <span>Sort: {{ getSortLabel(filters.sortBy) }}</span>
      <button @click="clearSortFilter" class="btn-close-filter">
        <i class="ph ph-x"></i>
      </button>
    </div>
    
    <!-- Clear All Button - ALWAYS VISIBLE NOW -->
    <button @click="clearAllFilters" 
            class="btn btn-sm btn-outline-danger d-flex align-items-center gap-8 ms-auto">
      <i class="ph ph-x"></i>
      Clear All
    </button>
  </div>
</div>

          <!-- Products Loading State -->
          <div v-if="isLoading" class="text-center py-80">
            <div class="spinner-border text-main-600" role="status" style="width: 3rem; height: 3rem;">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-20 text-gray-600">Loading products...</p>
          </div>

          <!-- Products -->
          <div v-else>
            <!-- Products Grid/List -->
            <div v-if="products.length > 0">
              <!-- Grid View -->
              <div v-if="viewMode === 'grid'" class="row g-24">
                <div v-for="product in products" :key="product.id" class="col-xl-3 col-lg-4 col-md-6">
                  <div class="product-card h-100 border border-gray-200 hover-border-main-600 rounded-12 position-relative transition-2 overflow-hidden">
                    <!-- Product Image -->
                    <div class="product-image position-relative overflow-hidden bg-light" style="height: 280px;">
                      <NuxtLink
                        :to="`/product/${toKebabCase(product.name)}`"
                        class="d-block h-100 w-100"
                      >
                        <div v-if="!hasImage(product)" class="no-image-placeholder h-100 w-100 d-flex flex-column align-items-center justify-content-center bg-gray-100">
                          <i class="ph ph-image text-gray-400 mb-8" style="font-size: 48px;"></i>
                          <span class="text-gray-500 text-sm">No image available</span>
                        </div>
                        <img 
                          v-else
                          :src="getPrimaryImage(product)" 
                          :alt="product.name"
                          class="w-100 h-100 object-fit-cover transition-2"
                          @error="handleProductImageError"
                          loading="lazy"
                        >
                      </NuxtLink>
                      
                      <!-- Badges -->     
                      <div class="product-badges position-absolute top-0 start-0 p-16">
                        <span v-if="product.discountValue > 0" 
                              class="badge bg-danger-600 text-white py-8 px-12 rounded-6">
                          -{{ product.discountValue }}%
                        </span>
                        <span v-if="isProductNew(product)" 
                              class="badge bg-success-600 text-white py-8 px-12 rounded-6 ms-8">
                          New
                        </span>
                        <!-- Brand Badge -->
                        <span v-if="product.brand?.name" 
                              class="badge bg-info-600 text-white py-8 px-12 rounded-6 ms-8">
                          {{ product.brand.name }}
                        </span>
                      </div>
                      
                      <!-- Quick Actions -->
                      <div class="product-actions position-absolute top-0 end-0 p-16 d-flex flex-column gap-8">
                        <button @click="addToWishlist(product)" 
                                class="btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm hover-bg-danger-600 hover-text-white transition-2"
                                style="width: 36px; height: 36px;"
                                title="Add to Wishlist">
                          <i class="ph ph-heart" :class="{ 'text-danger-600': isInWishlist(product) }"></i>
                        </button>
                        <button @click="quickView(product)" 
                                class="btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm hover-bg-main-600 hover-text-white transition-2"
                                style="width: 36px; height: 36px;"
                                title="Quick View">
                          <i class="ph ph-eye"></i>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Product Info -->
                    <div class="p-16 d-flex flex-column" style="height: calc(100% - 280px);">
                      <!-- Category & Brand -->
                      <div class="mb-8 d-flex justify-content-between align-items-center">
                        <span class="text-xs text-gray-500 text-uppercase text-truncate pe-8">
                          {{ product.category?.name || 'General' }}
                        </span>
                        <span v-if="product.brand?.name" class="text-xs text-gray-500 text-truncate">
                          {{ product.brand.name }}
                        </span>
                      </div>
                      
                      <!-- Title -->
                      <div class="mb-12 flex-grow-1">
                        <NuxtLink :to="`/product/${product.id}`" 
                                  class="text-gray-900 text-decoration-none hover-text-main-600">
                          <h3 class="product-title fw-medium mb-0" style="font-size: 15px; line-height: 1.4; min-height: 42px;">
                            {{ truncateText(product.name, 50) }}
                          </h3>
                        </NuxtLink>
                        
                        <!-- Color Info -->
                        <div v-if="getProductColor(product)" class="mt-8">
                          <div class="d-flex align-items-center gap-6">
                            <span 
                              class="color-dot-sm rounded-circle d-inline-block border border-gray-300"
                              :style="{ backgroundColor: getColorHex(getProductColor(product)) }"
                            ></span>
                            <span class="text-xs text-gray-600">{{ getProductColor(product) }}</span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Rating -->
                      <div class="d-flex align-items-center gap-6 mb-12">
                        <div class="rating-stars d-flex">
                          <i v-for="star in 5" :key="star" 
                             class="ph text-xs"
                             :class="{
                               'ph-fill ph-star text-warning-600': star <= Math.round(getProductRating(product)),
                               'ph-star text-gray-300': star > Math.round(getProductRating(product))
                             }"></i>
                        </div>
                        <span class="text-xs text-gray-500">({{ getReviewCount(product) }})</span>
                      </div>
                      
                      <!-- Price -->
                      <div class="product-price mb-16">
                        <div class="d-flex align-items-center flex-wrap gap-6">
                          <span class="text-lg fw-bold text-gray-900">₹{{ formatPrice(getDiscountedPrice(product)) }}</span>
                          <span v-if="product.discountValue > 0" 
                                class="text-sm text-gray-500 text-decoration-line-through">
                            ₹{{ formatPrice(product.price) }}
                          </span>
                          <span v-if="product.discountValue > 0" 
                                class="badge bg-success-100 text-success-800 border border-success-200 py-2 px-4 rounded-3 text-xs">
                            Save {{ product.discountValue }}%
                          </span>
                        </div>
                      </div>
                      
                      <!-- Add to Cart Button -->
                      <button @click="addToCart(product)" 
                              :disabled="product.stock === 0"
                              class="btn btn-main w-100 py-10 d-flex align-items-center justify-content-center gap-6 hover-scale transition-2 mt-auto">
                        <i class="ph ph-shopping-cart"></i>
                        <span class="text-sm">Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- List View -->
              <div v-else class="list-view">
                <div v-for="product in products" :key="product.id" 
                     class="product-list-item border border-gray-200 rounded-12 mb-16 overflow-hidden hover-shadow transition-2">
                  <div class="row g-0">
                    <div class="col-md-4">
                      <div class="product-image position-relative overflow-hidden bg-gray-100 h-100" style="min-height: 200px;">
                        <NuxtLink :to="`/product/${product.id}`" class="d-block h-100 w-100">
                          <div v-if="!hasImage(product)" class="no-image-placeholder h-100 w-100 d-flex flex-column align-items-center justify-content-center bg-light">
                            <i class="ph ph-image text-gray-400 mb-8" style="font-size: 48px;"></i>
                            <span class="text-gray-500 text-sm">No image available</span>
                          </div>
                          <img 
                            v-else
                            :src="getPrimaryImage(product)" 
                            :alt="product.name"
                            class="w-100 h-100 object-fit-cover transition-2"
                            @error="handleProductImageError"
                            loading="lazy"
                          >
                        </NuxtLink>
                      </div>
                    </div>
                    <div class="col-md-8">
                      <div class="p-24 h-100 d-flex flex-column">
                        <h3 class="mb-12" style="font-size: 18px; line-height: 1.3;">
                          <NuxtLink :to="`/product/${product.id}`" 
                                    class="text-gray-900 fw-semibold text-decoration-none hover-text-main-600">
                            {{ truncateText(product.name, 70) }}
                          </NuxtLink>
                        </h3>
                        
                        <!-- Color and Brand Info -->
                        <div class="d-flex align-items-center gap-16 mb-12">
                          <div v-if="getProductColor(product)" class="d-flex align-items-center gap-8">
                            <span 
                              class="color-dot-sm rounded-circle d-inline-block border border-gray-300"
                              :style="{ backgroundColor: getColorHex(getProductColor(product)) }"
                            ></span>
                            <span class="text-sm text-gray-600">{{ getProductColor(product) }}</span>
                          </div>
                          <span v-if="product.brand?.name" class="text-sm text-gray-600">
                            Brand: {{ product.brand.name }}
                          </span>
                        </div>
                        
                        <div class="product-price mb-16">
                          <span class="text-2xl fw-bold text-gray-900">₹{{ formatPrice(getDiscountedPrice(product)) }}</span>
                          <span v-if="product.discountValue > 0" 
                                class="text-sm text-gray-500 text-decoration-line-through ms-12">
                            ₹{{ formatPrice(product.price) }}
                          </span>
                        </div>
                        
                        <button @click="addToCart(product)" 
                                class="btn btn-main d-flex align-items-center gap-8 px-24 transition-2"
                                style="height: 48px;">
                          <i class="ph ph-shopping-cart"></i>
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Pagination -->
              <div v-if="pagination.lastPage > 1" class="mt-48">
                <nav aria-label="Page navigation">
                  <ul class="pagination justify-content-center gap-8">
                    <li class="page-item" :class="{ 'disabled': filters.page === 1 }">
                      <button class="page-link d-flex align-items-center justify-content-center" 
                              @click="goToPage(filters.page - 1)"
                              :disabled="filters.page === 1"
                              style="width: 48px; height: 48px;">
                        <i class="ph-bold ph-arrow-left"></i>
                      </button>
                    </li>
                    
                    <li v-for="page in getVisiblePages()" :key="page" 
                        class="page-item" 
                        :class="{ 
                          'active': page === filters.page, 
                          'disabled': page === '...' 
                        }">
                      <button v-if="page === '...'"
                              class="page-link d-flex align-items-center justify-content-center"
                              disabled
                              style="width: 48px; height: 48px;">
                        ...
                      </button>
                      <button v-else
                              class="page-link d-flex align-items-center justify-content-center"
                              @click="goToPage(page)"
                              style="width: 48px; height: 48px;">
                        {{ page }}
                      </button>
                    </li>
                    
                    <li class="page-item" :class="{ 'disabled': filters.page === pagination.lastPage }">
                      <button class="page-link d-flex align-items-center justify-content-center" 
                              @click="goToPage(filters.page + 1)"
                              :disabled="filters.page === pagination.lastPage"
                              style="width: 48px; height: 48px;">
                        <i class="ph-bold ph-arrow-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            
            <!-- No Products Found -->
            <div v-else class="text-center py-80">
              <div class="mb-24">
                <i class="ph ph-magnifying-glass text-6xl text-gray-300"></i>
              </div>
              <h4 class="text-gray-700 mb-16">No products found</h4>
              <p class="text-gray-500 mb-32">Try adjusting your filters or search criteria</p>
              <button @click="clearAllFilters" class="btn btn-main">
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { toKebabCase } from "../../utlis/toKebabCase"
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useProductStore } from '../../store/useProductStore'

// Initialize store
const productStore = useProductStore()

// Local state
const viewMode = ref('grid')
const showMobileSidebar = ref(false)
const isSortDropdownOpen = ref(false)
const wishlist = ref([])
const showInitialLoading = ref(true)
const priceRange = ref({
  min: 0,
  max: 50000
})

// Sort options
const sortOptions = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'brand', label: 'Brand Name (A-Z)' }
]

// ==================== COMPUTED PROPERTIES ====================

const isLoading = computed(() => productStore.isLoading)
const products = computed(() => productStore.products)
const categories = computed(() => productStore.categories)
const colorsList = computed(() => productStore.colors)
const sizesList = computed(() => productStore.sizes)
const brandsList = computed(() => productStore.brands)
const pagination = computed(() => productStore.pagination)
const filters = computed(() => productStore.filters)
const availableColors = computed(() => productStore.availableColors)
const availableSizes = computed(() => productStore.availableSizes)
const availableBrands = computed(() => productStore.availableBrands)
const hasActiveFilters = computed(() => productStore.hasActiveFilters)
const defaultMaxPrice = computed(() => productStore.defaultMaxPrice || 50000)

const isPriceFilterApplied = computed(() => {
  const f = filters.value
  return f.minPrice > 0 || f.maxPrice < defaultMaxPrice.value
})

const totalProductsCount = computed(() => {
  return productStore.getCategoryCount('') || 0
})

// ==================== HELPER FUNCTIONS ====================

// Check if product has image
const hasImage = (product) => {
  if (!product.images || !product.images.length) return false
  const primaryImage = product.images.find(img => img.isPrimary)
  const firstImage = product.images[0]?.imageUrl
  return !!(primaryImage?.imageUrl || firstImage)
}

// Text truncation function
const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Format price with commas
const formatPrice = (price) => {
  if (!price && price !== 0) return '0'
  return Number(price).toLocaleString('en-IN')
}

// Handle product image error
const handleProductImageError = (event) => {
  event.target.src = '/assets/images/placeholder.jpg'
}

const getProductColor = (product) => {
  return productStore.getProductColor(product)
}

const getProductSize = (product) => {
  return productStore.getProductSize(product)
}

const getProductRating = (product) => {
  return productStore.getProductRating(product) || 0
}

const getReviewCount = (product) => {
  return product.reviews?.length || 0
}

// UPDATED: Use store's getProductImage function
const getPrimaryImage = (product) => {
  return productStore.getProductImage(product)
}

const getDiscountedPrice = (product) => {
  return productStore.getDiscountedPrice(product)
}

const isProductNew = (product) => {
  if (!product.createdAt) return false
  const createdDate = new Date(product.createdAt)
  const now = new Date()
  const diffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24))
  return diffDays <= 30
}

const getColorHex = (colorName) => {
  if (!colorName) return '#007bff'
  return productStore.getColorHex(colorName)
}

const getBrandLogo = (brandName) => {
  if (!brandName) return null
  const brand = brandsList.value.find(b => b.name === brandName)
  return brand?.logo || null
}

const getSortLabel = (sortType) => {
  const option = sortOptions.find(opt => opt.value === sortType)
  return option ? option.label : 'Most Popular'
}

const getCategoryCount = (categoryName) => {
  return productStore.getCategoryCount(categoryName) || 0
}

// ==================== IMAGE ERROR HANDLING ====================

const handleImageError = (event) => {
  event.target.src = '/assets/images/placeholder.jpg'
}

// ==================== FILTER FUNCTIONS ====================

const filterByCategory = (categoryName) => {
  productStore.updateFilters({ category: categoryName })
}

const clearCategoryFilter = () => {
  productStore.clearFilter('category')
}

const selectBrandFilter = (brandName) => {
  if (filters.value.brand === brandName) {
    productStore.clearFilter('brand')
  } else {
    productStore.updateFilters({ brand: brandName })
  }
}

const clearBrandFilter = () => {
  productStore.clearFilter('brand')
}

const selectColorFilter = (color) => {
  if (filters.value.color === color) {
    productStore.clearFilter('color')
  } else {
    productStore.updateFilters({ color: color })
  }
}

const clearColorFilter = () => {
  productStore.clearFilter('color')
}

const selectSizeFilter = (size) => {
  if (filters.value.size === size) {
    productStore.clearFilter('size')
  } else {
    productStore.updateFilters({ size: size })
  }
}

const clearSizeFilter = () => {
  productStore.clearFilter('size')
}

const applyPriceFilter = () => {
  const newFilters = {
    minPrice: Math.min(priceRange.value.min, priceRange.value.max),
    maxPrice: Math.max(priceRange.value.min, priceRange.value.max)
  }
  
  if (newFilters.minPrice > newFilters.maxPrice) {
    const temp = newFilters.minPrice
    newFilters.minPrice = newFilters.maxPrice
    newFilters.maxPrice = temp
  }
  
  productStore.updateFilters(newFilters)
}

const resetPriceFilter = () => {
  priceRange.value = { min: 0, max: defaultMaxPrice.value }
  productStore.clearFilter('price')
}

const selectSortFilter = (sortType) => {
  productStore.updateFilters({ sortBy: sortType })
}

const clearSortFilter = () => {
  productStore.clearFilter('sort')
}

const clearAllFilters = () => {
  priceRange.value = { min: 0, max: defaultMaxPrice.value }
  productStore.clearAllFilters()
}

// ==================== PAGINATION ====================

const goToPage = (page) => {
  if (page >= 1 && page <= pagination.value.lastPage) {
    productStore.updateFilters({ page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const getVisiblePages = () => {
  const pages = []
  const total = pagination.value.lastPage
  const currentPage = filters.value.page
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (currentPage >= total - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 3; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      pages.push(currentPage - 1)
      pages.push(currentPage)
      pages.push(currentPage + 1)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
}

// ==================== UI FUNCTIONS ====================

const toggleSortDropdown = () => {
  isSortDropdownOpen.value = !isSortDropdownOpen.value
}

const selectSortOption = (value) => {
  productStore.updateFilters({ sortBy: value })
  isSortDropdownOpen.value = false
}

const toggleMobileSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value
  if (showMobileSidebar.value) {
    document.body.classList.add('no-scroll')
  } else {
    document.body.classList.remove('no-scroll')
  }
}

const closeMobileSidebar = () => {
  showMobileSidebar.value = false
  document.body.classList.remove('no-scroll')
}

// ==================== WISHLIST & CART ====================

const addToWishlist = (product) => {
  const index = wishlist.value.findIndex(item => item.id === product.id)
  if (index > -1) {
    wishlist.value.splice(index, 1)
    showToast('Removed from wishlist')
  } else {
    wishlist.value.push(product)
    showToast('Added to wishlist')
  }
}

const isInWishlist = (product) => {
  return wishlist.value.some(item => item.id === product.id)
}

const addToCart = (product) => {
  if (product.stock === 0) {
    showToast('Product is out of stock', 'warning')
    return
  }
  
  showToast('Added to cart')
}

const quickView = (product) => {
  console.log('Quick view:', product.name)
}

const showToast = (message, type = 'success') => {
  console.log(`${type}: ${message}`)
}

// ==================== URL SHARING ====================

const generateFilterURL = () => {
  const params = new URLSearchParams()
  
  if (filters.value.category) {
    params.append('category', filters.value.category)
  }
  if (filters.value.color) {
    params.append('color', filters.value.color)
  }
  if (filters.value.size) {
    params.append('size', filters.value.size)
  }
  if (filters.value.brand) {
    params.append('brand', filters.value.brand)
  }
  if (filters.value.sortBy !== 'popularity') {
    params.append('sort', filters.value.sortBy)
  }
  if (filters.value.minPrice > 0) {
    params.append('min_price', filters.value.minPrice)
  }
  if (filters.value.maxPrice < defaultMaxPrice.value) {
    params.append('max_price', filters.value.maxPrice)
  }
  if (filters.value.page > 1) {
    params.append('page', filters.value.page)
  }
  
  const queryString = params.toString()
  const baseURL = window.location.origin + window.location.pathname
  
  return queryString ? `${baseURL}?${queryString}` : baseURL
}

const copyURLToClipboard = async () => {
  try {
    const url = generateFilterURL()
    await navigator.clipboard.writeText(url)
    
    showToast('Filter link copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy URL:', err)
    showToast('Failed to copy URL', 'error')
  }
}

// ==================== WATCHERS ====================

// Watch for filter changes to update price range
watch(() => filters.value.minPrice, (value) => {
  priceRange.value.min = value
})

watch(() => filters.value.maxPrice, (value) => {
  priceRange.value.max = value
})

// Watch for filters to apply them
watch(() => filters.value, (newFilters) => {
  // Update price range when filters change
  priceRange.value.min = newFilters.minPrice
  priceRange.value.max = newFilters.maxPrice
  
  // Force fetch products when filters change
  productStore.fetchProducts()
}, { deep: true })

// ==================== INITIALIZATION ====================

onMounted(async () => {
  try {
    // Initialize store
    await productStore.initialize()
    
    // Set initial price range
    priceRange.value.min = filters.value.minPrice
    priceRange.value.max = filters.value.maxPrice
    
    // Fetch products initially
    await productStore.fetchProducts()
    
    // Hide loading overlay after a short delay
    setTimeout(() => {
      showInitialLoading.value = false
    }, 500)
    
  } catch (error) {
    console.error('Initialization error:', error)
    showInitialLoading.value = false
    showToast('Error loading products', 'error')
  }
})

// ==================== CLEANUP ====================

onBeforeUnmount(() => {
  // Cleanup if needed
})
</script>

<style scoped>
/* Loading Overlay */
.active-filter-item {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 14px;
  color: #4f46e5;
  margin: 0 !important;
}

.btn-close-filter {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.btn-close-filter:hover {
  background: #dc3545;
  color: white;
  opacity: 1;
}

/* Clear All Button Fix */
.btn-outline-danger {
  border: 1px solid #dc3545;
  color: #dc3545;
  background: rgb(166, 16, 49);
  opacity: 1 !important;
  visibility: visible !important;
  display: flex !important;
}

.btn-outline-danger:hover {
  background: #dc3545;
  color: white;
}

/* Ensure buttons are always visible */
.d-flex.flex-wrap.gap-8 {
  align-items: center;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Product Image Placeholder */
.no-image-placeholder {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.product-image {
  position: relative;
  min-height: 280px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.product-image img {
  transition: transform 0.5s ease;
  object-fit: cover;
  background: #f8f9fa;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

/* Product Card Structure */
.product-card {
  background: white;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: #4f46e5;
}

/* Product Title Fix */
.product-title {
  font-size: 15px;
  line-height: 1.4;
  font-weight: 500;
  color: #2d3748;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

/* Text Truncation */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Color Indicator */
.color-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #dee2e6;
  transition: transform 0.2s ease;
}

.color-dot-sm {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-block;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #dee2e6;
}

.color-indicator:hover {
  transform: scale(1.1);
}

.form-check-input:checked + .form-check-label .color-indicator {
  box-shadow: 0 0 0 2px #4f46e5;
}

/* Active filter item में color dot */
.active-filter-item .color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-block;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #dee2e6;
}

/* Brand Logo Styles */
.brand-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  background: white;
}

.brand-logo-sm {
  width: 16px;
  height: 16px;
  object-fit: contain;
  border-radius: 3px;
  border: 1px solid #dee2e6;
  background: white;
}

/* Mobile Sidebar Overlay */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.sidebar-overlay {
  opacity: 1;
  visibility: visible;
}

/* Mobile Sidebar Container */
.sidebar-mobile-wrapper {
  position: relative;
}

/* Mobile Sidebar Styles */
@media (max-width: 991.98px) {
  .sidebar-mobile-wrapper {
    position: fixed;
    top: 0;
    left: -100%;
    width: 320px;
    max-width: 85%;
    height: 100vh;
    z-index: 1000;
    transition: left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    background: white;
    overflow-y: auto;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
    padding: 0;
    margin: 0;
  }
  
  .sidebar-mobile-wrapper.mobile-open {
    left: 0;
  }
  
  .shop-sidebar {
    height: 100%;
    padding: 20px;
    padding-top: 80px;
    overflow-y: auto;
    background: white;
  }
  
  .shop-sidebar__close {
    position: absolute !important;
    top: 16px;
    right: 16px;
    z-index: 1001;
    background: white !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  /* Adjust content area */
  .col-lg-9 {
    width: 100%;
  }
  
  .product-title {
    font-size: 14px;
    min-height: 38px;
  }
  
  .product-image {
    min-height: 240px;
  }
}

/* For very small screens */
@media (max-width: 575.98px) {
  .sidebar-mobile-wrapper {
    width: 300px;
    max-width: 90%;
  }
  
  .shop-sidebar {
    padding: 15px;
    padding-top: 70px;
  }
  
  .product-title {
    font-size: 13px;
    min-height: 36px;
  }
  
  .product-image {
    min-height: 200px;
  }
}

/* Prevent body scroll when sidebar is open */
.no-scroll {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
}

/* Custom Dropdown Styles */
.custom-dropdown {
  position: relative;
  display: inline-block;
  width: 220px;
}

.custom-btn {
  width: 100%;
  padding: 10px 15px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #333;
  transition: all 0.2s ease;
}

.custom-btn:hover {
  border-color: #4f46e5;
}

.custom-btn .arrow {
  transition: transform 0.2s ease;
  font-size: 12px;
}

.custom-btn .arrow.open {
  transform: rotate(180deg);
}

.custom-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-top: 4px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 5px 0;
  max-height: 300px;
  overflow-y: auto;
}

.custom-item {
  width: 100%;
  padding: 10px 15px;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.2s ease;
}

.custom-item:hover {
  background-color: #f8f9fa;
}

.custom-item.active {
  background-color: #4f46e5;
  color: white;
  font-weight: 500;
}

/* Size Filter */
.size-btn {
  min-width: 50px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.size-btn.btn-outline-gray {
  background: white;
  color: #333;
  border-color: #dee2e6;
}

.size-btn.btn-outline-gray:hover {
  border-color: #4f46e5;
  color: #4f46e5;
}

.size-btn.btn-main {
  background-color: #4f46e5;
  border-color: #4f46e5;
  color: white;
}

.size-btn:hover {
  opacity: 0.9;
}

/* Sidebar Styles */
.shop-sidebar__box {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.shop-sidebar__box h6 {
  color: #1a1a1a;
  font-weight: 600;
}

/* Form Check Styling */
.form-check-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.form-check-input:checked {
  background-color: #4f46e5;
  border-color: #4f46e5;
}

.form-check-label {
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: color 0.2s ease;
}

.form-check-label:hover {
  color: #4f46e5;
}

.clear-filter-box {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #eee;
}

.clear-btn {  
  width: 100%;
  padding: 12px 0;
  background: #ff3b30;
  color: #fff;
  border: none;
  border-radius: 6px;  
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s ease;
}

.clear-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-btn:hover:not(:disabled) {
  opacity: 0.85;
}

/* Product Actions */
.product-actions {
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.3s ease;
}

.product-card:hover .product-actions {
  opacity: 1;
  transform: translateX(0);
}

.product-actions .btn {
  transform: translateX(20px);
  transition: all 0.3s ease;
}

.product-card:hover .product-actions .btn {
  transform: translateX(0);
}

.product-actions .btn:nth-child(2) {
  transition-delay: 0.1s;
}

/* Product Topbar */
.product-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 40px;
  padding: 16px 0;
  border-bottom: 1px solid #e9ecef;
}

.topbar-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.count-text {
  font-weight: 500;
  color: #111;
}

.active-category, .active-brand, .active-color {
  color: #4f46e5;
  font-weight: 600;
  background: #eef2ff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* View toggle buttons */
.view-toggle {
  display: flex;
  gap: 8px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 4px;
  background: #f8f9fa;
}

.toggle-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6c757d;
}

.toggle-btn:hover {
  background: #e9ecef;
  color: #4f46e5;
}

.toggle-btn.active {
  background: #4f46e5;
  color: white;
}

/* Mobile filter button */
.mobile-filter {
  position: relative;
}

.filter-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  background: #ff3b30;
  border-radius: 50%;
  border: 2px solid white;
}

/* List View */
.product-list-item {
  background: white;
  transition: all 0.3s ease;
}

.product-list-item:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  border-color: #4f46e5;
}

/* Pagination */
.pagination {
  margin-bottom: 0;
}

.page-link {
  border-radius: 8px !important;
  border: 1px solid #e9ecef;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  min-width: 48px;
}

.page-link:hover {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.page-item.active .page-link {
  background-color: #4f46e5;
  border-color: #4f46e5;
  color: white;
  z-index: 0;
}

.page-item.disabled .page-link {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Utility Classes */
.text-line-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.text-line-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.object-fit-cover {
  object-fit: cover;
}

.transition-2 {
  transition: all 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.02);
}

.hover-shadow:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.z-index-1 {
  z-index: 1;
}

/* Active Filter Items */
.active-filter-item {
  display: inline-flex;
  align-items-center: center;
  gap: 8px;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 14px;
  color: #4f46e5;
}

.btn-close-filter {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.btn-close-filter:hover {
  background: #dc3545;
  color: white;
}

/* Rating Stars */
.rating-stars .ph {
  font-size: 12px;
}

/* Product Price */
.product-price .text-lg {
  font-size: 18px;
}

.product-price .text-sm {
  font-size: 14px;
}

/* Add to Cart Button */
.btn-main {
  font-size: 14px;
  padding: 10px 16px;
}

/* Compact Badges */
.badge {
  font-size: 11px;
  font-weight: 500;
  padding: 4px 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .product-list-item .row {
    flex-direction: column;
  }
  
  .product-list-item .col-md-4 {
    width: 100%;
    height: 200px;
  }
  
  .product-image {
    height: 200px !important;
  }
  
  .custom-dropdown {
    width: 100%;
  }
  
  .product-topbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .topbar-info, .topbar-actions {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .topbar-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .size-btn {
    min-width: 40px;
    height: 36px;
    font-size: 12px;
    padding: 0 8px;
  }
  
  .active-filter-item {
    font-size: 12px;
    padding: 4px 8px;
  }
}

/* Price Range Slider Enhancement */
.form-range::-webkit-slider-thumb {
  width: 20px;
  height: 20px;
  background-color: #4f46e5;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.form-range::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background-color: #4f46e5;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.form-range::-webkit-slider-runnable-track {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
}

.form-range::-moz-range-track {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
}
</style>