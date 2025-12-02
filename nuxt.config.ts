// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },

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
            title: 'LazyPick',
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' }, // Prevents zooming on mobile
                { name: 'description', content: 'Stop scrolling. Start watching. The decision tool for Ghana.' },
                { name: 'theme-color', content: '#000000' }
            ],
            link: [
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
                { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@400;700;900&display=swap' }
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
    }
})