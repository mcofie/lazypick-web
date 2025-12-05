<script setup>
import _quizData from '@/constants/quiz.json'

const _currentStep = ref(0)
const _answers = ref({}) // Store raw answers for UI state
const finalProfile = ref({
  global: {},
  food: {},
  movies: {}
})

// Function to merge effects
function _selectOption(option) {
  const effects = option.effects

  // 1. Merge Global
  if (effects.global) {
    Object.assign(finalProfile.value.global, effects.global)
  }

  // 2. Merge Domains (Food/Movies)
  if (effects.domain_weights) {
    for (const [domain, weights] of Object.entries(effects.domain_weights)) {
      if (!finalProfile.value[domain]) finalProfile.value[domain] = {}
      Object.assign(finalProfile.value[domain], weights)
    }
  }

  nextStep()
}

async function _submitProfile() {
  await $fetch('/api/lazypick/onboarding', {
    method: 'POST',
    body: finalProfile.value
  })
  navigateTo('/play')
}
</script>