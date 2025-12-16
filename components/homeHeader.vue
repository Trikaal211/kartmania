<template>
  <header class="header bg-white border-bottom-0 box-shadow-3xl py-10 z-2">
    <div class="container container-lg">
      <nav class="header-inner d-flex justify-content-between gap-8">
        <div class="flex-align menu-category-wrapper position-relative">
          <!-- Category Dropdown Start -->
          <div class="">
            <button 
              type="button" 
              class="category-button d-flex align-items-center gap-12 text-white bg-black px-20 py-16 rounded-6 hover-bg-success-700 transition-2"
              @click="toggleDropdown"
            >
              <span class="text-xl line-height-1"><i class="ph ph-squares-four"></i></span>
              <span class="">Browse Categories</span>
              <span class="line-height-1 icon transition-2"><i :class="['ph', showDropdown ? 'ph-caret-up' : 'ph-caret-down', 'ph-bold']"></i></span>
            </button>

            <!-- Dropdown Start --> 
            <div 
              v-show="showDropdown" 
              class="category-dropdown border border-success-200 shadow-lg bg-white p-16 rounded-16 w-100 max-w-472 position-absolute inset-block-start-100 inset-inline-start-0 z-999 transition-2"
              @click.stop
            >
              <div class="d-grid grid-cols-3-repeat gap-4 max-h-350 overflow-y-auto">
                <NuxtLink 
                  v-for="category in categories" 
                  :key="category.id"
                  :to="category.path" 
                  class="py-16 px-8 rounded-8 hover-bg-main-50 d-flex flex-column align-items-center text-center border border-white hover-border-main-100"
                  @click="closeDropdown"
                >
                  <span class="">
                    <img :src="category.image" :alt="category.name" class="w-40">
                  </span>
                  <span class="fw-semibold text-heading mt-16 text-sm">{{ category.name }}</span>
                </NuxtLink>
              </div>
            </div>
            <!-- Dropdown End -->
          </div>
          <!-- Category Dropdown End -->

          <!-- Menu Start  -->
          <div class="header-menu d-lg-block d-none">
            <!-- Nav Menu Start -->
            <ul class="nav-menu flex-align">
              <!-- Home -->
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/" 
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active-red': activeLink === 'home' }"
                  @click="setActiveLink('home')"
                >
                  Home
                </NuxtLink>
              </li>

              <!-- Shop -->
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/product/shop-all"
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active-red': activeLink === 'shop' }"
                  @click="setActiveLink('shop')"
                >
                  Shop
                </NuxtLink>
              </li>

              <!-- Become a Seller -->
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/person/seller" 
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active-red': activeLink === 'seller' }"
                  @click="setActiveLink('seller')"
                >
                  Become a Seller
                </NuxtLink>
              </li>

              <!-- Blog -->
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/person/blog" 
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active-red': activeLink === 'blog' }"
                  @click="setActiveLink('blog')"
                >
                  Blog
                </NuxtLink>
              </li>

              <!-- Contact Us -->
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/person/contact" 
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active-red': activeLink === 'contact' }"
                  @click="setActiveLink('contact')"
                >
                  Contact Us
                </NuxtLink>
              </li>
            </ul>
            <!-- Nav Menu End -->
          </div>
          <!-- Menu End  -->
        </div>

        <!-- Header Right start -->
        <div class="header-right flex-align gap-20">
          <!-- Phone Contact -->
          <a href="tel:+(2)871382023" class="d-sm-flex align-items-center gap-16 d-none" @click.prevent="callPhone"> 
            <span class="d-flex text-32">
              <img src="/assets/images/icon/mobile.png" alt="Mobile Icon">
            </span>
            <span class="">
              <span class="d-block text-heading fw-medium">Need any Help! call Us</span>
              <span class="d-block fw-bold text-main-600 hover-text-decoration-underline">+(2) 871 382 023</span>
            </span>
          </a>
          
          <!-- 🔴 MOBILE MENU DROPDOWN START -->
          <div class="position-relative">
            <!-- Mobile Menu Toggle Button -->
            <button 
              type="button" 
              class="toggle-mobileMenu d-lg-none ms-3n text-gray-800 text-4xl d-flex align-items-center justify-content-center w-48 h-48 rounded-8 hover-bg-gray-100 transition-2"
              @click="toggleMobileMenu"
            >
              <i class="ph text-2xl" :class="showMobileMenu ? 'ph-x' : 'ph-list'"></i>
            </button>

            <!-- Mobile Menu Dropdown - UPDATED DESIGN -->
            <div 
              v-if="showMobileMenu" 
              class="mobile-menu-dropdown bg-white border border-gray-300 rounded-16 shadow-2xl position-absolute inset-block-start-100 inset-inline-end-0 mt-8 min-w-280 z-9999 overflow-hidden"
              @click.stop
            >
              <!-- Dropdown Header -->
              <div class="bg-main-600 text-white px-24 py-16">
                <div class="d-flex align-items-center justify-content-between">
                  <h3 class="text-lg fw-bold m-0">Navigation Menu</h3>
                  <button 
                    @click="closeMobileMenu" 
                    class="btn-close-mobile text-white hover-bg-white hover-text-main-600 w-32 h-32 rounded-circle d-flex align-items-center justify-content-center transition-2"
                  >
                    <i class="ph ph-x text-lg"></i>
                  </button>
                </div>
              </div>
              
              <!-- Mobile Menu Items -->
              <div class="py-12 px-16 max-h-400 overflow-y-auto">
                <!-- Home -->
                <NuxtLink 
                  to="/" 
                  class="mobile-menu-item d-flex align-items-center gap-16 px-20 py-16 text-gray-800 hover-bg-gray-50 hover-text-main-600 transition-2 rounded-8 mb-8"
                  :class="{ 'active-mobile': activeLink === 'home' }"
                  @click="closeMobileMenu"
                >
                  <div class="menu-icon-container bg-main-50 text-main-600 w-40 h-40 rounded-circle d-flex align-items-center justify-content-center">
                    <i class="ph ph-house text-lg"></i>
                  </div>
                  <div class="flex-grow-1">
                    <span class="fw-semibold text-sm d-block">Home</span>
                    <span class="text-xs text-gray-500">Main Dashboard</span>
                  </div>
                  <i v-if="activeLink === 'home'" class="ph ph-check-circle text-success-600 text-lg"></i>
                </NuxtLink>

                <!-- Shop -->
                <NuxtLink 
                  to="/product/shop-all"
                  class="mobile-menu-item d-flex align-items-center gap-16 px-20 py-16 text-gray-800 hover-bg-gray-50 hover-text-main-600 transition-2 rounded-8 mb-8"
                  :class="{ 'active-mobile': activeLink === 'shop' }"
                  @click="closeMobileMenu"
                >
                  <div class="menu-icon-container bg-orange-50 text-orange-600 w-40 h-40 rounded-circle d-flex align-items-center justify-content-center">
                    <i class="ph ph-shopping-bag text-lg"></i>
                  </div>
                  <div class="flex-grow-1">
                    <span class="fw-semibold text-sm d-block">Shop</span>
                    <span class="text-xs text-gray-500">Browse Products</span>
                  </div>
                  <i v-if="activeLink === 'shop'" class="ph ph-check-circle text-success-600 text-lg"></i>
                </NuxtLink>

                <!-- Become a Seller -->
                <NuxtLink 
                  to="/person/seller" 
                  class="mobile-menu-item d-flex align-items-center gap-16 px-20 py-16 text-gray-800 hover-bg-gray-50 hover-text-main-600 transition-2 rounded-8 mb-8"
                  :class="{ 'active-mobile': activeLink === 'seller' }"
                  @click="closeMobileMenu"
                >
                  <div class="menu-icon-container bg-purple-50 text-purple-600 w-40 h-40 rounded-circle d-flex align-items-center justify-content-center">
                    <i class="ph ph-user-circle text-lg"></i>
                  </div>
                  <div class="flex-grow-1">
                    <span class="fw-semibold text-sm d-block">Become a Seller</span>
                    <span class="text-xs text-gray-500">Start Selling</span>
                  </div>
                  <i v-if="activeLink === 'seller'" class="ph ph-check-circle text-success-600 text-lg"></i>
                </NuxtLink>

                <!-- Blog -->
                <NuxtLink 
                  to="/person/blog" 
                  class="mobile-menu-item d-flex align-items-center gap-16 px-20 py-16 text-gray-800 hover-bg-gray-50 hover-text-main-600 transition-2 rounded-8 mb-8"
                  :class="{ 'active-mobile': activeLink === 'blog' }"
                  @click="closeMobileMenu"
                >
                  <div class="menu-icon-container bg-green-50 text-green-600 w-40 h-40 rounded-circle d-flex align-items-center justify-content-center">
                    <i class="ph ph-article text-lg"></i>
                  </div>
                  <div class="flex-grow-1">
                    <span class="fw-semibold text-sm d-block">Blog</span>
                    <span class="text-xs text-gray-500">Latest Articles</span>
                  </div>
                  <i v-if="activeLink === 'blog'" class="ph ph-check-circle text-success-600 text-lg"></i>
                </NuxtLink>

                <!-- Contact Us -->
                <NuxtLink 
                  to="/person/contact" 
                  class="mobile-menu-item d-flex align-items-center gap-16 px-20 py-16 text-gray-800 hover-bg-gray-50 hover-text-main-600 transition-2 rounded-8 mb-8"
                  :class="{ 'active-mobile': activeLink === 'contact' }"
                  @click="closeMobileMenu"
                >
                  <div class="menu-icon-container bg-blue-50 text-blue-600 w-40 h-40 rounded-circle d-flex align-items-center justify-content-center">
                    <i class="ph ph-phone text-lg"></i>
                  </div>
                  <div class="flex-grow-1">
                    <span class="fw-semibold text-sm d-block">Contact Us</span>
                    <span class="text-xs text-gray-500">Get in Touch</span>
                  </div>
                  <i v-if="activeLink === 'contact'" class="ph ph-check-circle text-success-600 text-lg"></i>
                </NuxtLink>

                <!-- Divider -->
                <div class="border-top border-gray-200 my-16"></div>

                <!-- Phone Number in Mobile Menu -->
                <div class="px-20 py-12">
                  <div class="d-flex align-items-center gap-12 mb-8">
                    <i class="ph ph-info text-lg text-gray-500"></i>
                    <span class="text-xs text-gray-500">Need immediate assistance?</span>
                  </div>
                  <a 
                    href="tel:+(2)871382023" 
                    class="mobile-phone-btn d-flex align-items-center justify-content-center gap-12 px-16 py-12 bg-main-600 text-white rounded-8 hover-bg-main-700 transition-2 fw-semibold"
                    @click.prevent="callPhone"
                  >
                    <i class="ph ph-phone-call text-lg"></i>
                    <span>Call Now: +(2) 871 382 023</span>
                  </a>
                </div>
              </div>
              
              <!-- Dropdown Footer -->
              <div class="border-top border-gray-200 px-20 py-12 bg-gray-50">
                <div class="text-center">
                  <span class="text-xs text-gray-500">© 2024 KartMania. All rights reserved.</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 🔴 MOBILE MENU DROPDOWN END -->
        </div>
        <!-- Header Right End  -->
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()

