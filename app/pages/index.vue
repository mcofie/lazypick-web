<script setup lang="ts">
const { t } = useTranslations()

useHead({
  title: 'LazyPick - Decide What to Watch or Eat',
  meta: [
    { name: 'description', content: "Can't decide? Let LazyPick help you find the perfect movie or food spot in seconds." }
  ]
})

useHead({
  title: 'Home'
})
</script>

<template>
  <div class="min-h-screen bg-brand-dark text-white flex flex-col items-center justify-center p-4 md:p-6 relative overflow-x-hidden selection:bg-brand-red/30">

    <!-- Animated Background Blobs -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-red/20 blur-[120px] rounded-full pointer-events-none animate-pulse"/>
    <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none animate-float"/>
    
    <!-- Floating Icons -->
    <div class="absolute top-1/4 left-10 md:left-20 opacity-20 animate-float pointer-events-none">
      <Icon name="heroicons:ticket" size="4em" class="text-brand-red rotate-[-15deg]"/>
    </div>
    <div class="absolute bottom-1/4 right-10 md:right-20 opacity-20 animate-float-delayed pointer-events-none">
      <Icon name="heroicons:film" size="5em" class="text-purple-500 rotate-[15deg]"/>
    </div>

    <!-- Navigation -->
    <div class="absolute top-6 right-6 z-50">
      <NuxtLink to="/watchlist" class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-sm font-bold tracking-wide group backdrop-blur-md">
        <span>{{ t('watchlist.title') || 'My List' }}</span>
        <Icon name="heroicons:bookmark" class="w-4 h-4 text-gray-400 group-hover:text-white transition-colors"/>
      </NuxtLink>
    </div>

    <div class="z-10 w-full max-w-4xl flex flex-col items-center gap-8 md:gap-12 animate-fade-in py-12 md:py-0">

      <div class="text-center space-y-4">
        <h1 class="text-5xl md:text-8xl font-black tracking-tighter font-display drop-shadow-2xl">
          Lazy<span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-red-400 to-brand-red bg-[length:200%_auto] animate-text-shimmer">Pick</span>
        </h1>
        <p class="text-gray-400 text-lg md:text-xl font-light max-w-xs mx-auto leading-relaxed">{{ t('home.tagline') }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full">

        <!-- Solo Mode -->
        <NuxtLink
            to="/decide?mode=movie"
            class="group relative h-64 md:h-80 glass rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center text-center p-6 md:p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-red/20 border border-white/5 hover:border-white/20">
          
          <!-- Hover Shine -->
          <div class="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/5 to-transparent z-20 pointer-events-none"/>
          
          <div class="absolute inset-0 bg-gradient-to-br from-brand-red/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
          
          <div class="relative z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
            <div class="mb-6 p-5 rounded-full bg-white/5 border border-white/10 group-hover:bg-brand-red/20 group-hover:border-brand-red/30 transition-colors duration-300 inline-block backdrop-blur-sm">
              <Icon name="heroicons:user" size="3.5em" class="text-gray-300 group-hover:text-brand-red transition-colors duration-300"/>
            </div>
            <h2 class="text-3xl md:text-4xl font-bold font-display mb-2">{{ t('home.solo') }}</h2>
            <p class="text-sm text-gray-400 font-medium tracking-wide uppercase">{{ t('home.solo_desc') }}</p>
          </div>
        </NuxtLink>

        <!-- Squad Mode -->
        <NuxtLink
            to="/squad"
            class="group relative h-64 md:h-80 glass rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center text-center p-6 md:p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 border border-white/5 hover:border-white/20">
          
          <!-- Hover Shine -->
          <div class="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/5 to-transparent z-20 pointer-events-none"/>

          <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
          
          <div class="relative z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
            <div class="mb-6 p-5 rounded-full bg-white/5 border border-white/10 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-colors duration-300 inline-block backdrop-blur-sm">
              <Icon name="heroicons:users" size="3.5em" class="text-gray-300 group-hover:text-purple-400 transition-colors duration-300"/>
            </div>
            <h2 class="text-3xl md:text-4xl font-bold font-display mb-2">{{ t('home.squad') }}</h2>
            <p class="text-sm text-gray-400 font-medium tracking-wide uppercase">{{ t('home.squad_desc') }}</p>
          </div>

          <div class="absolute top-6 right-6 z-10">
            <span class="px-3 py-1 bg-purple-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full animate-pulse shadow-lg shadow-purple-500/50">{{ t('home.new') }}</span>
          </div>
        </NuxtLink>

      </div>

    </div>
  </div>
</template>