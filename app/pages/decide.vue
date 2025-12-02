<script setup lang="ts">
// Explicit import for stability
import MovieCard from '~/components/modules/MovieCard.vue'

const route = useRoute()
// Get mode from URL, default to 'movie' if missing
const mode = computed(() => (route.query.mode as string) || 'movie')

const data = ref(null)
const loading = ref(true)
const error = ref(null)

// Computed text for the UI based on mode
const pageTitle = computed(() => mode.value === 'movie' ? 'Find a Movie' : 'Find Food')
const subTitle = computed(() => mode.value === 'movie' ? 'Searching Netflix GH...' : 'Searching Accra Spots...')

const spin = async () => {
  loading.value = true
  error.value = null
  data.value = null // Clear old data for visual feedback

  try {
    // Choose API based on query param
    const endpoint = mode.value === 'movie' ? '/api/movies/random' : '/api/food/random'
    const response = await $fetch(endpoint)
    data.value = response
  } catch (err) {
    console.error(err)
    error.value = "Oops! Nothing found. Try again."
  } finally {
    loading.value = false
  }
}

// Initial Spin
onMounted(() => {
  spin()
})
</script>

<template>
  <div class="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4 relative">

    <div class="absolute top-6 left-0 w-full px-6 flex justify-between items-center z-50">
      <NuxtLink to="/" class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <Icon name="heroicons:arrow-left"/>
        <span class="text-sm font-bold">Menu</span>
      </NuxtLink>

      <div
          class="text-xs font-bold px-3 py-1 rounded-full border border-white/10 text-gray-500 uppercase tracking-wider">
        {{ mode }} Mode
      </div>
    </div>

    <div class="w-full max-w-sm flex flex-col items-center gap-6">

      <div class="text-center">
        <h1 class="text-white font-black text-3xl tracking-tight mb-1">{{ pageTitle }}</h1>
        <p class="text-gray-500 text-sm animate-pulse" v-if="loading">{{ subTitle }}</p>
        <p class="text-brand-red text-sm" v-else>Ready!</p>
      </div>

      <div v-if="error"
           class="w-full bg-red-900/20 text-red-200 px-4 py-3 rounded-xl text-sm border border-red-900/50 text-center">
        {{ error }}
        <button class="block w-full mt-2 font-bold underline" @click="spin">Retry</button>
      </div>

      <MovieCard
          v-if="data || loading"
          :movie="data"
          :loading="loading"
          :mode="mode"
          @spin="spin"
      />

    </div>

  </div>
</template>