// Reactive state
const showDropdown = ref(false)
const showMobileMenu = ref(false)
const activeLink = ref('')
const categories = ref([
  { id: 1, name: 'Vegetables', path: '/shop/vegetables', image: '/assets/images/icon/category-1.png' },
  { id: 2, name: 'Milk & Cake', path: '/shop/milk-cake', image: '/assets/images/icon/category-2.png' },
  { id: 3, name: 'Grocery', path: '/shop/grocery', image: '/assets/images/icon/category-3.png' },
  { id: 4, name: 'Beauty', path: '/shop/beauty', image: '/assets/images/icon/category-4.png' },
  { id: 5, name: 'Wines & Drinks', path: '/shop/wines-drinks', image: '/assets/images/icon/category-5.png' },
  { id: 6, name: 'Snacks', path: '/shop/snacks', image: '/assets/images/icon/category-6.png' },
  { id: 7, name: 'Juice', path: '/shop/juice', image: '/assets/images/icon/category-7.png' },
  { id: 8, name: 'Fruits', path: '/shop/fruits', image: '/assets/images/icon/category-8.png' },
  { id: 9, name: 'Tea & Coffee', path: '/shop/tea-coffee', image: '/assets/images/icon/category-9.png' }
])

// Set active link based on current route
const setActiveLink = (link) => {
  activeLink.value = link
}

