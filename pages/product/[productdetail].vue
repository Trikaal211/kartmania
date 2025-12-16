<template>
  <section class="product-details py-80">
    <div class="container container-lg">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-80">
        <div class="spinner-border text-main-600" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-16">Product loading...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <!-- Main Content -->
      <div v-else-if="currentProduct" class="row gy-4">
        <div class="col-lg-9">
          <div class="row gy-4">
            <!-- Product Images Section -->
            <div class="col-xl-6">
              <div class="product-details__left">
                <!-- Main Product Image Slider -->
<div class="product-details__thumb-slider overflow-hidden">
  <Swiper
    :modules="[Thumbs]"
    :thumbs="{ swiper: thumbsSwiper }"
    :spaceBetween="0"
    :slidesPerView="1"
    class="main-swiper"
    @swiper="setMainSwiper"
    @slideChange="onSlideChange"
  >
    <SwiperSlide
      v-for="(image, index) in mainImages"
      :key="index"
      class="main-image-slide"
    >
      <div class="main-image-container w-full"  >
        <img 
          :src="image" 
          :alt="`Product image ${index + 1}`"
          class="main-product-image w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    </SwiperSlide>
  </Swiper>
</div>


                <!-- Thumbnail Slider - Modern Design -->
                <!-- <div class="mt-24">
                  <div class="thumbnail-container">
                    <Swiper
                      @swiper="setThumbsSwiper"
                      :spaceBetween="12"
                      :slidesPerView="5"
                      :freeMode="true"
                      :watchSlidesProgress="true"
                      class="thumbnail-swiper"
                    >
                      <SwiperSlide
                        v-for="(thumb, index) in thumbnailImages"
                        :key="index"
                        @click="goToSlide(index)"
                      >
                        <div 
                          :class="['thumbnail-item', activeThumb === index ? 'active-thumbnail' : '']"
                        >
                          <div class="thumbnail-image-wrapper">
                            <img 
                              :src="thumb" 
                              :alt="`Thumbnail ${index + 1}`"
                              class="thumbnail-image"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </SwiperSlide>
                    </Swiper>
                  </div>
                </div> -->
              </div>
            </div>

            <!-- Product Details -->
            <div class="col-xl-6">
              <div class="product-details__content">
                <h5 class="mb-12">{{ currentProduct.name }}</h5>
                <div class="flex-align flex-wrap gap-12">
                  <div class="flex-align gap-12 flex-wrap">
                    <div class="flex-align gap-8">
                      <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                      <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                      <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                      <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                      <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                    </div>
                    <span class="text-sm fw-medium text-neutral-600">4.7 Star Rating</span>
                    <span class="text-sm fw-medium text-gray-500">({{ currentProduct.reviews?.length || 0 }})</span>
                  </div>
                  <span class="text-sm fw-medium text-gray-500">|</span>
                  <span class="text-gray-900">
                    <span class="text-gray-400">SKU:</span> {{ currentProduct.sku }}
                  </span>
                </div>
                <span class="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block"></span>
                <p class="text-gray-700">{{ currentProduct.description }}</p>
                
                <!-- Price Section -->
                <div class="mt-32 flex-align flex-wrap gap-32">
                  <div class="flex-align gap-8">
                    <h4 class="mb-0">₹{{ calculateDiscountedPrice() }}</h4>
                    <span v-if="currentProduct.discountValue > 0" class="text-md text-gray-500 text-decoration-line-through">
                      ₹{{ currentProduct.price }}
                    </span>
                    <span v-if="currentProduct.discountValue > 0" class="text-sm text-success-600 fw-medium ms-8">
                      {{ currentProduct.discountValue }}% OFF
                    </span>
                  </div>
<a @click="orderOnWhatsapp" class="btn btn-main rounded-pill">
  Order on What'sApp
