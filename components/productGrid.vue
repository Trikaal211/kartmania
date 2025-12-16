<template>
  <div class="product-grid">
    <div 
      v-for="product in products" 
      :key="product.id"
      class="product-item"
      @click="$router.push(`/product/${product.id}`)"
    >
      <div class="product-image-container">
        <img 
          :src="getPrimaryImage(product.images)" 
          :alt="product.name"
          class="product-image"
          @error="handleImageError"
        />
        <div v-if="product.discount && product.discountValue" class="discount-badge">
          {{ product.discount === 'PERCENTAGE' ? `${product.discountValue}% OFF` : 'SALE' }}
        </div>
      </div>
           
      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-category">{{ product.category.name }} • {{ product.subCategory.name }}</p>
        
        <div class="price-section">
          <span class="current-price">₹{{ calculateDiscountedPrice(product) }}</span>
          <span v-if="product.discount && product.discountValue" class="original-price">
            ₹{{ product.price }}
          </span>
        </div>
        
        <div class="product-meta">
          <span class="stock" :class="{ 'low-stock': product.stock <= product.quantityAlertThreshold }">
            {{ product.stock }} in stock
          </span>
          <span class="sku">{{ product.sku }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductGrid',
  props: {
    products: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  methods: {
    getPrimaryImage(images) {
      if (!images || images.length === 0) {
        return '/images/placeholder.jpg'
      }
      const primary = images.find(img => img.isPrimary)
      return primary ? primary.imageUrl : images[0].imageUrl
    },
    
    handleImageError(event) {
      event.target.src = '/images/placeholder.jpg'
    },
    
    calculateDiscountedPrice(product) {
      if (product.discount === 'PERCENTAGE' && product.discountValue) {
        const discountAmount = (product.price * product.discountValue) / 100
        return (product.price - discountAmount).toFixed(2)
      }
      return product.price
    }
  }
}
</script>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.product-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-item:hover .product-image {
  transform: scale(1.05);
}

.discount-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #e74c3c;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.product-info {
  padding: 20px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-category {
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 12px;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #e74c3c;
}

.original-price {
  font-size: 14px;
  color: #95a5a6;
  text-decoration: line-through;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.stock {
  color: #27ae60;
  font-weight: 500;
}

.low-stock {
  color: #e74c3c;
}

.sku {
  color: #95a5a6;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .product-image-container {
    height: 200px;
  }
}
</style>