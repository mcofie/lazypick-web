<script setup lang="ts">
// Ensure this path matches where you put the card component
import MovieCard from '~/components/modules/MovieCard.vue'
import type { Movie } from '../../types/movie'


const route = useRoute()
const client = useSupabaseClient()
const { t } = useTranslations()
const dialog = useDialog()
const code = route.params.code as string

// Clipboard
const { copy, copied } = useClipboard()
const shareUrl = computed(() => `https://lazypick.app/squad/${code}`)

// Game State
interface Lobby {
  status: string;
  mode: string;
  result_json: Movie | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface Participant {
  id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const lobby = ref<Lobby | null>(null)
const participants = ref<Participant[]>([])
const currentUserId = ref('')
const status = ref('loading') // loading, waiting, active, matched
const matchResult = ref<Movie | null>(null)

const stack = ref<Movie[]>([])
const currentIndex = ref(0)
const currentItem = computed(() => stack.value[currentIndex.value])
const loadingMore = ref(false)

onMounted(async () => {
  currentUserId.value = localStorage.getItem(`squad_user_${code}`) || ''
  if (!currentUserId.value) return navigateTo('/squad')

  // 1. Initial Fetch (Using explicit schema)
  const {data: lobbyData, error: lobbyError} = await client!.schema('lazypick').from('lobbies').select().eq('code', code).single()
  
  if (lobbyError || !lobbyData) {
    console.error('Lobby Error:', lobbyError)
    await dialog.alert('Lobby not found or error loading', 'Error')
    return navigateTo('/squad')
  }

  lobby.value = lobbyData
  status.value = lobbyData.status
  if (lobbyData.status === 'matched') matchResult.value = lobbyData.result_json

  const {data: parts, error: partsError} = await client!.schema('lazypick').from('participants').select().eq('lobby_code', code)
  if (partsError) console.error('Participants Error:', partsError)
  console.log('Initial Participants:', parts)
  participants.value = parts || []

  // 2. Realtime Subscription (Specifying Schema)
  const _channel = client!.channel(`lobby_${code}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'lazypick', // <--- IMPORTANT
        table: 'participants',
        filter: `lobby_code=eq.${code}`
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, (payload: any) => {
        console.log('New Participant Event:', payload)
        participants.value.push(payload.new)
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'lazypick', // <--- IMPORTANT
        table: 'lobbies',
        filter: `code=eq.${code}`
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, (payload: any) => {
        console.log('Lobby Update Event:', payload)
        if (payload.new.status === 'active' && status.value === 'waiting') startGame()
        if (payload.new.status === 'matched') {
          status.value = 'matched'
          matchResult.value = payload.new.result_json
          if (navigator.vibrate) navigator.vibrate(50)
          fireConfetti()
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((status: any) => {
        console.log('Subscription Status:', status)
      })
})

const triggerStart = async () => {
  // Lock the lobby
  await client!.schema('lazypick').from('lobbies').update({status: 'active'}).eq('code', code)
}

const startGame = async () => {
  status.value = 'active'
  await loadMoreCards()
}

const loadMoreCards = async () => {
  loadingMore.value = true
  // Build the stack locally (In prod, you'd fetch a consistent list ID)
  const endpoint = lobby.value?.mode === 'movie' ? '/api/movies/random' : '/api/food/random'
  const region = useState('region')
  const locale = useState('locale')
  const providers = useState<string[]>('providers')

  // Fetch 5 cards for the game
  for (let i = 0; i < 5; i++) {
    const data = await $fetch(endpoint, {
      params: {
        region: region.value,
        locale: locale.value,
        providers: providers.value.join('|')
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stack.value.push({ ...data, year: (data as any).year || 'N/A' } as Movie)
  }
  loadingMore.value = false
}

const handleSwipe = async (liked: boolean) => {
  if (!currentItem.value) return

  if (liked) {
    // Record vote in 'lazypick' schema
    await client!.schema('lazypick').from('votes').insert({
      lobby_code: code,
      item_id: currentItem.value.id,
      item_data: {
        ...currentItem.value,
        year: (currentItem.value.year || 'N/A') as string
      },
      participant_id: currentUserId.value,
      liked: true
    })

    if (currentItem.value.id) {
      checkForMatch(currentItem.value.id)
    }
  }

  currentIndex.value++
}

const checkForMatch = async (itemId: number | string) => {
  const {count} = await client!.schema('lazypick').from('votes')
      .select('*', {count: 'exact'})
      .eq('lobby_code', code)
      .eq('item_id', itemId)
      .eq('liked', true)

  // If everyone liked it, declare winner
  if (count === participants.value.length) {
    await client!.schema('lazypick').from('lobbies').update({
      status: 'matched',
      result_json: currentItem.value
    }).eq('code', code)

    if (navigator.vibrate) navigator.vibrate(50)
    fireConfetti()
  }
}

const fireConfetti = async () => {
  const { default: confetti } = await import('canvas-confetti')
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#E50914', '#ffffff', '#22c55e'] // Brand Red, White, Green
  })
}
</script>

<template>
  <div class="min-h-screen bg-brand-dark text-white flex flex-col items-center justify-center p-4 relative overflow-x-hidden">
    
    <!-- Animated Background Blobs -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-red/20 blur-[120px] rounded-full pointer-events-none animate-pulse"/>
    <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none animate-float"/>

    <!-- Navigation -->
    <div class="absolute top-6 left-0 w-full px-6 flex justify-between items-center z-50">
      <NuxtLink to="/squad" class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
        <div class="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
          <Icon name="heroicons:arrow-left" class="w-5 h-5"/>
        </div>
        <span class="text-sm font-bold font-display tracking-wide">{{ t('squad.leave') }}</span>
      </NuxtLink>
    </div>

    <div v-if="status === 'waiting'" class="z-10 w-full max-w-sm text-center space-y-8 animate-fade-in">
      <div>
        <p class="text-gray-500 text-xs uppercase tracking-[0.3em] font-bold mb-4">{{ t('squad.room_code') }}</p>
        <h1 class="text-7xl font-black font-display tracking-tighter text-white drop-shadow-2xl">{{ code }}</h1>

        <button
class="mt-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 mx-auto" 
                @click="copy(shareUrl)">
          <Icon :name="copied ? 'heroicons:check' : 'heroicons:clipboard'" class="text-gray-400" />
          <span :class="copied ? 'text-green-500' : 'text-gray-400'">{{ copied ? t('squad.copied') : t('squad.copy_link') }}</span>
        </button>
      </div>

      <div class="glass rounded-3xl p-8 space-y-6">
        <h3 class="font-bold text-gray-400 text-xs uppercase tracking-widest">{{ t('squad.members') }}</h3>
        <div class="flex flex-wrap justify-center gap-3">
          <span
v-for="p in participants" :key="p.id"
                class="px-5 py-2.5 bg-white/10 border border-white/5 rounded-full text-sm font-bold flex items-center gap-2 transition-all hover:bg-white/20">
            <div class="w-2 h-2 rounded-full" :class="p.id === currentUserId ? 'bg-brand-red' : 'bg-green-500'"/>
            {{ p.name }} <span v-if="p.id === currentUserId" class="opacity-50 font-normal">(You)</span>
          </span>
          <span v-if="participants.length === 0" class="text-gray-600 text-sm italic">{{ t('squad.waiting_players') }}</span>
        </div>
      </div>

      <button
class="w-full py-5 bg-brand-red rounded-2xl font-bold text-lg hover:bg-red-600 hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-red/20 transition-all duration-300 font-display tracking-wide"
              @click="triggerStart">
        {{ t('squad.start_game') }}
      </button>
    </div>

    <div v-else-if="status === 'active'" class="z-10 w-full max-w-sm flex flex-col items-center gap-8 animate-slide-up">
      <div class="text-center">
        <h2 class="text-2xl font-bold font-display text-gray-300">{{ t('squad.swipe_together') }}</h2>
      </div>

      <MovieCard
          v-if="currentItem"
          :movie="currentItem"
          :loading="false"
          :mode="lobby?.mode || 'movie'"
          @choice="handleSwipe"
      />
      
      <!-- No Match / Load More State -->
      <div v-else class="w-full max-w-sm h-[540px] glass rounded-[2rem] flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div class="p-4 rounded-full bg-white/5">
          <Icon name="heroicons:clock" size="3em" class="text-gray-400" />
        </div>
        <div>
          <h3 class="text-xl font-bold font-display mb-2">{{ t('squad.no_match') }}</h3>
          <p class="text-sm text-gray-400">{{ t('squad.waiting_votes') }}</p>
        </div>
        <button
:disabled="loadingMore" class="w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
                @click="loadMoreCards">
          <Icon v-if="loadingMore" name="svg-spinners:180-ring" />
          <span>{{ loadingMore ? t('squad.loading') : t('squad.load_more') }}</span>
        </button>
      </div>
    </div>

    <div v-else-if="status === 'matched'" class="z-10 text-center space-y-8 w-full max-w-sm animate-fade-in">
      <div class="text-8xl animate-bounce">🎉</div>
      <h1 class="text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 leading-tight">{{ t('squad.match_found') }}</h1>

      <div class="glass p-6 rounded-3xl border-green-500/30 shadow-2xl shadow-green-500/10">
        <img :src="matchResult?.poster || ''" class="rounded-2xl mb-6 shadow-lg w-full object-cover aspect-[2/3]">
        <h2 class="text-3xl font-bold font-display">{{ matchResult?.title }}</h2>
      </div>

      <a
:href="matchResult?.watchUrl || '#'" target="_blank"
         class="block w-full py-5 bg-green-600 rounded-2xl font-bold text-lg hover:bg-green-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 font-display tracking-wide">
        {{ t('squad.open_now') }}
      </a>
    </div>

  </div>
</template>