</a>
                </div>
                <span class="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block"></span>

                <!-- Special Offer -->
                <div v-if="currentProduct.discountValue > 0" class="flex-align flex-wrap gap-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-12 py-16 px-24 border border-blue-100">
                  <div class="flex-align gap-16">
                    <span class="text-main-600 text-sm fw-semibold"> Special Offer:</span>
                  </div>
                  <div class="countdown" id="countdown11">
                    <ul class="countdown-list flex-align flex-wrap gap-2">
                      <li class="countdown-list__item bg-white text-heading flex-align gap-4 text-xs fw-semibold w-28 h-28 rounded-6 border border-main-600 p-0 flex-center">
                        <span class="days text-main-600">05</span>
                      </li>
                      <li class="countdown-list__item bg-white text-heading flex-align gap-4 text-xs fw-semibold w-28 h-28 rounded-6 border border-main-600 p-0 flex-center">
                        <span class="hours text-main-600">12</span>
                      </li>
                      <li class="countdown-list__item bg-white text-heading flex-align gap-4 text-xs fw-semibold w-28 h-28 rounded-6 border border-main-600 p-0 flex-center">
                        <span class="minutes text-main-600">30</span>
                      </li>
                      <li class="countdown-list__item bg-white text-heading flex-align gap-4 text-xs fw-semibold w-28 h-28 rounded-6 border border-main-600 p-0 flex-center">
                        <span class="seconds text-main-600">45</span>
                      </li>
                    </ul>
                  </div>
                  <span class="text-gray-900 text-xs fw-medium">Remains until the end of the offer</span>
                  
                </div>
                     
                <!-- Stock Progress -->
                <div class="mb-24">
                  <div class="mt-32 flex-align gap-12 mb-16">
                    <span class="w-32 h-32 bg-gradient-to-br from-green-100 to-green-50 flex-center rounded-circle text-green-600 box-shadow-lg">
                      <i class="ph-fill ph-lightning text-lg"></i>
                    </span>
                    <h6 class="text-md mb-0 fw-bold text-gray-900">
                      {{ getStockStatus() }}
                    </h6>
                  </div>
                  <div class="progress w-100 bg-gray-100 rounded-pill h-8" role="progressbar"
                       :aria-valuenow="calculateStockPercentage()"
                       aria-valuemin="0"
                       aria-valuemax="100">
                    <div class="progress-bar bg-gradient-to-r from-green-500 to-emerald-500 rounded-pill"
                         :style="{ width: calculateStockPercentage() + '%' }"></div>
                  </div>
                  <span class="text-sm text-gray-700 mt-8">
                    Available only: {{ currentProduct.stock }}
                  </span>
                   <div class="mt-24">
                  <div class="thumbnail-container">
                    <Swiper
                      @swiper="setThumbsSwiper"
                      :spaceBetween="12"
                      :slidesPerView="5"
                      :freeMode="true"
                      :watchSlidesProgress="true"
                      class="thumbnail-swiper"
                    >
                      <SwiperSlide
                        v-for="(thumb, index) in thumbnailImages"
                        :key="index"
                        @click="goToSlide(index)"
                      >
                        <div 
                          :class="['thumbnail-item', activeThumb === index ? 'active-thumbnail' : '']"
                        >
                          <div class="thumbnail-image-wrapper">
                            <img 
                              :src="thumb" 
                              :alt="`Thumbnail ${index + 1}`"
                              class="thumbnail-image"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </SwiperSlide>
                    </Swiper>
                  </div>
                </div>
                </div>

                <!-- Quantity and Actions -->
                <span class="text-gray-900 d-block mb-8 fw-semibold">Quantity:</span>
                <div class="flex-between gap-16 flex-wrap">
                  <div class="flex-align flex-wrap gap-16">
                    <div class="border border-gray-200 rounded-full py-8 px-16 flex-align bg-white shadow-sm">
                      <button
                        type="button"
                        @click="decreaseQuantity"
                        class="quantity__minus w-32 h-32 flex-center rounded-full hover:bg-gray-50 transition-colors"
                        :disabled="quantity <= 1"
                        :class="quantity <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover-text-main-600'"
                      >
                        <i class="ph ph-minus text-lg"></i>
                      </button>
                      <input
                        type="number"
                        v-model.number="quantity"
                        class="quantity__input border-0 text-center w-48 fw-bold text-gray-900"
                        :max="currentProduct.stock"
                        min="1"
                        @input="validateQuantity"
                      />
                      <button
                        type="button"
                        @click="increaseQuantity"
                        class="quantity__plus w-32 h-32 flex-center rounded-full hover:bg-gray-50 transition-colors"
                        :disabled="quantity >= currentProduct.stock"
                        :class="quantity >= currentProduct.stock ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover-text-main-600'"
                      >
                      
                        <i class="ph ph-plus text-lg"></i>
                      </button>
                    </div>
                   <NuxtLink 
  :to="`/product/cart?pid=${encodeId(currentProduct.id)}`"
  class="d-inline-block"
>
  <button
    @click="addToCart"
    :class="[
      'btn rounded-full flex-align d-inline-flex gap-8 px-48 py-12 fw-semibold shadow-sm transition-all duration-300',
      currentProduct.stock <= 0 ? 'btn-secondary' : 'btn-main hover:shadow-lg hover:-translate-y-0.5'
    ]"
    :disabled="currentProduct.stock <= 0 || quantity <= 0"
  >
    <i class="ph ph-shopping-cart text-lg"></i>
    {{ currentProduct.stock <= 0 ? 'Out of Stock' : 'Add To Cart' }}
  </button>
