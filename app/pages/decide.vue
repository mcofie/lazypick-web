<script setup lang="ts">
// 1. FORCE IMPORT THE COMPONENT
// This ensures Nuxt finds the file, regardless of folder naming rules.
import MovieCard from '~/components/modules/MovieCard.vue'

const movie = ref(null)
const loading = ref(true)
const error = ref(null)

const spin = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await $fetch('/api/movies/random')
    movie.value = data
  } catch (err) {
    console.error(err)
    error.value = "Oops! Could not find a movie. Try again."
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  spin()
})
</script>

<template>
  <div class="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4">

    <div class="mb-6 text-center">
      <h1 class="text-white font-black text-2xl tracking-tight">LazyPick</h1>
      <p class="text-gray-500 text-sm">For Netflix Ghana 🇬🇭</p>
    </div>

    <div v-if="error" class="mb-4 bg-red-900/50 text-red-200 px-4 py-2 rounded-lg text-sm border border-red-800">
      {{ error }}
      <button class="underline ml-2" @click="spin">Retry</button>
    </div>

    <MovieCard
        v-if="movie || loading"
        :movie="movie"
        :loading="loading"
        @spin="spin"
    />

  </div>
</template>