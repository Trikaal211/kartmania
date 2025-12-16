<script setup>
import { ref, watch } from 'vue'
import { onMounted } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import { useCommentsStore } from '@/store/comment'
import Nuxt from './nuxt.vue'

const store = useCommentsStore()
const route = useRoute()
const router = useRouter()
const count = ref([])

// URL se page read karna (if exists)
store.page = Number(route.query.page) || 1

store.fetchComments()
// watch(
//   () => route.query.page,
//   (newPage) => {
//     store.page = Number(newPage) || 1
//     store.updatePage()
//     console.log("change")
//   }
// )
// const fetchAllProducts = async () => {
//   try {
//     console.log('Trying fallback API...')
//     const res = await fetch('https://kartmania-api.vibrantick.org/common/color/read')
//     const data = await res.json()
//     console.log(data.colors)
//     count.value = data.colors   //
//     console.log(data)

//   } catch (err) {
//     console.error('Error in fallback:', err)
//     error.value = 'Unable to load product data'
//   }
// }
function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')  // camelCase → camel-case
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
console.log(toKebabCase("Hey how Are you"))

const fetchAllProducts = async ()=>{
  try{
    const res = await fetch('https://kartmania-api.vibrantick.org/common/color/read')
    const data = await res.json()
    count.value = data.colors
  }catch(err){
    console.log('error',err)
  }
}
function shop() {
  router.push('/product/shopall?colors=Black')
}
onMounted(() => {
  fetchAllProducts()
})
watch(
  () => route.query.page,
  (newPage) => {
    store.page = Number(newPage) || 1
    store.updatePage()
  }
)

</script>

<template>
  <p v-if="store.loading">Loading...</p>

  <ul v-else>
    <li v-for="c in store.comments" :key="c.id">
      {{ c.email }} — {{ c.name }}

    </li>
    <li @click="shop()" v-for="p in count" :key="p">
      {{ p }}
      {{ console.log(p) }}
    </li>
  </ul>

  <div class="buttons">
    <button @click="store.prevPage(router)">Previous</button>
    <span> Page: {{ store.page }} </span>
    <button @click="store.nextPage(router)">Next</button>
  </div>

  <p>Total comments: {{ store.allComments.length - store.page * store.limit }}</p>
</template>