</NuxtLink>

                  </div>

                  <div class="flex-align gap-12">
                    <button
                      @click="toggleWishlist"
                      :class="['w-52 h-52 flex-center rounded-circle text-xl transition-all duration-300', 
                               isInWishlist ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg' : 
                               'bg-gradient-to-br from-gray-50 to-white text-gray-600 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 hover:text-red-500 border border-gray-100 shadow-sm']"
                    >
                      <i class="ph" :class="isInWishlist ? 'ph-heart-fill' : 'ph-heart'"></i>
                    </button>
                    <button
                      @click="compareProduct"
                      class="w-52 h-52 bg-gradient-to-br from-gray-50 to-white text-gray-600 text-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:text-blue-500 flex-center rounded-circle border border-gray-100 shadow-sm transition-all duration-300"
                    >
                      <i class="ph ph-shuffle"></i>
                    </button>
                    <button
                      @click="shareProduct"
                      class="w-52 h-52 bg-gradient-to-br from-gray-50 to-white text-gray-600 text-xl hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:text-green-500 flex-center rounded-circle border border-gray-100 shadow-sm transition-all duration-300"
                    >
                      <i class="ph ph-share-network"></i>
                    </button>
                  </div>
                </div>

                <span class="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block"></span>

                <!-- Category Info -->
               <div class="mt-24">
  <div class="flex-align gap-12 mb-16">
    <span class="text-gray-900 fw-semibold">Category:</span>

    <!-- Main Category -->
    <span class="badge bg-black text-white border border-black">
      {{ currentProduct.category?.name }}
    </span>

    <!-- Sub Category -->
    <span 
      v-if="currentProduct.subCategory"
      class="badge bg-black text-white border border-black"
    >
      {{ currentProduct.subCategory.name }}
    </span>
  </div>
</div>

              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar - All Content Added -->
        <div class="col-lg-3">
          <div class="product-details__sidebar border border-gray-100 rounded-16 overflow-hidden shadow-sm">
            <!-- Store Info -->
       <div class="p-24 bg-yellow-400">
  <div class="flex-between rounded-full p-8">
    <div class="flex-align gap-8">

      <!-- Icon (no shadow) -->
      <span class="w-44 h-44 bg-white rounded-full flex-center text-2xl text-main-600">
        <i class="ph ph-storefront"></i>
      </span>

      <span class="text-white fw-semibold">by Marketpro</span>
    </div>

    <!-- Button (shadow removed) -->
    <NuxtLink
      to="/shop"
      class="btn btn-white rounded-full text-uppercase fw-semibold transition-all duration-300"
    >
      View Store
    </NuxtLink>
  </div>
</div>



            <!-- Features Section - Added ALL content -->
            <div class="sidebar-features">
              <!-- Fast Delivery -->
              <div class="p-24 bg-gradient-to-r from-gray-50 to-white d-flex align-items-start gap-24 border-bottom border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                <span class="w-44 h-44 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 rounded-full flex-center text-2xl flex-shrink-0 shadow-sm">
                  <i class="ph-fill ph-truck"></i>
                </span>
                <div class="">
                  <h6 class="text-sm mb-8 fw-semibold text-gray-900">Fast Delivery</h6>
                  <p class="text-gray-700 text-sm">Lightning-fast shipping, guaranteed.</p>
                </div>
              </div>

              <!-- Free Returns -->
              <div class="p-24 bg-gradient-to-r from-gray-50 to-white d-flex align-items-start gap-24 border-bottom border-gray-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300">
                <span class="w-44 h-44 bg-gradient-to-br from-green-100 to-green-50 text-green-600 rounded-full flex-center text-2xl flex-shrink-0 shadow-sm">
                  <i class="ph-fill ph-arrow-u-up-left"></i>
                </span>
                <div class="">
                  <h6 class="text-sm mb-8 fw-semibold text-gray-900">Free 90-day returns</h6>
                  <p class="text-gray-700 text-sm">Shop risk-free with easy returns.</p>
                </div>
              </div>

              <!-- Pickup Available -->
              <div class="p-24 bg-gradient-to-r from-gray-50 to-white d-flex align-items-start gap-24 border-bottom border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300">
                <span class="w-44 h-44 bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 rounded-full flex-center text-2xl flex-shrink-0 shadow-sm">
                  <i class="ph-fill ph-check-circle"></i>
                </span>
                <div class="">
                  <h6 class="text-sm mb-8 fw-semibold text-gray-900">Pickup available at Shop location</h6>
                  <p class="text-gray-700 text-sm">Usually ready in 24 hours</p>
                </div>
              </div>

              <!-- Payment -->
              <div class="p-24 bg-gradient-to-r from-gray-50 to-white d-flex align-items-start gap-24 border-bottom border-gray-100 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-all duration-300">
                <span class="w-44 h-44 bg-gradient-to-br from-yellow-100 to-yellow-50 text-yellow-600 rounded-full flex-center text-2xl flex-shrink-0 shadow-sm">
                  <i class="ph-fill ph-credit-card"></i>
                </span>
                <div class="">
                  <h6 class="text-sm mb-8 fw-semibold text-gray-900">Payment</h6>
                  <p class="text-gray-700 text-sm">Payment upon receipt of goods, Payment by card in the department, Google Pay, Online card.</p>
                </div>
              </div>

              <!-- Warranty -->
              <div class="p-24 bg-gradient-to-r from-gray-50 to-white d-flex align-items-start gap-24 border-bottom border-gray-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300">
                <span class="w-44 h-44 bg-gradient-to-br from-red-100 to-red-50 text-red-600 rounded-full flex-center text-2xl flex-shrink-0 shadow-sm">
                  <i class="ph-fill ph-check-circle"></i>
                </span>
                <div class="">
                  <h6 class="text-sm mb-8 fw-semibold text-gray-900">Warranty</h6>
                  <p class="text-gray-700 text-sm">The Consumer Protection Act does not provide for the return of this product of proper quality.</p>
                </div>
              </div>

              <!-- Packaging -->
              <div class="p-24 bg-gradient-to-r from-gray-50 to-white d-flex align-items-start gap-24 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-300">
                <span class="w-44 h-44 bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 rounded-full flex-center text-2xl flex-shrink-0 shadow-sm">
                  <i class="ph-fill ph-package"></i>
                </span>
                <div class="">
                  <h6 class="text-sm mb-8 fw-semibold text-gray-900">Packaging</h6>
                  <p class="text-gray-700 text-sm">Research & development value proposition graphical user interface investor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Tabs Section -->
      <div v-if="!loading && !error && currentProduct" class="pt-80">
        <div class="product-dContent border border-gray-100 rounded-24 shadow-sm">
          <div class="product-dContent__header border-bottom border-gray-100 flex-between flex-wrap gap-16 p-24">
            <ul class="nav common-tab nav-pills mb-3" role="tablist">
              <li class="nav-item" role="presentation">
                <button
                  :class="['nav-link fw-semibold', activeTab === 'description' ? 'active' : '']"
                  @click="activeTab = 'description'"
                  type="button"
                >
                  Description
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  :class="['nav-link fw-semibold', activeTab === 'reviews' ? 'active' : '']"
                  @click="activeTab = 'reviews'"
                  type="button"
                >
                  Reviews ({{ currentProduct.reviews?.length || 0 }})
                </button>
              </li>
            </ul>
           <div class="bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 rounded-12 flex-align gap-8 hover:from-green-100 hover:to-emerald-100 hover:text-green-700 transition-all duration-300 border border-green-200">
  <img src="/assets/images/icon/satisfaction-icon.png" alt="Satisfaction Guaranteed" class="w-24 h-24">
  100% Satisfaction Guaranteed
