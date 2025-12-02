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
                :class="mode === 'food' ? 'text-yellow-500' : 'text-brand-red'"/>
          <p class="text-xs font-bold uppercase tracking-widest text-gray-500">Finding the best...</p>
        </div>
      </div>

      <div v-else-if="movie" class="relative h-full w-full pointer-events-none group">
        <img
:src="movie.poster" :alt="movie.title" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
             draggable="false">

        <div class="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent"/>

        <div class="absolute bottom-0 left-0 w-full p-8 text-white pb-28">
          <div class="flex items-center gap-3 mb-3 opacity-90 text-[10px] font-bold tracking-[0.2em] uppercase">

            <span v-if="mode === 'movie'" class="bg-brand-red/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg shadow-brand-red/20">Netflix</span>
            <span v-else class="bg-yellow-600/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg shadow-yellow-600/20">Food Spot</span>

            <span class="flex items-center gap-1"><Icon name="heroicons:star-solid" class="text-yellow-400"/> {{ movie.rating?.toFixed(1) }}</span>
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
        <Icon name="heroicons:x-mark" size="2em" class="group-hover:rotate-90 transition-transform duration-300"/>
      </button>

      <button
v-if="movie"
         class="h-16 w-16 rounded-full bg-white flex items-center justify-center text-brand-dark hover:scale-110 transition-all duration-300 active:scale-90 shadow-2xl hover:shadow-white/20"
         @click="$emit('choice', true)">
        <Icon name="heroicons:heart-solid" size="2em" class="text-brand-red animate-pulse"/>
      </button>

    </div>

  </div>
</template>