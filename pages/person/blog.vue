<template>
  <section class="blog py-80">
    <div class="container container-lg">
      <div class="row gy-5">
        <!-- Main Content Area -->
        <div class="col-lg-8 pe-xl-4">
          <!-- Blog Items -->
          <div class="blog-item-wrapper">
            <div 
              v-for="(post, index) in blogPosts" 
              :key="post.id"
              class="blog-item"
              :class="{ 'mb-40': index < blogPosts.length - 1 }"
            >
              <NuxtLink :to="`/blog/${post.slug}`" class="w-100 h-100 rounded-16 overflow-hidden block">
                <img 
                  :src="post.image" 
                  :alt="post.title" 
                  class="cover-img w-100"
                />
              </NuxtLink>
              <div class="blog-item__content mt-24">
                <span class="bg-main-50 text-main-600 py-4 px-24 rounded-8 mb-16 inline-block">
                  {{ post.category }}
                </span>
                <h6 class="text-2xl mb-24">
                  <NuxtLink :to="`/blog/${post.slug}`" class="text-neutral-900 hover-text-main-600">
                    {{ post.title }}
                  </NuxtLink>
                </h6>
                <p class="text-gray-700 text-line-2">{{ post.excerpt }}</p>

                <div class="flex-align flex-wrap gap-24 pt-24 mt-24 border-top border-gray-100">
                  <div class="flex-align flex-wrap gap-8">
                    <span class="text-lg text-main-600"><i class="ph ph-calendar-dots"></i></span>
                    <span class="text-sm text-gray-500">
                      <NuxtLink :to="`/blog/${post.slug}`" class="text-gray-500 hover-text-main-600">
                        {{ post.date }}
                      </NuxtLink>
                    </span>
                  </div>
                  <div class="flex-align flex-wrap gap-8">
                    <span class="text-lg text-main-600"><i class="ph ph-chats-circle"></i></span>
                    <span class="text-sm text-gray-500">
                      <NuxtLink :to="`/blog/${post.slug}`" class="text-gray-500 hover-text-main-600">
                        {{ post.comments }} Comments
                      </NuxtLink>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <ul class="pagination flex-align flex-wrap gap-16 mt-40">
            <li class="page-item">
              <button 
                class="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100 hover-border-main-600 hover-bg-main-50"
                :disabled="currentPage === 1"
                @click="handlePageChange(currentPage - 1)"
              >
                <i class="ph-bold ph-arrow-left"></i>
              </button>
            </li>
            <li 
              v-for="page in visiblePages" 
              :key="page"
              class="page-item"
              :class="{ active: page === currentPage }"
            >
              <button 
                class="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100 hover-border-main-600 hover-bg-main-50"
                :class="{ 'bg-main-600 text-white border-main-600': page === currentPage }"
                @click="handlePageChange(page)"
              >
                {{ page.toString().padStart(2, '0') }}
              </button>
            </li>
            <li class="page-item">
              <button 
                class="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100 hover-border-main-600 hover-bg-main-50"
                :disabled="currentPage === totalPages"
                @click="handlePageChange(currentPage + 1)"
              >
                <i class="ph-bold ph-arrow-right"></i>
              </button>
            </li>
          </ul>
        </div>

        <!-- Sidebar -->
        <div class="col-lg-4 ps-xl-4">
          <!-- Search Widget -->
          <div class="blog-sidebar border border-gray-100 rounded-8 p-32 mb-40">
            <h6 class="text-xl mb-32 pb-32 border-bottom border-gray-100">Search Here</h6>
            <form @submit.prevent="handleSearch">
              <div class="input-group">
                <input 
                  type="text" 
                  class="form-control common-input bg-color-three" 
                  placeholder="Searching..."
                  v-model="searchQuery"
                >
                <button type="submit" class="btn btn-main text-2xl h-56 w-56 flex-center text-2xl input-group-text">
                  <i class="ph ph-magnifying-glass"></i>
                </button>
              </div>
            </form>
          </div>
          
          <!-- Recent Posts Widget -->
          <div class="blog-sidebar border border-gray-100 rounded-8 p-32 mb-40">
            <h6 class="text-xl mb-32 pb-32 border-bottom border-gray-100">Recent Posts</h6>
            <div 
              v-for="(post, index) in recentPosts" 
              :key="post.id"
              class="d-flex align-items-center flex-sm-nowrap flex-wrap gap-24 mb-16"
              :class="{ 'mb-0': index === recentPosts.length - 1 }"
            >
              <NuxtLink :to="`/blog/${post.slug}`" class="w-100 h-100 rounded-4 overflow-hidden w-120 h-120 flex-shrink-0 block">
                <img 
                  :src="post.image" 
                  :alt="post.title" 
                  class="cover-img"
                />
              </NuxtLink>
              <div class="flex-grow-1">
                <h6 class="text-lg">
                  <NuxtLink :to="`/blog/${post.slug}`" class="text-line-3 text-neutral-900 hover-text-main-600">
                    {{ post.title }}
                  </NuxtLink>
                </h6>
                <div class="flex-align flex-wrap gap-8">
                  <span class="text-lg text-main-600"><i class="ph ph-calendar-dots"></i></span>
                  <span class="text-sm text-gray-500">
                    <NuxtLink :to="`/blog/${post.slug}`" class="text-gray-500 hover-text-main-600">
                      {{ post.date }}
                    </NuxtLink>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Categories Widget -->
          <div class="blog-sidebar border border-gray-100 rounded-8 p-32 mb-40">
            <h6 class="text-xl mb-32 pb-32 border-bottom border-gray-100">Categories</h6>
            <ul>
              <li 
                v-for="(category, index) in categories" 
                :key="category.slug"
                class="mb-16"
                :class="{ 'mb-0': index === categories.length - 1 }"
              >
                <NuxtLink 
                  :to="`/blog/category/${category.slug}`"
                  class="flex-between gap-8 text-gray-700 border border-gray-100 rounded-4 p-4 ps-16 hover-border-main-600 hover-text-main-600"
                >
                  <span>{{ category.name }} ({{ category.count }})</span>
                  <span class="w-40 h-40 flex-center rounded-4 bg-main-50 text-main-600">
                    <i class="ph ph-arrow-right"></i>
                  </span>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
    <CartShop/>