// Toggle category dropdown
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  if (showMobileMenu.value) {
    showMobileMenu.value = false
  }
}

// Close dropdown
const closeDropdown = () => {
  showDropdown.value = false
}

// Toggle mobile menu
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  if (showDropdown.value) {
    showDropdown.value = false
  }
}

// Close mobile menu
const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// Handle phone call
const callPhone = () => {
  const phoneNumber = '+(2)871382023'
  if (confirm(`Call ${phoneNumber}?`)) {
    window.location.href = `tel:${phoneNumber.replace(/\D/g, '')}`
  }
  closeMobileMenu()
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.category-dropdown')
  const dropdownButton = document.querySelector('.category-button')
  const mobileMenu = document.querySelector('.mobile-menu-dropdown')
  const mobileMenuButton = document.querySelector('.toggle-mobileMenu')
  
  // Check for category dropdown
  if (dropdown && dropdownButton && 
      !dropdown.contains(event.target) && 
      !dropdownButton.contains(event.target)) {
    showDropdown.value = false
  }
  
  // Check for mobile menu dropdown
  if (mobileMenu && mobileMenuButton && 
      !mobileMenu.contains(event.target) && 
      !mobileMenuButton.contains(event.target)) {
    showMobileMenu.value = false
  }
}

// Update active link when route changes
watch(() => route.path, (newPath) => {
  if (newPath === '/') {
    activeLink.value = 'home'
  } else if (newPath.includes('/product') || newPath.includes('/shop')) {
    activeLink.value = 'shop'
  } else if (newPath === '/person/seller') {
    activeLink.value = 'seller'
  } else if (newPath === '/person/blog') {
    activeLink.value = 'blog'
  } else if (newPath === '/person/contact') {
    activeLink.value = 'contact'
  } else {
    activeLink.value = ''
  }
  
  closeMobileMenu()
})

