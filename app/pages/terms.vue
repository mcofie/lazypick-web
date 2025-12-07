<script setup lang="ts">
useHead({
  title: 'Terms of Service - LazyPick',
  meta: [
    { name: 'description', content: 'Terms of Service for LazyPick' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-brand-dark text-white p-6 md:p-12 relative overflow-x-hidden selection:bg-brand-red/30">
    <!-- Background Elements -->
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-red/10 blur-[120px] rounded-full pointer-events-none animate-pulse"/>
    <div class="fixed bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/5 blur-[100px] rounded-full pointer-events-none"/>
    
    <div class="max-w-4xl mx-auto relative z-10">
      <!-- Navigation -->
      <NuxtLink to="/" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-sm font-medium text-gray-400 hover:text-white mb-12 group backdrop-blur-md">
        <Icon name="heroicons:arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"/>
        <span>Back to Home</span>
      </NuxtLink>

      <!-- Header -->
      <div class="mb-12 text-center space-y-4">
        <h1 class="text-5xl md:text-7xl font-black font-display tracking-tight">
          Terms of <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-600">Service</span>
        </h1>
        <p class="text-gray-400 text-lg font-light">Last updated: December 2025</p>
      </div>

      <!-- Content Card -->
      <div class="glass rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-xl bg-black/20 border border-white/10 shadow-2xl shadow-black/50">
        <!-- Decorative sheen -->
        <div class="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"/>

        <div class="relative z-10 prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-white prose-a:text-brand-red hover:prose-a:text-brand-red/80 prose-strong:text-white prose-li:marker:text-brand-red">
          
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 rounded-lg bg-brand-red/10 border border-brand-red/20 text-brand-red">
              <Icon name="heroicons:scale" class="w-6 h-6"/>
            </div>
            <h3 class="m-0 text-2xl">1. Agreement to Terms</h3>
          </div>
          <p class="text-gray-300 leading-relaxed">
            By accessing or using LazyPick, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
          </p>

          <div class="flex items-center gap-3 mt-12 mb-6">
            <div class="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Icon name="heroicons:identification" class="w-6 h-6"/>
            </div>
            <h3 class="m-0 text-2xl">2. Use of License</h3>
          </div>
          <p class="text-gray-300 leading-relaxed">
            Permission is granted to temporarily view the materials (information or software) on LazyPick's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul class="space-y-2 text-gray-300">
            <li class="flex items-start gap-3">
              <Icon name="heroicons:x-circle" class="w-5 h-5 text-red-400 mt-1 shrink-0"/>
              <span>Modify or copy the materials;</span>
            </li>
            <li class="flex items-start gap-3">
              <Icon name="heroicons:x-circle" class="w-5 h-5 text-red-400 mt-1 shrink-0"/>
              <span>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</span>
            </li>
            <li class="flex items-start gap-3">
              <Icon name="heroicons:x-circle" class="w-5 h-5 text-red-400 mt-1 shrink-0"/>
              <span>Attempt to decompile or reverse engineer any software contained on LazyPick's website;</span>
            </li>
            <li class="flex items-start gap-3">
              <Icon name="heroicons:x-circle" class="w-5 h-5 text-red-400 mt-1 shrink-0"/>
              <span>Remove any copyright or other proprietary notations from the materials;</span>
            </li>
            <li class="flex items-start gap-3">
              <Icon name="heroicons:x-circle" class="w-5 h-5 text-red-400 mt-1 shrink-0"/>
              <span>Transfer the materials to another person or "mirror" the materials on any other server.</span>
            </li>
          </ul>

          <div class="flex items-center gap-3 mt-12 mb-6">
            <div class="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
              <Icon name="heroicons:exclamation-triangle" class="w-6 h-6"/>
            </div>
            <h3 class="m-0 text-2xl">3. Disclaimer</h3>
          </div>
          <p class="text-gray-300 leading-relaxed">
            The materials on LazyPick's website are provided on an 'as is' basis. LazyPick makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <div class="flex items-center gap-3 mt-12 mb-6">
            <div class="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Icon name="heroicons:no-symbol" class="w-6 h-6"/>
            </div>
            <h3 class="m-0 text-2xl">4. Limitations</h3>
          </div>
          <p class="text-gray-300 leading-relaxed">
            In no event shall LazyPick or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on LazyPick's website, even if LazyPick or a LazyPick authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>

          <div class="flex items-center gap-3 mt-12 mb-6">
            <div class="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
              <Icon name="heroicons:check-badge" class="w-6 h-6"/>
            </div>
            <h3 class="m-0 text-2xl">5. Accuracy of Materials</h3>
          </div>
          <p class="text-gray-300 leading-relaxed">
            The materials appearing on LazyPick's website could include technical, typographical, or photographic errors. LazyPick does not warrant that any of the materials on its website are accurate, complete or current. LazyPick may make changes to the materials contained on its website at any time without notice. However LazyPick does not make any commitment to update the materials.
          </p>

          <div class="flex items-center gap-3 mt-12 mb-6">
            <div class="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Icon name="heroicons:link" class="w-6 h-6"/>
            </div>
            <h3 class="m-0 text-2xl">6. Links</h3>
          </div>
          <p class="text-gray-300 leading-relaxed">
            LazyPick has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by LazyPick of the site. Use of any such linked website is at the user's own risk.
          </p>

          <div class="flex items-center gap-3 mt-12 mb-6">
            <div class="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <Icon name="heroicons:pencil-square" class="w-6 h-6"/>
            </div>
            <h3 class="m-0 text-2xl">7. Modifications</h3>
          </div>
          <p class="text-gray-300 leading-relaxed">
            LazyPick may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
          </p>

          <div class="flex items-center gap-3 mt-12 mb-6">
            <div class="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Icon name="heroicons:building-library" class="w-6 h-6"/>
            </div>
            <h3 class="m-0 text-2xl">8. Governing Law</h3>
          </div>
          <p class="text-gray-300 leading-relaxed">
            These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>

        </div>
      </div>
    </div>
  </div>
</template>