</template>

<script setup>
import { ref, computed } from 'vue'
import CartShop from '~/components/cartShop.vue'

// Nuxt 3 public folder se images access - direct path use karenge
const publicBasePath = '/'

// Reactive state
const currentPage = ref(1)
const totalPages = ref(7)
const searchQuery = ref('')

// Blog posts data - public/assets/images se images
const blogPosts = ref([
  {
    id: 1,
    title: 'Legal structure, can make profit business',
    excerpt: 'Re-engagement — objectives. As developers, we rightfully obsess about the customer experience, relentlessly working to squeeze every millisecond out of the critical rendering path, optimize input latency, and eliminate...',
    image: `${publicBasePath}assets/images/thumbs/blog-img1.png`,
    category: 'Gadget',
    date: 'July 12, 2025',
    comments: 0,
    slug: 'legal-structure-can-make-profit-business'
  },
  {
    id: 2,
    title: 'Legal structure, can make profit business',
    excerpt: 'Re-engagement — objectives. As developers, we rightfully obsess about the customer experience, relentlessly working to squeeze every millisecond out of the critical rendering path, optimize input latency, and eliminate...',
    image: `${publicBasePath}assets/images/thumbs/blog-img2.png`,
    category: 'Gadget',
    date: 'July 12, 2025',
    comments: 0,
    slug: 'legal-structure-can-make-profit-business-2'
  },
  {
    id: 3,
    title: 'Legal structure, can make profit business',
    excerpt: 'Re-engagement — objectives. As developers, we rightfully obsess about the customer experience, relentlessly working to squeeze every millisecond out of the critical rendering path, optimize input latency, and eliminate...',
    image: `${publicBasePath}assets/images/thumbs/blog-img3.png`,
    category: 'Gadget',
    date: 'July 12, 2025',
    comments: 0,
    slug: 'legal-structure-can-make-profit-business-3'
  }
])

// Recent posts data
const recentPosts = ref([
  {
    id: 1,
    title: 'Once determined you need to come up with a name',
    image: `${publicBasePath}assets/images/thumbs/recent-post1.png`,
    date: 'July 12, 2025',
    slug: 'once-determined-you-need-to-come-up-with-a-name'
  },
  {
    id: 2,
    title: 'Once determined you need to come up with a name',
    image: `${publicBasePath}assets/images/thumbs/recent-post2.png`,
    date: 'July 12, 2025',
    slug: 'once-determined-you-need-to-come-up-with-a-name-2'
  },
  {
    id: 3,
    title: 'Once determined you need to come up with a name',
    image: `${publicBasePath}assets/images/thumbs/recent-post3.png`,
    date: 'July 12, 2025',
    slug: 'once-determined-you-need-to-come-up-with-a-name-3'
  },
  {
    id: 4,
    title: 'Once determined you need to come up with a name',
    image: `${publicBasePath}assets/images/thumbs/recent-post4.png`,
    date: 'July 12, 2025',
    slug: 'once-determined-you-need-to-come-up-with-a-name-4'
  }
])

// Categories data
const categories = ref([
  { name: 'Gaming', count: 12, slug: 'gaming' },
  { name: 'Smart Gadget', count: 5, slug: 'smart-gadget' },
  { name: 'Software', count: 29, slug: 'software' },
  { name: 'Electronics', count: 24, slug: 'electronics' },
  { name: 'Laptop', count: 8, slug: 'laptop' },
  { name: 'Mobile & Accessories', count: 16, slug: 'mobile-accessories' },
  { name: 'Appliance', count: 24, slug: 'appliance' }
])

// Computed properties
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 7
  
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // Fetch new page data here (API call, etc.)
    console.log('Page changed to:', page)
    // Example: fetchBlogPosts(page)
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Perform search here
    console.log('Search query:', searchQuery.value.trim())
    // Example: searchBlogPosts(searchQuery.value)
  }
}

// Agar API se data fetch karna hai, toh useAsyncData use karenge
// const { data: blogPosts } = await useAsyncData('blogPosts', () => 
//   $fetch('/api/blog-posts')
// )
</script>

<style scoped>
/* Optional additional styles */
.cover-img {
  object-fit: cover;
  height: 100%;
}

.blog-item {
  transition: all 0.3s ease;
}

.blog-item:hover {
  transform: translateY(-5px);
}

.page-link {
  transition: all 0.3s ease;
  cursor: pointer;
}

.page-link:hover:not(:disabled) {
  border-color: var(--main-600);
  background-color: var(--main-50);
}

.page-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>