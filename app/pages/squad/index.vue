<script setup lang="ts">
const client = useSupabaseClient()
const router = useRouter()
const { t } = useTranslations()

useHead({
  title: 'LazyPick Squad - Decide Together',
  meta: [
    { name: 'description', content: 'Sync up with friends and swipe to decide on a movie or food spot together.' }
  ]
})

const name = ref('')
const roomCode = ref('')
const loading = ref(false)

onMounted(() => {
  name.value = localStorage.getItem('squad_name') || ''
})

const createLobby = async (mode: 'movie' | 'food') => {
  if (!name.value) return alert('Please enter your name')
  loading.value = true

  // Save name
  localStorage.setItem('squad_name', name.value)

  // Generate Code
  const code = Math.random().toString(36).substring(2, 8).toUpperCase()

  // Create Lobby
  const { error } = await client.schema('lazypick').from('lobbies').insert({
    code,
    mode,
    status: 'waiting'
  })

  if (error) {
    console.error(error)
    alert('Failed to create lobby')
    loading.value = false
    return
  }

  // Add Host as Participant
  const userId = crypto.randomUUID()
  localStorage.setItem(`squad_user_${code}`, userId)

  const { error: partError } = await client.schema('lazypick').from('participants').insert({
    lobby_code: code,
    name: name.value,
    id: userId
  })

  if (partError) {
    console.error('Participant Insert Error:', partError)
    alert('Failed to join lobby as host')
    loading.value = false
    return
  }

  router.push(`/squad/${code}`)
}

const joinLobby = async () => {
  if (!name.value || !roomCode.value) return alert('Enter name and code')
  loading.value = true

  const code = roomCode.value.toUpperCase()
  localStorage.setItem('squad_name', name.value)

  // Check if lobby exists
  const { data: lobby } = await client.schema('lazypick').from('lobbies').select().eq('code', code).single()
  
  if (!lobby) {
    alert('Room not found')
    loading.value = false
    return
  }

  // Add Participant
  const userId = crypto.randomUUID()
  localStorage.setItem(`squad_user_${code}`, userId)

  const { error: joinError } = await client.schema('lazypick').from('participants').insert({
    lobby_code: code,
    name: name.value,
    id: userId
  })

  if (joinError) {
    console.error('Join Error:', joinError)
    alert('Failed to join lobby')
    loading.value = false
    return
  }

  router.push(`/squad/${code}`)
}
</script>

<template>
  <div class="min-h-screen bg-brand-dark text-white flex flex-col items-center justify-center p-6 relative overflow-x-hidden">

    <!-- Animated Background Blobs -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-red/20 blur-[120px] rounded-full pointer-events-none animate-pulse"/>
    <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none animate-float"/>

    <!-- Navigation -->
    <div class="absolute top-6 left-0 w-full px-6 flex justify-between items-center z-50">
      <NuxtLink to="/" class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
        <div class="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
          <Icon name="heroicons:arrow-left" class="w-5 h-5"/>
        </div>
        <span class="text-sm font-bold font-display tracking-wide">{{ t('decide.menu') }}</span>
      </NuxtLink>
    </div>

    <div class="z-10 w-full max-w-md space-y-8 animate-fade-in">
      
      <div class="text-center space-y-2">
        <h1 class="text-5xl font-black font-display tracking-tighter drop-shadow-2xl">{{ t('squad.title') }}</h1>
        <p class="text-gray-400 font-light">{{ t('squad.subtitle') }}</p>
      </div>

      <div class="glass p-8 rounded-[2rem] space-y-6">
        
        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">{{ t('squad.your_name') }}</label>
          <input v-model="name" type="text" :placeholder="t('squad.name_placeholder')" 
                 @keyup.enter="createLobby('movie')"
                 class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-red/50 focus:bg-white/10 transition-all text-lg font-medium">
        </div>

        <div>
          <button @click="createLobby('movie')" :disabled="loading"
                  class="w-full py-4 bg-brand-red rounded-xl font-bold text-lg hover:bg-red-600 hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-red/20 transition-all duration-300 font-display tracking-wide flex items-center justify-center gap-2">
            <Icon name="heroicons:plus-circle" class="w-6 h-6"/>
            <span>{{ t('squad.create_squad') }}</span>
          </button>
        </div>

        <div class="relative py-2">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-white/10"></div></div>
          <div class="relative flex justify-center"><span class="bg-brand-surface px-4 text-xs text-gray-500 uppercase tracking-widest font-bold">{{ t('squad.or_join') }}</span></div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <input v-model="roomCode" type="text" :placeholder="t('squad.room_code')" maxlength="6"
                 class="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-red/50 focus:bg-white/10 transition-all text-lg font-medium uppercase tracking-widest text-center">
          <button @click="joinLobby" :disabled="loading"
                  class="bg-white text-black font-bold px-6 py-3 sm:py-0 rounded-xl hover:bg-gray-200 transition-colors font-display tracking-wide w-full sm:w-auto">
            {{ t('squad.enter_room') }}
          </button>
        </div>

      </div>

    </div>
  </div>
</template>