</div>

          </div>
          
          <div class="product-dContent__box p-24">
            <!-- Description Tab -->
            <div v-if="activeTab === 'description'" class="tab-content">
              <div class="mb-40">
                <h6 class="mb-24 fw-bold">Product Description</h6>
                <p class="text-gray-700">{{ currentProduct.description }}</p>
                
                <div v-if="currentProduct.category" class="mt-32">
                  <h6 class="mb-16 fw-semibold">Product Categories</h6>
                 <div class="d-flex flex-wrap gap-12">
  <span class="badge bg-black text-white border border-black">
    {{ currentProduct.category.name }}
  </span>

  <span 
    v-if="currentProduct.subCategory"
    class="badge bg-black text-white border border-black"
  >
    {{ currentProduct.subCategory.name }}
  </span>

  <span 
    v-if="currentProduct.subSubCategory"
    class="badge bg-black text-white border border-black"
  >
    {{ currentProduct.subSubCategory.name }}
  </span>
</div>

                </div>

                <!-- Product Information -->
                <div class="mt-40">
                  <h6 class="mb-24 fw-bold">Product Information</h6>
                  <ul class="mt-32">
                    <li class="text-gray-400 mb-14 flex-align gap-14">
                      <span class="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 text-xs flex-center rounded-full shadow-sm">
                        <i class="ph ph-check"></i>
                      </span>
                      <span class="text-heading fw-medium">
                        SKU: <span class="text-gray-500">{{ currentProduct.sku }}</span>
                      </span>
                    </li>
                    <li class="text-gray-400 mb-14 flex-align gap-14">
                      <span class="w-20 h-20 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 text-xs flex-center rounded-full shadow-sm">
                        <i class="ph ph-check"></i>
                      </span>
                      <span class="text-heading fw-medium">
                        Barcode: <span class="text-gray-500">{{ currentProduct.barcode || 'N/A' }}</span>
                      </span>
                    </li>
                    <li class="text-gray-400 mb-14 flex-align gap-14">
                      <span class="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 text-green-600 text-xs flex-center rounded-full shadow-sm">
                        <i class="ph ph-check"></i>
                      </span>
                      <span class="text-heading fw-medium">
                        Unit: <span class="text-gray-500">{{ currentProduct.unit?.name }} ({{ currentProduct.unit?.shortName }})</span>
                      </span>
                    </li>
                    <li v-if="currentProduct.manufacturedDate" class="text-gray-400 mb-14 flex-align gap-14">
                      <span class="w-20 h-20 bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-600 text-xs flex-center rounded-full shadow-sm">
                        <i class="ph ph-check"></i>
                      </span>
                      <span class="text-heading fw-medium">
                        Manufactured: <span class="text-gray-500">{{ formatDate(currentProduct.manufacturedDate) }}</span>
                      </span>
                    </li>
                    <li v-if="currentProduct.expiryDate" class="text-gray-400 mb-14 flex-align gap-14">
                      <span class="w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 text-red-600 text-xs flex-center rounded-full shadow-sm">
                        <i class="ph ph-check"></i>
                      </span>
                      <span class="text-heading fw-medium">
                        Expiry: <span class="text-gray-500">{{ formatDate(currentProduct.expiryDate) }}</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Reviews Tab -->
            <div v-else-if="activeTab === 'reviews'" class="tab-content">
              <div class="row g-4">
                <div class="col-lg-6">
                  <h6 class="mb-24 fw-bold">Customer Reviews ({{ currentProduct.reviews?.length || 0 }})</h6>
                  
                  <!-- Reviews List -->
                  <div v-if="currentProduct.reviews && currentProduct.reviews.length > 0">
                    <div v-for="(review, index) in currentProduct.reviews" :key="index"
                         class="d-flex align-items-start gap-24 pb-44 border-bottom border-gray-100 mb-44">
                      <img src="/assets/images/thumbs/comment-img1.png" alt="" class="w-52 h-52 object-fit-cover rounded-full flex-shrink-0 shadow-sm">
                      <div class="flex-grow-1">
                        <div class="flex-between align-items-start gap-8">
                          <div class="">
                            <h6 class="mb-12 text-md fw-semibold">Customer {{ index + 1 }}</h6>
                            <div class="flex-align gap-8">
                              <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                              <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                              <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                              <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                              <span class="text-xs fw-medium text-warning-600 d-flex"><i class="ph-fill ph-star"></i></span>
                            </div>
                          </div>
                          <span class="text-gray-800 text-xs">{{ formatDate(review.createdAt) }}</span>
                        </div>
                        <h6 class="mb-14 text-md mt-24 fw-semibold">Great Product</h6>
                        <p class="text-gray-700">{{ review.comment || 'No comment provided' }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center py-40 border border-gray-100 rounded-12 bg-gray-50">
                    <div class="mb-16">
                      <i class="ph ph-chat-circle-text text-4xl text-gray-400"></i>
                    </div>
                    <p class="text-gray-500 mb-8">No reviews yet.</p>
                    <p class="text-gray-400 text-sm">Be the first to review this product!</p>
                  </div>

                  <!-- Review Form -->
                  <div class="mt-56 border border-gray-100 rounded-12 p-24 bg-gradient-to-br from-gray-50 to-white">
                    <div class="mb-24">
                      <h6 class="mb-24 fw-bold">Write a Review</h6>
                      <span class="text-heading mb-8 d-block fw-medium">What is it like to Product?</span>
                      <div class="flex-align gap-8 mb-24">
                        <span 
                          v-for="star in 5" 
                          :key="star"
                          @click="setRating(star)"
                          :class="['text-2xl cursor-pointer transition-transform hover:scale-110', 
                                   star <= rating ? 'text-warning-500' : 'text-gray-300']"
                        >
                          <i class="ph" :class="star <= rating ? 'ph-fill ph-star' : 'ph-star'"></i>
                        </span>
                      </div>
                    </div>
                    <div class="mt-32">
                      <form @submit.prevent="submitReview">
                        <div class="mb-32">
                          <label for="title" class="text-neutral-600 mb-8 d-block fw-medium">Review Title</label>
                          <input 
                            type="text" 
                            v-model="reviewTitle" 
                            class="common-input rounded-8 w-100 p-12 border border-gray-200 focus:border-main-600 focus:ring-2 focus:ring-main-500/20 transition-all duration-300" 
                            id="title" 
                            placeholder="Great Products"
                            required
                          >
                        </div>
                        <div class="mb-32">
                          <label for="desc" class="text-neutral-600 mb-8 d-block fw-medium">Review Content</label>
                          <textarea 
                            v-model="reviewContent" 
                            class="common-input rounded-8 w-100 p-12 border border-gray-200 focus:border-main-600 focus:ring-2 focus:ring-main-500/20 transition-all duration-300" 
                            id="desc" 
                            rows="5"
                            placeholder="Share your experience with this product..."
                            required
                          ></textarea>
                        </div>
                        <button type="submit" class="btn btn-main rounded-full mt-48 px-32 py-12 fw-semibold shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                          Submit Review
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="ms-xxl-5">
                    <h6 class="mb-24 fw-bold">Customer Feedback Summary</h6>
                    <div class="border border-gray-100 rounded-12 p-24 bg-gradient-to-br from-gray-50 to-white">
                      <!-- Add feedback summary here -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from '#app'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Thumbs } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/thumbs'

