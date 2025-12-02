<script setup lang="ts">
import {useDraggable} from '@vueuse/core'

const props = defineProps<{
  movie: any;
  loading: boolean;
  mode: string; // <--- NEW PROP
}>();

const emit = defineEmits(['spin']);

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
  const threshold = 150

  if (x.value > threshold) {
    if (props.movie?.netflixUrl) window.open(props.movie.netflixUrl, '_blank')
    resetCard()
  } else if (x.value < -threshold) {
    emit('spin')
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
  <div class="relative w-full max-w-sm h-[500px] flex items-center justify-center">

    <div
        ref="card"
        :style="cardStyle"
        class="absolute w-full h-full bg-gray-800 rounded-3xl overflow-hidden shadow-2xl z-20 touch-none select-none"
    >

      <div v-if="loading" class="absolute inset-0 bg-gray-900 animate-pulse flex items-center justify-center z-30">
        <Icon name="svg-spinners:ring-resize" size="3em"
              :class="mode === 'food' ? 'text-yellow-500' : 'text-brand-red'"/>
      </div>

      <div v-else-if="movie" class="relative h-full w-full pointer-events-none">
        <img :src="movie.poster" :alt="movie.title" class="absolute inset-0 w-full h-full object-cover"
             draggable="false"/>

        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

        <div class="absolute bottom-0 left-0 w-full p-6 text-white pb-24">
          <div class="flex items-center gap-2 mb-2 opacity-90 text-xs font-bold tracking-widest uppercase">

            <span v-if="mode === 'movie'" class="bg-brand-red px-2 py-1 rounded">Netflix</span>
            <span v-else class="bg-yellow-600 px-2 py-1 rounded">Food Spot</span>

            <span>★ {{ movie.rating?.toFixed(1) }}</span>
            <span>{{ movie.year }}</span>
          </div>
          <h2 class="text-3xl font-black leading-tight mb-2 drop-shadow-lg">{{ movie.title }}</h2>
          <p class="text-sm text-gray-200 line-clamp-3 leading-relaxed drop-shadow-md">
            {{ movie.description || movie.overview }}
          </p>
        </div>

        <div v-if="x > 50"
             class="absolute top-10 left-10 border-4 border-green-500 text-green-500 font-black text-4xl px-4 py-2 rounded -rotate-12 opacity-80">
          YES
        </div>
        <div v-if="x < -50"
             class="absolute top-10 right-10 border-4 border-red-500 text-red-500 font-black text-4xl px-4 py-2 rounded rotate-12 opacity-80">
          NO
        </div>
      </div>

    </div>

    <div v-if="!loading"
         class="absolute w-[95%] h-full bg-gray-700 rounded-3xl -z-10 scale-95 translate-y-3 opacity-50"></div>

    <div class="absolute -bottom-24 left-0 w-full flex justify-center gap-6 px-6 z-10">

      <button @click="$emit('spin')" :disabled="loading"
              class="h-16 w-16 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-red-500 hover:scale-110 transition active:scale-95 shadow-xl">
        <Icon name="heroicons:x-mark" size="2em"/>
      </button>

      <a v-if="movie" :href="movie.netflixUrl" target="_blank"
         class="h-16 w-16 rounded-full bg-white flex items-center justify-center text-green-600 hover:scale-110 transition active:scale-95 shadow-xl">
        <Icon name="heroicons:check" size="2em"/>
      </a>

    </div>

  </div>
</template>