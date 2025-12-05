<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'API Documentation'
})

interface EndpointParam {
  name: string
  type: string
  required: boolean
  description: string
  value?: any // For "Try it out"
}

interface Endpoint {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  path: string
  summary: string
  authRequired: boolean
  body?: EndpointParam[]
  query?: EndpointParam[]
  response: string
}

const endpoints = ref<Record<string, Endpoint[]>>({
  Auth: [
    {
      method: 'POST',
      path: '/api/auth/login',
      summary: 'Log in a user',
      authRequired: false,
      body: [
        { name: 'email', type: 'string', required: true, description: 'User email', value: '' },
        { name: 'password', type: 'string', required: true, description: 'User password', value: '' }
      ],
      response: '{\n  "success": true,\n  "user": { ... }\n}'
    },
    {
      method: 'POST',
      path: '/api/auth/register',
      summary: 'Register a new user',
      authRequired: false,
      body: [
        { name: 'email', type: 'string', required: true, description: 'User email', value: '' },
        { name: 'password', type: 'string', required: true, description: 'User password', value: '' },
        { name: 'name', type: 'string', required: true, description: 'Full name', value: '' }
      ],
      response: '{\n  "success": true,\n  "user_id": "...",\n  "message": "Check your email..."\n}'
    },
    {
      method: 'POST',
      path: '/api/auth/logout',
      summary: 'Log out the current user',
      authRequired: true,
      response: '{\n  "success": true\n}'
    }
  ],
  Lazypick: [
    {
      method: 'POST',
      path: '/api/lazypick/feedback',
      summary: 'Submit user feedback for learning',
      authRequired: true,
      body: [
        { name: 'item_tags', type: 'string[]', required: true, description: 'Tags of the item', value: '[]' },
        { name: 'liked', type: 'boolean', required: true, description: 'Whether the user liked it', value: false },
        { name: 'domain', type: 'string', required: false, description: 'Domain (default: general)', value: 'general' }
      ],
      response: '{\n  "success": true,\n  "message": "Taste profile updated"\n}'
    },
    {
      method: 'POST',
      path: '/api/lazypick/onboarding',
      summary: 'Seed user profile with initial preferences',
      authRequired: true,
      body: [
        { name: 'global', type: 'object', required: true, description: 'Global preferences', value: '{}' },
        { name: 'food', type: 'object', required: true, description: 'Food domain weights', value: '{}' },
        { name: 'movies', type: 'object', required: true, description: 'Movie domain weights', value: '{}' }
      ],
      response: '{\n  "success": true,\n  "message": "Profile seeded successfully"\n}'
    },
    {
      method: 'GET',
      path: '/api/lazypick/profile',
      summary: 'Get user taste profile',
      authRequired: true,
      response: '{\n  "profile": {\n    "global_prefs": { ... },\n    "domain_weights": { ... }\n  }\n}'
    },
    {
      method: 'GET',
      path: '/api/lazypick/recommend',
      summary: 'Get recommendations based on profile',
      authRequired: true,
      query: [
        { name: 'domain', type: 'string', required: false, description: 'Domain (default: food)', value: 'food' },
        { name: 'adventure', type: 'boolean', required: false, description: 'Enable adventure mode', value: false }
      ],
      response: '{\n  "suggestions": [ ... ],\n  "meta": { ... }\n}'
    },
    {
      method: 'PATCH',
      path: '/api/lazypick/settings',
      summary: 'Update user settings',
      authRequired: true,
      body: [
        { name: 'domain', type: 'string', required: true, description: 'Target domain', value: '' },
        { name: 'key', type: 'string', required: true, description: 'Setting key', value: '' },
        { name: 'value', type: 'any', required: true, description: 'New value', value: '' }
      ],
      response: '{\n  "success": true\n}'
    }
  ]
})

