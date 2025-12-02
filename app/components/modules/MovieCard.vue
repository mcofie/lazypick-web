<script setup lang="ts">
interface Movie {
  title: string;
  poster: string;
  rating: number;
  year: string;
  description?: string;
  overview?: string;
  netflixUrl: string;
}

defineProps<{
  movie: Movie;
  loading: boolean;
}>();

defineEmits(['spin']);
</script>

<template>
  <div class="relative w-full max-w-sm aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">

    <div
      v-if="loading"
      class="absolute inset-0 bg-gray-900 animate-pulse flex items-center justify-center z-20"
    >
      <Icon
        name="svg-spinners:ring-resize"
        size="3em"
        class="text-brand-red"
      />
    </div>

    <div
      v-else-if="movie"
      class="relative h-full w-full group"
    >
      <img
        :src="movie.poster"
        :alt="movie.title"
        class="absolute inset-0 w-full h-full object-cover"
      >

      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <div class="absolute bottom-0 left-0 w-full p-6 text-white pb-24">

        <div class="flex items-center gap-2 mb-2 opacity-80 text-xs font-bold tracking-widest uppercase">
          <span class="bg-brand-red px-2 py-1 rounded">Netflix GH</span>
          <span>★ {{ movie.rating.toFixed(1) }}</span>
          <span>• {{ movie.year }}</span>
        </div>

        <h2 class="text-3xl font-black leading-tight mb-2">
          {{ movie.title }}
        </h2>
        <p class="text-sm text-gray-300 line-clamp-3 leading-relaxed">
          {{ movie.description || movie.overview }}
        </p>
      </div>
    </div>

    <div class="absolute bottom-6 left-0 w-full flex justify-center gap-4 px-6 z-30">

      <button
        class="h-14 w-14 rounded-full bg-gray-800/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-gray-700 transition active:scale-95 disabled:opacity-50"
        :disabled="loading"
        @click="$emit('spin')"
      >
        <Icon
          name="heroicons:arrow-path"
          size="1.5em"
          :class="{ 'animate-spin': loading }"
        />
      </button>

      <a
        v-if="movie"
        :href="movie.netflixUrl"
        target="_blank"
        class="flex-1 h-14 rounded-full bg-brand-red hover:bg-red-700 text-white font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-lg shadow-red-900/50"
      >
        <Icon
          name="simple-icons:netflix"
          size="1.2em"
        />
        <span>Watch Now</span>
      </a>

    </div>

  </div>
</template>