// Get route for product name/slug
const route = useRoute()

// Get product name from URL params (slug format)
const productSlug = route.params.productdetail // This should be the product name

// State
const thumbsSwiper = ref(null)
const mainSwiper = ref(null)
const quantity = ref(1)
const isInWishlist = ref(false)
const rating = ref(0)
const reviewTitle = ref('')
const reviewContent = ref('')
const activeTab = ref('description')
const activeThumb = ref(0)

// Product Data
const currentProduct = ref(null)
const loading = ref(false)
const error = ref(null)

// Images
const mainImages = ref([])
const thumbnailImages = ref([])

// Watch for route changes
watch(() => route.params.productdetail, (newSlug) => {
  if (newSlug) {
    fetchProductByName(newSlug)
  }
})


// Fetch product by name/slug from API
const fetchProduct = async () => {
  if (!productSlug) {
    error.value = 'No product name found in URL'
    return
  }

  loading.value = true
  error.value = null

  try {
    console.log('Fetching product with name/slug:', productSlug)
    
    // First try to fetch by name
    const res = await fetch(`https://kartmania-api.vibrantick.org/common/product/read/name/${encodeURIComponent(productSlug)}`)
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data = await res.json()
    console.log('API Response by name:', data)
    
    if (data.message === 'Product data fetched with related category and unit') {
      currentProduct.value = data.data
      console.log('Product loaded by name neyjdhjdhjdgjghghg:' , currentProduct.value.name)
      updateImagesFromAPI(data.data)
      console.log( data.data)
    } else {
      // If not found by name, try to find in all products
      await fetchAllProducts()
    }
  } catch (err) {
    console.error('Error fetching product by name:', err)
    error.value = 'Failed to load product by name. Trying fallback...'
    await fetchAllProducts()
  } finally {
    loading.value = false
  }
}
const orderOnWhatsapp = () => {
  const phone = "8219773546"
  const imageUrl = getImageUrl(currentProduct.value);  // ← FIXED

  const message = `
 *New Order Request*
--------------------------------
 *Product:* ${currentProduct.value.name}
 *Price:* ₹${calculateDiscountedPrice()}
 *SKU:* ${currentProduct.value.sku}
 *Image:* ${imageUrl}



Please confirm the availability.
  `

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  window.open(url, "_blank")
}

