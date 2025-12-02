// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // 1. Activate Modules
    modules: [
        '@nuxtjs/tailwindcss',
        '@vite-pwa/nuxt',
        '@nuxt/icon',
        '@vueuse/nuxt',
        '@nuxt/eslint'
    ],
    css: ['~/assets/css/main.css'],

    // 2. Head Configuration (SEO & Mobile feel)
    app: {
        head: {
            titleTemplate: '%s - LazyPick',
            title: 'LazyPick',
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
                { name: 'description', content: 'Stop scrolling. Start watching. The decision tool for Ghana.' },
                { name: 'theme-color', content: '#050505' },
                // Open Graph
                { property: 'og:title', content: 'LazyPick - Decisions made easy' },
                { property: 'og:description', content: 'Stop scrolling. Start watching. The decision tool for Ghana.' },
                { property: 'og:type', content: 'website' },
                { property: 'og:url', content: 'https://lazypick.vercel.app' }, // Assuming URL or placeholder
                { property: 'og:image', content: 'https://lazypick.vercel.app/og-image.png' }, // Placeholder
                // Twitter
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:title', content: 'LazyPick - Decisions made easy' },
                { name: 'twitter:description', content: 'Stop scrolling. Start watching. The decision tool for Ghana.' },
                { name: 'twitter:image', content: 'https://lazypick.vercel.app/og-image.png' }
            ],
            link: [
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@400;700;900&display=swap'
                }
            ]
        }
    },

    // 3. PWA Configuration (The "App" Magic)
    pwa: {
        manifest: {
            name: 'LazyPick',
            short_name: 'LazyPick',
            theme_color: '#000000',
            background_color: '#000000',
            display: 'standalone', // Hides browser bar
            orientation: 'portrait',
            scope: '/',
            start_url: '/',
            icons: [
                {
                    src: 'icon-192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: 'icon-512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ]
        },
        workbox: {
            navigateFallback: '/',
            globPatterns: ['**/*.{js,css,html,png,svg,ico}'] // Cache these for offline use
        },
        devOptions: {
            enabled: true, // Test PWA in development
            type: 'module'
        },
    },
    runtimeConfig: {
        tmdbApiKey: process.env.TMDB_API_KEY, // Server-side only (secure)
        public: {
            posthogPublicKey: 'phc_is230XlvYV94NtCaEofDBRdKjMypkmAi1xi1Cu7gcQ',
            posthogHost: 'https://us.i.posthog.com',
            posthogDefaults: '2025-11-30',
            supabase: {
                url: process.env.SUPABASE_URL || '',
                key: process.env.SUPABASE_KEY || ''
            }
        }
    },
    experimental: {
        payloadExtraction: true
    },
    nitro: {
        compressPublicAssets: true
    }
})