const methodColors: Record<string, string> = {
  GET: 'text-blue-600 bg-blue-50 border-blue-200',
  POST: 'text-green-600 bg-green-50 border-green-200',
  PATCH: 'text-amber-600 bg-amber-50 border-amber-200',
  DELETE: 'text-red-600 bg-red-50 border-red-200'
}

// State
const selectedEndpoint = ref<Endpoint | null>(endpoints.value['Auth'][0])
const testResponse = ref<any>(null)
const testLoading = ref(false)
const copiedEndpoint = ref<string | null>(null)

// Select endpoint
const selectEndpoint = (endpoint: Endpoint) => {
  selectedEndpoint.value = endpoint
  testResponse.value = null
}

const executeRequest = async () => {
  if (!selectedEndpoint.value) return
  
  testLoading.value = true
  testResponse.value = null

  try {
    const endpoint = selectedEndpoint.value
    const options: any = {
      method: endpoint.method
    }

    if (endpoint.body) {
      const bodyData: any = {}
      endpoint.body.forEach(p => {
        if (p.type.includes('object') || p.type.includes('[]')) {
          try {
            bodyData[p.name] = typeof p.value === 'string' ? JSON.parse(p.value) : p.value
          } catch {
            bodyData[p.name] = p.value
          }
        } else {
          bodyData[p.name] = p.value
        }
      })
      options.body = bodyData
    }

    if (endpoint.query) {
      const queryData: any = {}
      endpoint.query.forEach(p => {
        if (p.value !== undefined && p.value !== '') {
          queryData[p.name] = p.value
        }
      })
      options.query = queryData
    }

    const res = await $fetch(endpoint.path, options)
    testResponse.value = { status: 200, data: res }
  } catch (err: any) {
    testResponse.value = { status: err.statusCode || 500, error: err.statusMessage || err.message, data: err.data }
  } finally {
    testLoading.value = false
  }
}