/*id - decode*/
function encodeId(id) {
  return btoa(id.toString())     // encode to Base64
}

const getImageUrl = (product) => {
  if (!product) return "";

  const img = product.images?.[0];

  if (!img) return "";

  // CASE 1: { url: "..." }
  if (typeof img.url === "string") return img.url;

  // CASE 2: { image: "..." }
  if (typeof img.image === "string") return img.image;

  // CASE 3: { url: { secure_url: "..." } }
  if (typeof img.url === "object") return img.url.secure_url || "";

  // CASE 4: direct string
  if (typeof img === "string") return img;

  return "";
};

// Fallback: Fetch all products and find by name/slug
const fetchAllProducts = async () => {
  try {
    console.log('Trying fallback API (fetch all products)...')
    const res = await fetch('https://kartmania-api.vibrantick.org/common/product/read')
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data = await res.json()
    console.log('All products response:', data)
    
    if (data.message === 'All product data fetched with related category and unit') {
      // Find product by name (case-insensitive, remove special characters)
      const cleanSlug = productSlug.toLowerCase().replace(/[^a-z0-9\s]/g, '')
      
      const foundProduct = data.data.find(p => {
        // Try multiple matching strategies
        const productName = p.name.toLowerCase()
        const productSku = p.sku.toLowerCase()
        
        return productName.includes(cleanSlug) || 
               productSku.includes(cleanSlug) ||
               p.name.toLowerCase() === productSlug.toLowerCase()
      })
      
      if (foundProduct) {
        currentProduct.value = foundProduct
        updateImagesFromAPI(foundProduct)
        console.log('Product found in fallback:', foundProduct)
      } else {
        error.value = `Product "${productSlug}" not found in database`
      }
    } else {
      error.value = 'Failed to fetch products from API'
    }
  } catch (err) {
    console.error('Error in fallback:', err)
    error.value = 'Unable to load product data. Please check your connection.'
  }
}

// Function to fetch by name (used in watch)
const fetchProductByName = async (productName) => {
  loading.value = true
  error.value = null
  
  try {
    console.log('Fetching product by name:', productName)
    
    // Decode URL if needed
    const decodedName = decodeURIComponent(productName)
    
    const res = await fetch(`https://kartmania-api.vibrantick.org/common/product/read/name/${encodeURIComponent(decodedName)}`)
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data = await res.json()
    
    if (data.message === 'Product data fetched with related category and unit') {
      currentProduct.value = data.data
      updateImagesFromAPI(data.data)
      console.log('Product loaded:', data.data)
    } else {
      await fetchAllProducts()
    }
  } catch (err) {
    console.error('Error fetching product:', err)
    error.value = 'Failed to load product. Please try again.'
    await fetchAllProducts()
  } finally {
    loading.value = false
  }
}

