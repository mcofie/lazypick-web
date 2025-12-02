<script setup lang="ts">
const client = useSupabaseClient()
const router = useRouter()

const name = ref('')
const joinCode = ref('')
const loading = ref(false)

// 1. Create Lobby Logic
const createLobby = async (mode: 'movie' | 'food') => {
  if (!name.value) return alert('Enter your name first!')
  loading.value = true

  const code = Math.random().toString(36).substring(2, 6).toUpperCase()

  // Explicit Schema: lazypick
  const {error: lobbyErr} = await client
      .schema('lazypick')
      .from('lobbies')
      .insert({code, mode, status: 'waiting'})

  if (lobbyErr) {
    loading.value = false
    return alert('Error creating lobby: ' + lobbyErr.message)
  }

  // Add Host
  const {data: user, error: partErr} = await client
      .schema('lazypick')
      .from('participants')
      .insert({lobby_code: code, name: name.value})
      .select()
      .single()

  if (partErr) return alert('Error joining: ' + partErr.message)

  // Save Session & Redirect
  localStorage.setItem(`squad_user_${code}`, user.id)
  router.push(`/squad/${code}`)
}

// 2. Join Lobby Logic
const joinLobby = async () => {
  if (!name.value || !joinCode.value) return alert('Enter name and code!')
  loading.value = true
  const code = joinCode.value.toUpperCase()

  // Check Lobby existence in 'lazypick' schema
  const {data: lobby} = await client
      .schema('lazypick')
      .from('lobbies')
      .select()
      .eq('code', code)
      .single()

  if (!lobby) {
    loading.value = false
    return alert('Lobby not found!')
  }

  // Add Participant
  const {data: user, error} = await client
      .schema('lazypick')
      .from('participants')
      .insert({lobby_code: code, name: name.value})
      .select()
      .single()

  if (error) return alert('Could not join')

  localStorage.setItem(`squad_user_${code}`, user.id)
  router.push(`/squad/${code}`)
}
</script>

<template>
  <div class="min-h-screen bg-brand-dark text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
    
    <!-- Animated Background Blobs -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-red/20 blur-[120px] rounded-full pointer-events-none animate-pulse"/>
    <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none animate-float"/>

    <div class="z-10 w-full max-w-md space-y-10 animate-fade-in">

      <div class="text-center space-y-2">
        <h1 class="text-5xl font-black font-display tracking-tighter">
          Squad <span class="text-gradient-red">Mode</span>
        </h1>
        <p class="text-gray-400 font-light">Sync up and decide together.</p>
      </div>

      <div class="space-y-6 glass p-8 rounded-3xl">
        <div class="space-y-2">
          <label class="text-xs font-bold uppercase text-gray-500 tracking-wider">Your Name</label>
          <input v-model="name" type="text" placeholder="e.g. Kwame"
                 class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-brand-red/50 focus:bg-white/10 focus:outline-none transition-all duration-300"/>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button @click="createLobby('movie')" :disabled="loading"
                  class="group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-red/10">
            <div class="absolute inset-0 bg-gradient-to-br from-brand-red/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
            <Icon name="heroicons:film" size="2em" class="text-gray-400 group-hover:text-brand-red transition-colors duration-300"/>
            <span class="font-bold text-sm font-display">Movie Squad</span>
          </button>
          
          <button @click="createLobby('food')" :disabled="loading"
                  class="group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/10">
            <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
            <Icon name="heroicons:cake" size="2em" class="text-gray-400 group-hover:text-yellow-500 transition-colors duration-300"/>
            <span class="font-bold text-sm font-display">Food Squad</span>
          </button>
        </div>

        <div class="relative py-2">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/10"></div>
          </div>
          <div class="relative flex justify-center">
            <span class="bg-brand-surface px-4 text-xs text-gray-500 uppercase tracking-widest font-bold">Or Join</span>
          </div>
        </div>

        <div class="flex gap-3">
          <input v-model="joinCode" type="text" placeholder="CODE" maxlength="4"
                 class="w-28 bg-white/5 border border-white/10 rounded-xl p-4 text-center uppercase font-bold font-display tracking-widest focus:border-brand-red/50 focus:bg-white/10 focus:outline-none transition-all duration-300"/>
          <button @click="joinLobby" :disabled="loading"
                  class="flex-1 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors duration-300 font-display tracking-wide">
            Enter Room
          </button>
        </div>
      </div>

    </div>
  </div>
</template>