const generateCurl = (endpoint: Endpoint) => {
  let cmd = `curl -X ${endpoint.method} "https://lazypick.vercel.app${endpoint.path}`
  
  if (endpoint.query) {
    const params = endpoint.query.filter(p => p.value).map(p => `${p.name}=${encodeURIComponent(p.value)}`).join('&')
    if (params) cmd += `?${params}`
  }
  
  cmd += '"'

  if (endpoint.authRequired) {
    cmd += ' \\\n  -H "Authorization: Bearer YOUR_TOKEN"'
  }

  if (endpoint.body) {
    cmd += ' \\\n  -H "Content-Type: application/json"'
    const bodyData: any = {}
    endpoint.body.forEach(p => bodyData[p.name] = p.value || (p.type.includes('[]') ? [] : p.type.includes('object') ? {} : 'VALUE'))
    cmd += ` \\\n  -d '${JSON.stringify(bodyData)}'`
  }

  return cmd
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  copiedEndpoint.value = 'true'
  setTimeout(() => {
    copiedEndpoint.value = null
  }, 2000)
}

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen bg-white text-gray-900 font-sans flex">
    
    <!-- Left Sidebar (Navigation) -->
    <aside class="w-64 fixed inset-y-0 left-0 border-r border-gray-200 bg-gray-50/50 backdrop-blur-xl z-30 overflow-y-auto hidden lg:block">
      <div class="p-6 sticky top-0 bg-gray-50/95 backdrop-blur z-10 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center shadow-lg shadow-brand-red/20 text-white">
            <Icon name="ph:code-bold" />
          </div>
          <span class="font-bold tracking-tight">API Reference</span>
        </div>
      </div>
      
      <nav class="p-4 space-y-8" aria-label="API Navigation">
        <div v-for="(groupEndpoints, groupName) in endpoints" :key="groupName">
          <h3 class="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{{ groupName }}</h3>
          <ul class="space-y-0.5">
            <li v-for="endpoint in groupEndpoints" :key="endpoint.path">
              <button @click="selectEndpoint(endpoint); scrollTo(endpoint.path)"
                      :class="['w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center gap-2',
                        selectedEndpoint === endpoint ? 'bg-white shadow-sm text-brand-red font-medium ring-1 ring-black/5' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900']">
                 <span :class="['w-1.5 h-1.5 rounded-full', 
                    endpoint.method === 'GET' ? 'bg-blue-500' : 
                    endpoint.method === 'POST' ? 'bg-green-500' : 
                    endpoint.method === 'PATCH' ? 'bg-amber-500' : 
                    'bg-red-500']"></span>
                <span class="truncate">{{ endpoint.summary }}</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>

    <!-- Main Content Area (Center + Right) -->
    <div class="flex-1 lg:ml-64 flex flex-col xl:flex-row min-w-0">
      
      <!-- Center Column (Prose) -->
      <main class="flex-1 min-w-0 py-12 px-6 md:px-12 xl:px-16 max-w-3xl mx-auto xl:mx-0">
        <header class="mb-16">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 mb-4">Introduction</h1>
          <p class="text-lg text-gray-600 leading-relaxed">
            Welcome to the LazyPick Taste Engine API. This API allows you to integrate our advanced recommendation algorithms directly into your application.
          </p>
        </header>

        <div v-for="(groupEndpoints, groupName) in endpoints" :key="groupName" class="mb-20">
          <h2 class="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            {{ groupName }}
          </h2>

          <div class="space-y-16">
            <div v-for="endpoint in groupEndpoints" :key="endpoint.path" :id="endpoint.path" 
                 class="scroll-mt-24 group"
                 @click="selectEndpoint(endpoint)">
              
              <div class="flex items-center gap-3 mb-4">
                <span :class="['px-2.5 py-1 rounded text-xs font-bold border uppercase tracking-wide', methodColors[endpoint.method]]">
                  {{ endpoint.method }}
                </span>
                <code class="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">{{ endpoint.path }}</code>
              </div>

              <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-red transition-colors cursor-pointer">
                {{ endpoint.summary }}
              </h3>
              
              <p class="text-gray-600 leading-relaxed mb-8">
                {{ endpoint.summary }} for the current session. Requires authentication via Bearer token.
              </p>

              <!-- Parameters Table -->
              <div v-if="endpoint.body || endpoint.query" class="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div class="bg-gray-50/50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                  <Icon name="ph:sliders-horizontal" class="text-gray-400" />
                  <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Parameters</span>
                </div>
                <div class="divide-y divide-gray-100">
                  <div v-for="param in [...(endpoint.body || []), ...(endpoint.query || [])]" :key="param.name" 
                       class="p-4 hover:bg-gray-50 transition-colors">
                    <div class="flex items-baseline justify-between mb-1">
                      <div class="flex items-center gap-2">
                        <code class="text-sm font-bold text-gray-900">{{ param.name }}</code>
                        <span v-if="param.required" class="text-[10px] font-bold text-red-500 uppercase bg-red-50 px-1.5 py-0.5 rounded">Required</span>
                      </div>
                      <span class="text-xs font-mono text-gray-400">{{ param.type }}</span>
                    </div>
                    <p class="text-sm text-gray-500">{{ param.description }}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <!-- Right Column (Sticky Code Panel) -->
      <aside class="w-full xl:w-[450px] 2xl:w-[500px] bg-[#0f172a] border-l border-gray-800 xl:h-screen xl:sticky xl:top-0 overflow-y-auto text-white flex flex-col shadow-2xl">
        <div v-if="selectedEndpoint" class="flex-1 flex flex-col">
          
          <!-- Panel Header -->
          <div class="p-6 border-b border-gray-800 bg-[#0f172a]/95 backdrop-blur sticky top-0 z-10">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Request Preview</span>
              <span :class="['px-2 py-0.5 rounded text-[10px] font-bold border uppercase', 
                selectedEndpoint.method === 'GET' ? 'text-blue-400 border-blue-900 bg-blue-900/20' : 
                selectedEndpoint.method === 'POST' ? 'text-green-400 border-green-900 bg-green-900/20' : 
                selectedEndpoint.method === 'PATCH' ? 'text-amber-400 border-amber-900 bg-amber-900/20' : 
                'text-red-400 border-red-900 bg-red-900/20']">
                {{ selectedEndpoint.method }}
              </span>
            </div>
            <div class="font-mono text-xs text-gray-300 break-all bg-gray-900 p-3 rounded-lg border border-gray-800">
              https://lazypick.vercel.app{{ selectedEndpoint.path }}
            </div>
          </div>

          <!-- Code & Console -->
          <div class="p-6 space-y-8 flex-1">
            
            <!-- cURL Block -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-500 uppercase">cURL</span>
                <button @click="copyToClipboard(generateCurl(selectedEndpoint))" 
                        class="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <Icon :name="copiedEndpoint ? 'ph:check-bold' : 'ph:copy-simple'" 
                        :class="copiedEndpoint ? 'text-green-400' : ''" />
                  {{ copiedEndpoint ? 'Copied' : 'Copy' }}
                </button>
              </div>
              <div class="bg-[#1e293b] rounded-xl border border-gray-700/50 p-4 overflow-x-auto group relative">
                <pre class="text-xs font-mono text-blue-100 leading-relaxed">{{ generateCurl(selectedEndpoint) }}</pre>
              </div>
            </div>

            <!-- Interactive Inputs -->
            <div v-if="selectedEndpoint.body || selectedEndpoint.query" class="space-y-4">
              <div class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase border-b border-gray-800 pb-2">
                <Icon name="ph:sliders-horizontal" />
                <span>Test Parameters</span>
              </div>
              
              <div class="space-y-4">
                <div v-for="param in [...(selectedEndpoint.body || []), ...(selectedEndpoint.query || [])]" :key="param.name">
                  <label class="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">{{ param.name }}</label>
                  
                  <input v-if="param.type === 'boolean'" type="checkbox" v-model="param.value" 
                         class="accent-brand-red w-4 h-4 rounded bg-gray-800 border-gray-700" />
                  
                  <textarea v-else-if="param.type.includes('object') || param.type.includes('[]')" 
                            v-model="param.value"
                            class="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-brand-red focus:outline-none h-20 resize-y placeholder-gray-600 focus:bg-gray-800 transition-colors"
                            placeholder="JSON input..."></textarea>
                  
                  <input v-else type="text" v-model="param.value" 
                         class="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-red focus:outline-none placeholder-gray-600 focus:bg-gray-800 transition-colors"
                         :placeholder="param.description" />
                </div>
              </div>
            </div>

            <!-- Execute Button -->
            <button @click="executeRequest" :disabled="testLoading"
                    class="w-full bg-brand-red hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-brand-red/20 disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon v-if="testLoading" name="svg-spinners:ring-resize" />
              {{ testLoading ? 'Sending Request...' : 'Run Request' }}
            </button>

            <!-- Response -->
            <div v-if="testResponse" class="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-gray-500 uppercase">Response</span>
                <span :class="['text-[10px] font-bold px-2 py-0.5 rounded', testResponse.status >= 200 && testResponse.status < 300 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400']">
                  {{ testResponse.status }}
                </span>
              </div>
              <div class="bg-[#020617] rounded-xl border border-gray-800 p-4 max-h-80 overflow-auto scrollbar-thin scrollbar-thumb-gray-700">
                <pre class="text-xs font-mono text-green-400">{{ JSON.stringify(testResponse.data || testResponse.error, null, 2) }}</pre>
              </div>
            </div>

          </div>
        </div>
        
        <div v-else class="flex-1 flex items-center justify-center text-gray-500 p-12 text-center">
          <div>
            <Icon name="ph:cursor-click" class="text-4xl mb-4 opacity-50" />
            <p class="text-sm">Select an endpoint to view details and test requests.</p>
          </div>
        </div>
      </aside>

    </div>
  </div>
</template>
