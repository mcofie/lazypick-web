<script setup lang="ts">
import {useDraggable} from '@vueuse/core'
import type { Movie } from '~/types/movie'

const props = defineProps<{
  movie: Movie | null;
  loading: boolean;
  mode: string;
  hideActions?: boolean;
}>();

const emit = defineEmits(['choice']);

// Card Reference
const card = ref<HTMLElement | null>(null)

// Draggable Logic
const {x, y, isDragging} = useDraggable(card, {
  disabled: computed(() => props.loading || !props.movie),
  onEnd: () => handleRelease()
})

// Dynamic Styles
const cardStyle = computed(() => {
  if (props.loading) return {}
  const rotate = x.value / 10
  const transition = isDragging.value ? 'none' : 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'

  return {
    transform: `translate(${x.value}px, ${y.value}px) rotate(${rotate}deg)`,
    transition: transition,
    cursor: isDragging.value ? 'grabbing' : 'grab'
  }
})

// Handle Release
const handleRelease = () => {
  const threshold = 100

  if (x.value > threshold) {
    emit('choice', true) // Like
    resetCard()
  } else if (x.value < -threshold) {
    emit('choice', false) // Pass
    resetCard()
  } else {
    resetCard()
  }
}



const resetCard = () => {
  x.value = 0
  y.value = 0
}

// Watchlist Logic
const isSaved = ref(false)

onMounted(() => {
  checkIfSaved()
})

// Image Error Handling
const imageError = ref(false)

watch(() => props.movie, () => {
  checkIfSaved()
  imageError.value = false
})

const checkIfSaved = () => {
  if (!props.movie) return
  const saved = localStorage.getItem('lazypick_watchlist')
  if (saved) {
    const list = JSON.parse(saved)
    isSaved.value = list.some((m: Movie) => m.id === props.movie?.id)
  } else {
    isSaved.value = false
  }
}

const toggleSave = () => {
  if (!props.movie) return
  
  const saved = localStorage.getItem('lazypick_watchlist')
  let list = saved ? JSON.parse(saved) : []

  if (isSaved.value) {
    list = list.filter((m: Movie) => m.id !== props.movie?.id)
    isSaved.value = false
  } else {
    list.push(props.movie)
    isSaved.value = true
  }

  localStorage.setItem('lazypick_watchlist', JSON.stringify(list))
}
</script>

<template>
  <div class="relative w-full max-w-sm h-[540px] flex items-center justify-center perspective-1000">

    <div
        ref="card"
        :style="cardStyle"
        class="absolute w-full h-full bg-brand-surface rounded-[2rem] overflow-hidden shadow-2xl z-20 touch-none select-none border border-white/5"
    >

      <div v-if="loading" class="absolute inset-0 bg-brand-surface animate-pulse flex items-center justify-center z-30">
        <div class="flex flex-col items-center gap-4">
          <Icon
name="svg-spinners:ring-resize" size="3em"
                :class="mode === 'food' ? 'text-yellow-500' : (mode === 'music' || mode === 'spotify') ? 'text-purple-500' : 'text-brand-red'"/>
          <p class="text-xs font-bold uppercase tracking-widest text-gray-500">Finding the best...</p>
        </div>
      </div>

      <div v-else-if="movie" class="relative h-full w-full pointer-events-none group">
        <!-- Image with Fallback -->
        <img
            v-if="!imageError"
            :src="movie.poster" 
            :alt="movie.title" 
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            draggable="false"
            @error="imageError = true"
        >
        <div v-else class="absolute inset-0 w-full h-full bg-gray-900 flex flex-col items-center justify-center gap-4">
          <Icon :name="(mode === 'music' || mode === 'spotify') ? 'ph:music-notes-simple-duotone' : 'ph:film-strip-duotone'" size="4em" class="text-gray-700"/>
          <span class="text-gray-600 text-xs font-bold uppercase tracking-widest">No Image</span>
        </div>

        <div class="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent"/>

        <!-- Music Vinyl Effect -->
        <div v-if="mode === 'music' || mode === 'spotify'" class="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full border-4 border-gray-900 shadow-2xl animate-spin-slow opacity-80 mix-blend-overlay">
          <div class="absolute inset-0 rounded-full border-[20px] border-black/20"></div>
          <div class="absolute inset-0 rounded-full border-[40px] border-black/10"></div>
          <!-- Center Label Color -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full" :class="movie.provider?.name === 'Apple Music' ? 'bg-pink-500' : 'bg-green-500'"></div>
        </div>

        <div class="absolute bottom-0 left-0 w-full p-8 text-white pb-28">
          <div class="flex items-center gap-3 mb-3 opacity-90 text-[10px] font-bold tracking-[0.2em] uppercase">

            <div v-if="mode === 'movie'" class="flex items-center gap-2 bg-black/40 backdrop-blur-md pl-1 pr-3 py-1 rounded-full border border-white/10 shadow-lg">
              <img v-if="movie.provider?.logo" :src="movie.provider.logo" class="w-4 h-4 rounded-full" alt="Provider">
              <span class="text-white/90">{{ movie.provider?.name || 'Watch Now' }}</span>
            </div>
            <div v-else-if="mode === 'music' || mode === 'spotify'" class="flex items-center gap-2 backdrop-blur-sm pl-1 pr-3 py-1 rounded-full shadow-lg" :class="movie.provider?.name === 'Apple Music' ? 'bg-pink-500/90 shadow-pink-500/20' : 'bg-green-500/90 shadow-green-500/20'">
              <Icon :name="movie.overview?.includes('Playlist') ? 'heroicons:queue-list' : movie.overview?.includes('Album') ? 'heroicons:musical-note' : (movie.provider?.name === 'Apple Music' ? 'simple-icons:applemusic' : 'mdi:spotify')" class="w-4 h-4 text-white"/>
              <span class="text-white">{{ movie.overview?.split(' • ')[0] || 'Listen Now' }}</span>
            </div>
            <span v-else class="bg-yellow-600/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg shadow-yellow-600/20">Food Spot</span>

            <span class="flex items-center gap-1"><Icon name="heroicons:star-solid" :class="(mode === 'music' || mode === 'spotify') ? (movie.provider?.name === 'Apple Music' ? 'text-pink-400' : 'text-green-400') : 'text-yellow-400'"/> {{ movie.rating?.toFixed(1) }}</span>
            <span class="text-gray-400">• {{ movie.year }}</span>
          </div>
          <h2 class="text-4xl font-black leading-[0.95] mb-3 drop-shadow-xl font-display tracking-tight">{{ movie.title }}</h2>
          <p class="text-sm text-gray-300 line-clamp-3 leading-relaxed drop-shadow-md font-light">
            {{ movie.description || movie.overview }}
          </p>
        </div>

        <div