// Set initial active link
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // Initialize active link based on current route
  if (route.path === '/') {
    activeLink.value = 'home'
  } else if (route.path.includes('/product') || route.path.includes('/shop')) {
    activeLink.value = 'shop'
  } else if (route.path === '/person/seller') {
    activeLink.value = 'seller'
  } else if (route.path === '/person/blog') {
    activeLink.value = 'blog'
  } else if (route.path === '/person/contact') {
    activeLink.value = 'contact'
  }
})

// Cleanup event listener
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 🔴 HIGH Z-INDEX FOR DROPDOWNS */
.category-dropdown {
  z-index: 9999 !important;
}

.mobile-menu-dropdown {
  z-index: 99999 !important; /* Even higher than category dropdown */
}

/* Mobile Menu Dropdown Animation */
.mobile-menu-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(-20px) scale(0.95);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.mobile-menu-dropdown[v-if="showMobileMenu"] {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

/* Mobile Menu Item Styling */
.mobile-menu-item {
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.mobile-menu-item:hover {
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #e5e7eb;
}

.mobile-menu-item.active-mobile {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%) !important;
  border-color: #fca5a5 !important;
  color: #dc2626 !important;
  font-weight: 600 !important;
}

/* Menu Icon Container */
.menu-icon-container {
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.mobile-menu-item:hover .menu-icon-container {
  transform: scale(1.1);
}

/* Active Link Styling - RED */
.nav-menu__link.active-red {
  color: #dc2626 !important;
  font-weight: 600 !important;
  position: relative;
}

.nav-menu__link.active-red::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #dc2626 0%, #ef4444 100%);
  border-radius: 3px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Category Dropdown Animation */
.category-dropdown {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease-in-out;
}

.category-dropdown[v-show="true"] {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* Mobile Phone Button */
.mobile-phone-btn {
  text-decoration: none;
  transition: all 0.3s ease;
}

.mobile-phone-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(79, 70, 229, 0.3);
}

/* Close Button for Mobile Menu */
.btn-close-mobile {
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-close-mobile:hover {
  background: white !important;
  transform: rotate(90deg);
}

/* Mobile Menu Toggle Button */
.toggle-mobileMenu {
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.toggle-mobileMenu:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Scrollbar Styling for Mobile Menu */
.mobile-menu-dropdown .max-h-400 {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
}

.mobile-menu-dropdown .max-h-400::-webkit-scrollbar {
  width: 6px;
}

.mobile-menu-dropdown .max-h-400::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.mobile-menu-dropdown .max-h-400::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.mobile-menu-dropdown .max-h-400::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Menu Category Wrapper */
.menu-category-wrapper {
  overflow: visible !important;
}

/* Navigation Menu Styles */
.nav-menu {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 32px;
  margin-left: 32px;
}

.nav-menu__item {
  position: relative;
}

.nav-menu__link {
  display: block;
  padding: 8px 0;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-menu__link:hover {
  color: #dc2626;
  transform: translateY(-2px);
}

/* 🔴 RESPONSIVE DESIGN */
@media (max-width: 991px) {
  .header-menu {
    display: none !important;
  }
  
  .toggle-mobileMenu {
    display: flex !important;
  }
  
  /* Hide phone number on mobile */
  .d-sm-flex.d-none {
    display: none !important;
  }
  
  /* Adjust mobile menu position for small screens */
  .mobile-menu-dropdown {
    inset-inline-end: -12px;
    min-width: 320px !important;
    max-width: 90vw;
  }
}

@media (min-width: 992px) {
  .toggle-mobileMenu {
    display: none !important;
  }
  
  .mobile-menu-dropdown {
    display: none !important;
  }
}

/* 🔴 FIX FOR IOS SAFARI */
@supports (-webkit-touch-callout: none) {
  .mobile-menu-dropdown {
    -webkit-overflow-scrolling: touch;
  }
}
</style>