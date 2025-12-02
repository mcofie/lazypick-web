<script setup lang="ts">
// Simple state to test
const tagline = "Stop Scrolling. Start Watching."
</script>

<template>
  <div class="min-h-screen bg-brand-dark text-white flex flex-col items-center justify-center p-6">

    <div class="text-center space-y-6">
      <h1 class="text-5xl font-black tracking-tighter text-brand-red">
        LazyPick
      </h1>
      <p class="text-xl text-gray-400 max-w-xs mx-auto">
        {{ tagline }}
      </p>

      <NuxtLink
to="/decide"
                class="inline-block bg-white text-black font-bold py-4 px-8 rounded-full text-lg hover:scale-105 transition-transform">
        Spin the Wheel 🎲
      </NuxtLink>
    </div>

    <div class="mt-10 opacity-50 text-sm">
      Built for Accra 🇬🇭
    </div>

  </div>
</template>