// Update images from API data
const updateImagesFromAPI = (productData) => {
  if (productData.images && productData.images.length > 0) {
    console.log('Product images found:', productData.images)
    
    // Extract image URLs
    const imageUrls = productData.images.map(img => img.imageUrl)
    
    // Set both main and thumbnail images
    mainImages.value = imageUrls
    thumbnailImages.value = imageUrls
    
    console.log('Main images set:', mainImages.value)
    console.log('Thumbnail images set:', thumbnailImages.value)
  } else {
    console.log('No images found, using fallback')
    // Fallback image if no images
    const fallbackImage = 'https://via.placeholder.com/800x800?text=No+Image+Available'
    mainImages.value = [fallbackImage]
    thumbnailImages.value = [fallbackImage]
  }
}

// Helper Methods
const calculateDiscountedPrice = () => {
  if (!currentProduct.value) return '0'
  
  const price = parseFloat(currentProduct.value.price) || 0
  const discount = parseFloat(currentProduct.value.discountValue) || 0
  
  if (discount > 0 && currentProduct.value.discount === 'PERCENTAGE') {
    const discountedPrice = price - (price * discount / 100)
    return discountedPrice.toFixed(2)
  }
  
  return price.toFixed(2)
}

const calculateStockPercentage = () => {
  if (!currentProduct.value) return 0
  
  const maxStock = 100
  const currentStock = currentProduct.value.stock || 0
  
  return Math.min((currentStock / maxStock) * 100, 100)
}

const getStockStatus = () => {
  if (!currentProduct.value) return 'Stock information not available'
  
  const stock = currentProduct.value.stock || 0
  
  if (stock <= 0) return 'Out of Stock'
  if (stock <= 5) return 'Low Stock - Hurry!'
  if (stock <= 20) return 'Limited Stock Available'
  return 'In Stock'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (e) {
    return 'Invalid date'
  }
}

// Swiper Methods
const setThumbsSwiper = (swiper) => {
  console.log('Thumbs swiper set:', swiper)
  thumbsSwiper.value = swiper
}

const setMainSwiper = (swiper) => {
  console.log('Main swiper set:', swiper)
  mainSwiper.value = swiper
}

const goToSlide = (index) => {
  console.log('Going to slide:', index)
  activeThumb.value = index
  if (mainSwiper.value) {
    mainSwiper.value.slideTo(index)
  }
}

const onSlideChange = (swiper) => {
  activeThumb.value = swiper.activeIndex
}

// Quantity Methods
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  if (currentProduct.value && quantity.value < currentProduct.value.stock) {
    quantity.value++
  }
}

const validateQuantity = () => {
  if (quantity.value < 1) {
    quantity.value = 1
  }
  if (currentProduct.value && quantity.value > currentProduct.value.stock) {
    quantity.value = currentProduct.value.stock
  }
}

// Action Methods
const addToCart = () => {
  if (currentProduct.value && currentProduct.value.stock > 0 && quantity.value > 0) {
    console.log('Added to cart:', {
      product: currentProduct.value.name,
      productId: currentProduct.value.id,
      quantity: quantity.value,
      price: calculateDiscountedPrice(),
      total: (quantity.value * parseFloat(calculateDiscountedPrice())).toFixed(2)
    })
    
    alert(`${quantity.value} × ${currentProduct.value.name} added to cart!`)
  } else {
    alert('Cannot add to cart. Check quantity and stock availability.')
  }
}

const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value
  console.log('Wishlist status:', isInWishlist.value)
  alert(isInWishlist.value ? 'Added to wishlist!' : 'Removed from wishlist!')
}

const compareProduct = () => {
  console.log('Compare product clicked')
  alert('Product added to compare list!')
}

const shareProduct = () => {
  if (navigator.share) {
    navigator.share({
      title: currentProduct.value?.name || "Product",
      text: `Check out ${currentProduct.value?.name} for ₹${calculateDiscountedPrice()}`,
      url: window.location.href
    }).then(() => {
      console.log('Product shared successfully')
    }).catch(err => {
      console.error('Error sharing:', err)
    })
  } else {
    console.log('Web Share API not supported')
    alert('Share feature not supported on this browser')
  }
}

const setRating = (stars) => {
  rating.value = stars
  console.log('Rating set to:', stars)
}

const submitReview = () => {
  if (!reviewTitle.value.trim() || !reviewContent.value.trim()) {
    alert('Please fill in both title and content for review.')
    return
  }
  
  console.log('Review submitted:', {
    productName: currentProduct.value?.name,
    rating: rating.value,
    title: reviewTitle.value,
    content: reviewContent.value
  })
  
  alert('Review submitted successfully! Thank you for your feedback.')
  
  rating.value = 0
  reviewTitle.value = ''
  reviewContent.value = ''
}

