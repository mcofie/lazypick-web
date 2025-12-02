<script setup lang="ts">
const tagline = "Decisions made easy. What's the plan?"
</script>

<template>
  <div
      class="min-h-screen bg-brand-dark text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

    <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-brand-red/10 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="z-10 w-full max-w-lg space-y-8">

      <div class="text-center space-y-2">
        <h1 class="text-4xl md:text-6xl font-black tracking-tighter">
          Lazy<span class="text-brand-red">Pick</span>
        </h1>
        <p class="text-gray-400 text-lg">{{ tagline }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <NuxtLink to="/decide?mode=movie"
                  class="group relative h-64 bg-gray-900 rounded-3xl border border-white/10 hover:border-brand-red/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col items-center justify-center text-center p-6">
          <div
              class="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <Icon name="heroicons:film" size="4em"
                class="mb-4 text-gray-500 group-hover:text-brand-red transition-colors"/>
          <h2 class="text-2xl font-bold">Watch</h2>
          <p class="text-xs text-gray-500 mt-2">Netflix • Prime • Showmax</p>
        </NuxtLink>

        <NuxtLink to="/decide?mode=food"
                  class="group relative h-64 bg-gray-900 rounded-3xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col items-center justify-center text-center p-6">
          <div
              class="absolute inset-0 bg-gradient-to-br from-yellow-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <Icon name="heroicons:cake" size="4em"
                class="mb-4 text-gray-500 group-hover:text-yellow-500 transition-colors"/>
          <h2 class="text-2xl font-bold">Eat</h2>
          <p class="text-xs text-gray-500 mt-2">Local • Continental • Fast</p>
        </NuxtLink>

      </div>

      <div class="text-center pt-8">
        <p class="text-xs text-gray-600 uppercase tracking-widest font-bold">
          Accra Edition 🇬🇭
        </p>
      </div>

    </div>
  </div>
</template>