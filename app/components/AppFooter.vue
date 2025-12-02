<script setup lang="ts">
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

onMounted(() => {
  const savedRegion = localStorage.getItem('lazypick_region')
  const savedLocale = localStorage.getItem('lazypick_locale')
  
  if (savedRegion) region.value = savedRegion
  if (savedLocale) locale.value = savedLocale
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
</script>

<template>
  <footer class="w-full py-8 px-6 mt-auto border-t border-white/5 bg-black/20 backdrop-blur-sm">
    <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500 font-medium uppercase tracking-widest">
      
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
  </footer>
</template>