v-if="x > 50"
             class="absolute top-10 left-10 border-4 border-green-500 text-green-500 font-black text-5xl px-6 py-2 rounded-xl -rotate-12 opacity-0 animate-fade-in"
             :style="{ opacity: Math.min(x / 100, 1) }">
          YES
        </div>
        <div
v-if="x < -50"
             class="absolute top-10 right-10 border-4 border-red-500 text-red-500 font-black text-5xl px-6 py-2 rounded-xl rotate-12 opacity-0 animate-fade-in"
             :style="{ opacity: Math.min(Math.abs(x) / 100, 1) }">
          NO
        </div>
      </div>

      <!-- Swipe Hints -->
      <div v-if="!isDragging && !loading && movie" class="absolute inset-0 flex items-center justify-between px-4 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div class="flex flex-col items-center gap-2 animate-pulse">
          <div class="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center border border-white/10">
            <Icon name="heroicons:x-mark" class="w-5 h-5 text-white/70"/>
          </div>
          <span class="text-[10px] uppercase tracking-widest text-white/50 font-bold drop-shadow-md">Pass</span>
        </div>
        
        <div class="flex flex-col items-center gap-2 animate-pulse">
          <div class="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center border border-white/10">
            <Icon name="heroicons:heart" class="w-5 h-5 text-white/70"/>
          </div>
          <span class="text-[10px] uppercase tracking-widest text-white/50 font-bold drop-shadow-md">Watch</span>
        </div>
      </div>

    </div>

    <!-- Stack Effect -->
    <div
v-if="!loading"
         class="absolute w-[92%] h-full bg-white/5 rounded-[2rem] -z-10 scale-95 translate-y-4 blur-sm border border-white/5"/>
    <div
v-if="!loading"
         class="absolute w-[85%] h-full bg-white/5 rounded-[2rem] -z-20 scale-90 translate-y-8 blur-md border border-white/5"/>

    <div v-if="!hideActions" class="absolute -bottom-24 left-0 w-full flex justify-center gap-8 px-6 z-10">

      <button
:disabled="loading" class="h-16 w-16 rounded-full glass flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-90 shadow-2xl hover:shadow-red-500/30 group"
              @click="$emit('choice', false)">
        <Icon :name="(mode === 'music' || mode === 'spotify') ? 'heroicons:forward' : 'heroicons:x-mark'" size="2em" class="group-hover:rotate-90 transition-transform duration-300"/>
      </button>

      <button
          v-if="movie"
          class="h-16 w-16 rounded-full bg-white flex items-center justify-center text-brand-dark hover:scale-110 transition-all duration-300 active:scale-90 shadow-2xl hover:shadow-white/20"
          @click="$emit('choice', true)">
        <Icon :name="(mode === 'music' || mode === 'spotify') ? 'heroicons:play-solid' : 'heroicons:heart-solid'" size="2em" :class="(mode === 'music' || mode === 'spotify') ? (movie.provider?.name === 'Apple Music' ? 'text-pink-500 ml-1' : 'text-green-500 ml-1') : 'text-brand-red animate-pulse'"/>
      </button>

    </div>

    <!-- Bookmark Button (Absolute Top Right) -->
    <button 
      v-if="movie && !loading"
      class="absolute top-6 right-6 z-40 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-black/60 active:scale-90 group"
      :class="isSaved ? 'text-brand-red' : 'text-white/60 hover:text-white'"
      @click.stop="toggleSave"
    >
      <Icon :name="isSaved ? 'heroicons:bookmark-solid' : 'heroicons:bookmark'" class="w-6 h-6 transition-transform group-hover:scale-110"/>
    </button>

  </div>
</template>