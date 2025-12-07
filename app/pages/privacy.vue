<script setup lang="ts">
useHead({
  title: 'Privacy Policy - LazyPick',
  meta: [
    { name: 'description', content: 'Privacy Policy for LazyPick' }
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
          Privacy <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-600">Policy</span>
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
              <Icon name="heroicons:shield-check" class="w-6 h-6"/>
            </div>
            <h3 class="m-0 text-2xl">1. Introduction</h3>
          </div>
          <p class="text-gray-300 leading-relaxed">
            Welcome to LazyPick ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>

          <div class="flex items-center gap-3 mt-12 mb-6">
            <div class="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Icon name="heroicons:document-text" class="w-6 h-6"/>
            </div>
            <h3 class="m-0 text-2xl">2. Information We Collect</h3>
          </div>
          <p class="text-gray-300 leading-relaxed">
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
          </p>
          <ul class="grid md:grid-cols-2 gap-4 list-none pl-0 mt-6">
            <li class="bg-white/5 rounded-xl p-4 border border-white/5">
              <strong class="block text-white mb-1 text-sm uppercase tracking-wider">Identity Data</strong>
              <span class="text-sm text-gray-400">Includes username or similar identifier if you create an account.</span>
            </li>
            <li class="bg-white/5 rounded-xl p-4 border border-white/5">
              <strong class="block text-white mb-1 text-sm uppercase tracking-wider">Contact Data</strong>
              <span class="text-sm text-gray-400">Includes email address and contact preferences.</span>
            </li>
            <li class="bg-white/5 rounded-xl p-4 border border-white/5">
              <strong class="block text-white mb-1 text-sm uppercase tracking-wider">Usage Data</strong>
              <span class="text-sm text-gray-400">Information about how you use our website, products and services.</span>
            </li>
            <li class="bg-white/5 rounded-xl p-4 border border-white/5">
              <strong class="block text-white mb-1 text-sm uppercase tracking-wider">Technical Data</strong>
              <span class="text-sm text-gray-400">IP address, browser type, device info, and time zone settings.</span>
            </li>
          </ul>

          <div class="flex items-center gap-3 mt-12 mb-6">
            <div class="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
              <Icon name="heroicons:server-stack" class="w-6 h-6"/>
            </div>
            <h3 class="m-0 text-2xl">3. How We Use Your Data</h3>
          </div>
          <p class="text-gray-300 leading-relaxed">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul class="space-y-2 text-gray-300">
            <li class="flex items-start gap-3">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-brand-red mt-1 shrink-0"/>
              <span>To provide the services you have requested, such as creating a squad or saving a watchlist.</span>
            </li>
            <li class="flex items-start gap-3">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-brand-red mt-1 shrink-0"/>
              <span>To improve our website and services through analytics and feedback.</span>
            </li>
            <li class="flex items-start gap-3">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-brand-red mt-1 shrink-0"/>
              <span>To comply with a legal or regulatory obligation.</span>
            </li>
          </ul>

          <div class="flex items-center gap-3 mt-12 mb-6">
            <div class="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Icon name="heroicons:lock-closed" class="w-6 h-6"/>
            </div>
            <h3 class="m-0 text-2xl">4. Data Security</h3>
          </div>
          <p class="text-gray-300 leading-relaxed">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
          </p>

          <div class="flex items-center gap-3 mt-12 mb-6">
            <div class="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
              <Icon name="heroicons:link" class="w-6 h-6"/>
            </div>
            <h3 class="m-0 text-2xl">5. Third-Party Links</h3>
          </div>
          <p class="text-gray-300 leading-relaxed">
            This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
          </p>

          <div class="flex items-center gap-3 mt-12 mb-6">
            <div class="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <Icon name="heroicons:envelope" class="w-6 h-6"/>
            </div>
            <h3 class="m-0 text-2xl">6. Contact Us</h3>
          </div>
          <p class="text-gray-300 leading-relaxed">
            If you have any questions about this privacy policy or our privacy practices, please contact us at <a href="mailto:support@lazypick.com" class="no-underline text-brand-red hover:text-white transition-colors">support@lazypick.com</a>.
          </p>

        </div>
      </div>
    </div>
  </div>
</template>
