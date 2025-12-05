<script setup lang="ts">
import type { Movie } from '~/types/movie'
const { t } = useTranslations()

useHead({
  title: 'My Watchlist - LazyPick',
  meta: [
    { name: 'description', content: 'Your saved movies and shows to watch later.' }
  ]
})

const watchlist = ref<Movie[]>([])

onMounted(() => {
  const saved = localStorage.getItem('lazypick_watchlist')
  if (saved) {
    watchlist.value = JSON.parse(saved)
  }
})

const removeFromWatchlist = (id: number | string) => {
  watchlist.value = watchlist.value.filter(m => m.id !== id)
  localStorage.setItem('lazypick_watchlist', JSON.stringify(watchlist.value))
}

const openMovie = (url: string) => {
  if (url) window.open(url, '_blank')
}
</script>

<template>
  <div class="min-h-screen bg-brand-dark text-white p-6 relative overflow-x-hidden">
    
    <!-- Background -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/10 blur-[100px] rounded-full pointer-events-none"/>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none"/>

    <!-- Header -->
    <div class="max-w-6xl mx-auto mb-12 flex items-center justify-between relative z-10">
      <div class="flex items-center gap-4">
        <NuxtLink to="/" class="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <Icon name="heroicons:arrow-left" class="w-6 h-6"/>
        </NuxtLink>
        <h1 class="text-3xl font-black font-display tracking-tight">{{ t('watchlist.title') || 'My Watchlist' }}</h1>
      </div>
    </div>

    <!-- Grid -->
    <div v-if="watchlist.length > 0" class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
      <div v-for="movie in watchlist" :key="movie.id" class="group relative aspect-[2/3] rounded-2xl overflow-hidden bg-white/5 border border-white/10 transition-transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-red/10">
        
        <img :src="movie.poster" :alt="movie.title" class="w-full h-full object-cover">
        
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
          
          <h3 class="font-bold text-lg leading-tight mb-1">{{ movie.title }}</h3>
          <div class="flex items-center gap-2 text-xs text-gray-300 mb-4">
            <span>{{ movie.year }}</span>
            <span>•</span>
            <span class="flex items-center gap-1"><Icon name="heroicons:star-solid" class="text-yellow-400 w-3 h-3"/> {{ typeof movie.rating === 'number' ? movie.rating.toFixed(1) : movie.rating }}</span>
          </div>

          <div class="flex gap-2">
            <button class="flex-1 bg-white text-black py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2" @click="openMovie(movie.watchUrl || movie.netflixUrl || '')">
              <Icon :name="movie.provider?.name === 'Spotify' ? 'heroicons:play-solid' : 'heroicons:play'" class="w-4 h-4"/>
              {{ movie.provider?.name === 'Spotify' ? 'Listen' : t('watchlist.watch_now') }}
            </button>
            <button class="p-2 bg-white/10 rounded-lg hover:bg-red-500/20 hover:text-red-500 transition-colors" @click="removeFromWatchlist(movie.id!)">
              <Icon name="heroicons:trash" class="w-5 h-5"/>
            </button>
          </div>

        </div>

        <!-- Provider Badge (Top Right) -->
        <div v-if="movie.provider" class="absolute top-3 right-3 bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-lg">
          <img v-if="movie.provider.logo && !movie.provider.logo.includes('spotify')" :src="movie.provider.logo" class="w-5 h-5 rounded-full" :alt="movie.provider.name">
          <Icon v-else-if="movie.provider.name === 'Spotify'" name="mdi:spotify" class="w-5 h-5 text-green-500"/>
        </div>

      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="min-h-[50vh] flex flex-col items-center justify-center text-center relative z-10">
      <div class="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <Icon name="heroicons:bookmark" class="w-10 h-10 text-gray-600"/>
      </div>
      <h2 class="text-2xl font-bold font-display mb-2">{{ t('watchlist.empty_title') || 'Your list is empty' }}</h2>
      <p class="text-gray-400 mb-8 max-w-md">{{ t('watchlist.empty_subtitle') || 'Start swiping to find movies or music you want to save.' }}</p>
      <NuxtLink to="/" class="bg-brand-red text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-brand-red/20">
        {{ t('home.start_deciding') }}
      </NuxtLink>
    </div>

  </div>
</template>
