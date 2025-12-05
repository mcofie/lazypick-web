<script setup lang="ts">
const { isOpen, title, message, type, close } = useDialog()

const handleAction = (result: boolean) => {
  close(result)
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="handleAction(false)"/>

        <!-- Dialog Content -->
        <div class="relative w-full max-w-sm glass rounded-2xl p-6 shadow-2xl border border-white/10 bg-brand-dark/90 text-center space-y-6 animate-fade-in">
          
          <div class="space-y-2">
            <h3 class="text-xl font-bold font-display text-white">{{ title }}</h3>
            <p class="text-gray-300">{{ message }}</p>
          </div>

          <div class="flex gap-3 justify-center">
            <button 
              v-if="type === 'confirm'"
              class="px-6 py-2.5 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
              @click="handleAction(false)"
            >
              Cancel
            </button>
            <button 
              class="px-6 py-2.5 rounded-xl font-bold text-sm bg-brand-red hover:bg-red-600 text-white shadow-lg shadow-brand-red/20 transition-all hover:scale-105"
              @click="handleAction(true)"
            >
              {{ type === 'confirm' ? 'Confirm' : 'OK' }}
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>