// Lifecycle
onMounted(() => {
  console.log('Product Details page mounted')
  console.log('URL Product Name/Slug:', productSlug)
  
  if (productSlug) {
    fetchProduct()
  } else {
    error.value = 'No product name specified in URL'
    loading.value = false
  }
  
})

</script>

<style scoped>
/* Modern Main Image Styles */
.main-image-slide {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.main-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.main-product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
  transition: transform 0.3s ease;
}

.main-product-image:hover {
  transform: scale(1.02);
}

/* Modern Thumbnail Styles */
.thumbnail-container {
  padding: 8px 4px;
}

.thumbnail-item {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.thumbnail-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.thumbnail-item.active-thumbnail {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  transform: translateY(-2px);
}

.thumbnail-image-wrapper {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px;
}
.main-product-image {
  width: 100%;
  height: 100%;
  object-fit: cover !important;
  object-position: center;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
}

/* Custom Styles */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.bg-gradient-to-b {
  background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
}

/* Custom Color Classes for Tailwind-like gradients */
.from-blue-50 { --tw-gradient-from: #eff6ff; }
.to-blue-100 { --tw-gradient-to: #dbeafe; }

.from-indigo-50 { --tw-gradient-from: #eef2ff; }
.to-indigo-100 { --tw-gradient-to: #e0e7ff; }

.from-purple-50 { --tw-gradient-from: #faf5ff; }
.to-purple-100 { --tw-gradient-to: #ede9fe; }

.from-pink-50 { --tw-gradient-from: #fdf2f8; }
.to-pink-100 { --tw-gradient-to: #fce7f3; }

.from-green-50 { --tw-gradient-from: #f0fdf4; }
.to-green-100 { --tw-gradient-to: #dcfce7; }

.from-emerald-50 { --tw-gradient-from: #ecfdf5; }
.to-emerald-100 { --tw-gradient-to: #d1fae5; }

.from-yellow-50 { --tw-gradient-from: #fefce8; }
.to-yellow-100 { --tw-gradient-to: #fef9c3; }

.from-orange-50 { --tw-gradient-from: #fff7ed; }
.to-orange-100 { --tw-gradient-to: #fed7aa; }

.from-red-50 { --tw-gradient-from: #fef2f2; }
.to-red-100 { --tw-gradient-to: #fee2e2; }

/* Main Colors */
.from-main-600 { --tw-gradient-from: #2563eb; }
.to-blue-600 { --tw-gradient-to: #2563eb; }

.from-blue-100 { --tw-gradient-from: #dbeafe; }
.to-blue-50 { --tw-gradient-to: #eff6ff; }

.text-main-600 {
  color: #2563eb;
}

.bg-main-600 {
  background-color: #2563eb;
}

.bg-main-50 {
  background-color: #eff6ff;
}

/* Shadow Utilities */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.box-shadow-lg {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Transition Utilities */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-300 {
  transition-duration: 300ms;
}

/* Hover States */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.hover\:-translate-y-0\.5:hover {
  transform: translateY(-2px);
}

.hover\:scale-110:hover {
  transform: scale(1.1);
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.hover\:text-main-600:hover {
  color: #2563eb;
}

/* Focus States */
.focus\:border-main-600:focus {
  border-color: #2563eb;
}

.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.focus\:ring-main-500\/20:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* Badge Styles */
.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* Form Inputs */
.common-input {
  border: 1px solid #e5e7eb;
  background: white;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.common-input:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Quantity Input */
.quantity__input {
  -moz-appearance: textfield;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.quantity__input::-webkit-outer-spin-button,
.quantity__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Remove all padding/margin from thumbnail slider */
.thumbnail-swiper,
.thumbnail-swiper .swiper,
.thumbnail-swiper .swiper-wrapper,
.thumbnail-swiper .swiper-slide {
  padding: 0 !important;
  margin: 0 !important;
  box-sizing: border-box !important;
}

/* Fix slide size */
.thumbnail-swiper .swiper-slide {
  width: 72px !important;    /* tum apne hisab se change kar sakte ho */
  height: 72px !important;
}

/* Remove inside wrapper padding */
.thumbnail-image-wrapper {
  padding: 0 !important;
  margin: 0 !important;
  width: 100%;
  height: 100%;
}

/* Thumbnails look clean */
.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* Active thumbnail border */
.active-thumbnail {
  border: 2px solid #2563eb;   /* Blue border */
  border-radius: 8px;
}
.main-image-container {
  width: 100%;
  aspect-ratio: 3 / 4;  /* perfect fashion product ratio */
  background: #f1f5f9;
}

.main-product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;   /* no cropping */
}

/* Button Styles */
.btn-main {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
}

.btn-main:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

/* Progress Bar */
.progress-bar {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

/* Loading Spinner */
.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 3px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-image-container {
    height: 300px;
  }
  
  .thumbnail-image-wrapper {
    height: 60px;
  }
}
</style>