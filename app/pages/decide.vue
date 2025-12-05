<script setup lang="ts">
import MovieCard from '~/components/modules/MovieCard.vue'
import type { Movie } from '~/types/movie'

const { t } = useTranslations()

useHead({
  title: 'LazyPick - Find Your Vibe',
  meta: [
    { name: 'description', content: 'Choose your mood and get instant recommendations.' }
  ]
})
const route = useRoute()
const mode = computed(() => (route.query.mode as string) || 'movie')

// State
const mood = ref<string | null>(null) // New state for mood
const data = ref<Movie | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const pageTitle = computed(() => {
  if (mode.value === 'movie') return t('decide.find_movie')
  if (mode.value === 'music' || mode.value === 'spotify') return 'Find Your Tune'
  return t('decide.find_food')
})

const currentVibeLabel = computed(() => {
  const v = vibes.value.find(v => v.id === mood.value)
  return v ? v.label : ''
})

useHead({
  title: pageTitle as unknown as string
})

// Define Moods (Emojis make it faster to process)
const vibes = computed(() => [
  {id: 'chill', label: t('decide.vibes.chill'), icon: '😌'},
  {id: 'lit', label: t('decide.vibes.lit'), icon: '🔥'},
  {id: 'sad', label: t('decide.vibes.sad'), icon: '🥲'},
  {id: 'romantic', label: t('decide.vibes.romantic'), icon: '😍'},
  {id: 'hungry', label: t('decide.vibes.hungry'), icon: '🤤'},
  {id: 'curious', label: t('decide.vibes.curious'), icon: '🎲'}
])

// Step 1: Select Mood
const selectMood = (selectedMood: string) => {
  mood.value = selectedMood
  spin()
}

// Step 2: Spin with Mood Data
const spin = async () => {
  loading.value = true
  error.value = null
  data.value = null

  try {
    let endpoint = '/api/movies/random'
    if (mode.value === 'food') endpoint = '/api/food/random'
    if (mode.value === 'music' || mode.value === 'spotify') endpoint = '/api/music/random'

    const region = useState('region')
    const locale = useState('locale')
    const providers = useState<string[]>('providers')

    // Pass the mood as a query parameter
    const response = await $fetch(endpoint, {
      params: {
        mood: mood.value,
        region: region.value,
        locale: locale.value,
        providers: providers.value.join('|') // OR logic
      }
    })

    data.value = response as Movie
  } catch (err) {
    console.error(err)
    error.value = t('decide.error') as string
  } finally {
    loading.value = false
  }
}

// Handle Card Choice
const handleChoice = (liked: boolean) => {
  if (liked && data.value?.watchUrl) {
    window.open(data.value.watchUrl, '_blank')
    // Optionally fetch next card after returning? For now just keep current or reset.
    // spin() // Uncomment if we want auto-next after like
  } else {
    spin()
  }
}

// Reset to pick a new mood
const resetVibe = () => {
  mood.value = null
  data.value = null
}
</script>

<template>
  <div class="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4 relative text-white overflow-x-hidden">

    <!-- Background Elements -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/10 blur-[100px] rounded-full pointer-events-none animate-float"/>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none animate-pulse"/>

    <div class="absolute top-6 left-0 w-full px-6 flex justify-between items-center z-50">
      <NuxtLink to="/" class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
        <div class="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
          <Icon name="heroicons:arrow-left" class="w-5 h-5"/>
        </div>
        <span class="text-sm font-bold font-display tracking-wide">{{ t('decide.menu') }}</span>
      </NuxtLink>

      <button
          v-if="mood"
          class="text-[10px] md:text-xs font-bold px-3 py-2 md:px-4 md:py-2 rounded-full border border-white/10 text-brand-red bg-brand-red/5 hover:bg-brand-red/10 uppercase tracking-wider transition-all hover:scale-105 flex items-center gap-2"
          @click="resetVibe">
        <span class="hidden md:inline">{{ t('decide.change_vibe') }}</span>
        <span class="hidden md:inline text-white/50">•</span>
        <span class="text-white truncate max-w-[120px] md:max-w-none">{{ currentVibeLabel }}</span>
        <Icon name="heroicons:pencil-square" class="w-4 h-4 md:hidden"/>
      </button>
    </div>

    <div v-if="!mood" class="w-full max-w-md animate-fade-in z-10">
      <div class="text-center mb-10 space-y-2">
        <h1 class="text-4xl md:text-5xl font-black font-display tracking-tight">{{ t('decide.vibe_check') }}</h1>
        <p class="text-gray-400 font-light text-lg">{{ t('decide.how_feeling') }}</p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <button
            v-for="v in vibes"
            :key="v.id"
            class="glass p-6 rounded-3xl flex flex-col items-center gap-4 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 group active:scale-95"
            @click="selectMood(v.id)"
        >
          <span class="text-5xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{{ v.icon }}</span>
          <span class="font-bold text-sm text-gray-300 group-hover:text-white font-display tracking-wide">{{ v.label }}</span>
        </button>
      </div>
    </div>

    <div v-else class="w-full max-w-sm flex flex-col items-center gap-8 z-10 animate-slide-up">

      <div class="text-center space-y-2">
        <h1 class="font-black text-3xl md:text-4xl tracking-tight font-display">{{ pageTitle }}</h1>
        <p v-if="loading" class="text-gray-400 text-sm font-medium flex items-center justify-center gap-2">
          <Icon name="svg-spinners:ring-resize" class="text-brand-red"/>
          {{ t('decide.matching') }}
        </p>
      </div>

      <div
v-if="error"
           class="w-full bg-red-500/10 backdrop-blur-md text-red-200 px-6 py-4 rounded-2xl text-sm border border-red-500/20 text-center shadow-lg shadow-red-900/20">
        <p class="font-medium">{{ error }}</p>
        <button class="block w-full mt-3 font-bold text-white bg-red-500/20 py-2 rounded-lg hover:bg-red-500/30 transition-colors" @click="resetVibe">{{ t('decide.try_again') }}</button>
      </div>

      <MovieCard
          v-if="data || loading"
          :movie="data"
          :loading="loading"
          :mode="mode"
          @choice="handleChoice"
      />

    </div>

  </div>
</template>