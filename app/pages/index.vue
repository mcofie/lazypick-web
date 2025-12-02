<script setup lang="ts">
const { t } = useTranslations()

useHead({
  title: 'Home'
})
</script>

<template>
  <div class="min-h-screen bg-brand-dark text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

    <!-- Animated Background Blobs -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-red/20 blur-[120px] rounded-full pointer-events-none animate-pulse"/>
    <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none animate-float"/>

    <div class="z-10 w-full max-w-lg space-y-12 animate-fade-in">

      <div class="text-center space-y-4">
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter font-display drop-shadow-2xl">
          Lazy<span class="text-gradient-red">Pick</span>
        </h1>
        <p class="text-gray-400 text-xl font-light max-w-xs mx-auto leading-relaxed">{{ t('home.tagline') }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <NuxtLink
to="/decide?mode=movie"
                  class="group relative h-72 glass rounded-[2rem] overflow-hidden flex flex-col items-center justify-center text-center p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-red/20">
          
          <div class="absolute inset-0 bg-gradient-to-br from-brand-red/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
          
          <div class="relative z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
            <div class="mb-6 p-4 rounded-full bg-white/5 border border-white/10 group-hover:bg-brand-red/20 group-hover:border-brand-red/30 transition-colors duration-300">
              <Icon name="heroicons:film" size="3em" class="text-gray-300 group-hover:text-brand-red transition-colors duration-300"/>
            </div>
            <h2 class="text-3xl font-bold font-display mb-2">{{ t('home.watch') }}</h2>
            <p class="text-xs text-gray-500 font-medium tracking-wide uppercase">{{ t('home.watch_desc') }}</p>
          </div>
        </NuxtLink>

        <NuxtLink
to="/decide?mode=food"
                  class="group relative h-72 glass rounded-[2rem] overflow-hidden flex flex-col items-center justify-center text-center p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/20">
          
          <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
          
          <div class="relative z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
            <div class="mb-6 p-4 rounded-full bg-white/5 border border-white/10 group-hover:bg-yellow-500/20 group-hover:border-yellow-500/30 transition-colors duration-300">
              <Icon name="heroicons:cake" size="3em" class="text-gray-300 group-hover:text-yellow-500 transition-colors duration-300"/>
            </div>
            <h2 class="text-3xl font-bold font-display mb-2">{{ t('home.eat') }}</h2>
            <p class="text-xs text-gray-500 font-medium tracking-wide uppercase">{{ t('home.eat_desc') }}</p>
          </div>
        </NuxtLink>

      </div>

      <!-- Squad Mode -->
      <NuxtLink
          to="/squad"
          class="group relative w-full glass rounded-[2rem] overflow-hidden flex items-center justify-between p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">

        <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>

        <div class="relative z-10 flex items-center gap-6">
          <div class="p-4 rounded-full bg-white/5 border border-white/10 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-colors duration-300">
            <Icon name="heroicons:users" size="3em" class="text-gray-300 group-hover:text-purple-400 transition-colors duration-300"/>
          </div>
          <div class="text-left">
            <h2 class="text-3xl font-bold font-display mb-1">{{ t('home.squad') }}</h2>
            <p class="text-xs text-gray-500 font-medium tracking-wide uppercase">{{ t('home.squad_desc') }}</p>
          </div>
        </div>

        <div class="relative z-10">
          <span class="px-3 py-1 bg-purple-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full animate-pulse">{{ t('home.new') }}</span>
        </div>
      </NuxtLink>



    </div>
  </div>
</template>