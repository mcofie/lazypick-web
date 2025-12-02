<script setup lang="ts">
import { providers } from '~/utils/providers'
const { t } = useTranslations()

const regions = [
  { code: 'GH', label: 'Accra (GH)', flag: '🇬🇭' },
  { code: 'US', label: 'United States', flag: '🇺🇸' },
  { code: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
]

const locales = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
]

// State with persistence
const region = useState('region', () => 'GH')
const locale = useState('locale', () => 'en')
const selectedProviders = useState<string[]>('providers', () => ['8']) // Default to Netflix

onMounted(() => {
  const savedRegion = localStorage.getItem('lazypick_region')
  const savedLocale = localStorage.getItem('lazypick_locale')
  const savedProviders = localStorage.getItem('lazypick_providers')
  
  if (savedRegion) region.value = savedRegion
  if (savedLocale) locale.value = savedLocale
  if (savedProviders) selectedProviders.value = JSON.parse(savedProviders)
})

const updateRegion = (event: Event) => {
  const val = (event.target as HTMLSelectElement).value
  region.value = val
  localStorage.setItem('lazypick_region', val)
}

const updateLocale = (event: Event) => {
  const val = (event.target as HTMLSelectElement).value
  locale.value = val
  localStorage.setItem('lazypick_locale', val)
}

const toggleProvider = (id: string) => {
  if (selectedProviders.value.includes(id)) {
    // Don't allow deselecting the last one
    if (selectedProviders.value.length > 1) {
      selectedProviders.value = selectedProviders.value.filter(p => p !== id)
    }
  } else {
    selectedProviders.value.push(id)
  }
  localStorage.setItem('lazypick_providers', JSON.stringify(selectedProviders.value))
}
</script>

<template>
  <footer class="w-full py-8 px-6 mt-auto border-t border-white/5 bg-black/20 backdrop-blur-sm">
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      
      <!-- Top Row: Providers -->
      <div class="flex flex-wrap justify-center md:justify-start gap-4">
        <button 
          v-for="p in providers" 
          :key="p.id"
          @click="toggleProvider(p.id)"
          class="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300"
          :class="selectedProviders.includes(p.id) 
            ? 'bg-white/10 border-white/20 text-white shadow-lg shadow-white/5' 
            : 'bg-transparent border-white/5 text-gray-600 hover:border-white/10 hover:text-gray-400'"
        >
          <Icon :name="p.icon" class="w-4 h-4" />
          <span class="text-xs font-bold tracking-wide">{{ p.name }}</span>
        </button>
      </div>

      <!-- Bottom Row: Settings & Links -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500 font-medium uppercase tracking-widest border-t border-white/5 pt-6">
        
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2 group relative">
            <Icon name="heroicons:globe-alt" class="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors"/>
            <select 
              :value="region" 
              @change="updateRegion"
              class="bg-transparent appearance-none outline-none cursor-pointer hover:text-gray-300 transition-colors pr-4"
            >
              <option v-for="r in regions" :key="r.code" :value="r.code" class="bg-brand-surface text-gray-300">
                {{ r.flag }} {{ r.label }}
              </option>
            </select>
          </div>

          <div class="flex items-center gap-2 group relative">
            <Icon name="heroicons:language" class="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors"/>
            <select 
              :value="locale" 
              @change="updateLocale"
              class="bg-transparent appearance-none outline-none cursor-pointer hover:text-gray-300 transition-colors pr-4"
            >
              <option v-for="l in locales" :key="l.code" :value="l.code" class="bg-brand-surface text-gray-300">
                {{ l.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex items-center gap-4 opacity-50">
          <NuxtLink to="/privacy" class="hover:text-white transition-colors">{{ t('footer.privacy') }}</NuxtLink>
          <span>•</span>
          <NuxtLink to="/terms" class="hover:text-white transition-colors">{{ t('footer.terms') }}</NuxtLink>
          <span>•</span>
          <span>© {{ new Date().getFullYear() }} LazyPick</span>
        </div>

      </div>
    </div>
  </footer>
</template>
