import { defineEventHandler, getQuery, createError } from 'h3'

interface TMDBMovie {
    id: number
    title: string
    overview: string
    poster_path: string
    vote_average: number
    release_date: string
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const apiKey = config.tmdbApiKey
    const query = getQuery(event)
    const mood = query.mood as string || 'curious'
    const region = query.region as string || 'GH'
    const locale = query.locale as string || 'en'
    const providers = query.providers as string || '8' // Default to Netflix

    // TMDB Genre IDs
    // Action: 28, Comedy: 35, Drama: 18, Horror: 27, Romance: 10749, Sci-Fi: 878, Doc: 99

    let genreString = ''

    // VIBE MAPPING LOGIC
    switch (mood) {
        case 'chill':
            genreString = '35|99|10751' // Comedy OR Documentary OR Family
            break
        case 'lit':
            genreString = '28|12|878' // Action OR Adventure OR Sci-Fi
            break
        case 'sad':
            genreString = '18|10749' // Drama OR Romance
            break
        case 'romantic':
            genreString = '10749' // Romance
            break
        case 'hungry':
            // Movies about food? Or just light hearted stuff
            genreString = '35|16' // Comedy OR Animation
            break
        default:
            genreString = '' // Any genre
    }

    // Map locale to TMDB language
    const languageMap: Record<string, string> = {
        'en': 'en-US',
        'fr': 'fr-FR',
        'es': 'es-ES'
    }
    const tmdbLang = languageMap[locale] || 'en-US'

    const discoveryUrl = 'https://api.themoviedb.org/3/discover/movie'
    const params = new URLSearchParams({
        api_key: apiKey,
        include_adult: 'false',
        watch_region: region,
        with_watch_providers: providers, // <--- DYNAMIC PROVIDERS
        language: tmdbLang,
        sort_by: 'popularity.desc',
        with_genres: genreString // <--- FILTER APPLIED HERE
    })

    try {
        // ... (Keep the rest of your pagination logic mostly the same) ...
        // NOTE: When filtering by specific genres, available pages might drop.
        // Always fetch page 1 first to check 'total_pages' before randomizing.

        const meta = await $fetch<{ total_pages: number }>(`${discoveryUrl}?${params.toString()}`)
        const maxPages = meta.total_pages > 10 ? 10 : meta.total_pages

        if (maxPages === 0) throw new Error("No movies for this vibe")

        const randomPage = Math.floor(Math.random() * maxPages) + 1
        params.append('page', randomPage.toString())

        const data = await $fetch<{ results: TMDBMovie[] }>(`${discoveryUrl}?${params.toString()}`)
        const movies = data.results

        if (!movies.length) throw new Error("No movies found")
        const movie = movies[Math.floor(Math.random() * movies.length)]
        if (!movie) throw new Error("No movie selected")

        // Fetch Watch Providers
        let providerInfo = null
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const providerData = await $fetch<{ results: Record<string, { flatrate?: any[] }> }>(`https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${apiKey}`)
            const regionProviders = providerData.results[region]

            if (regionProviders && regionProviders.flatrate) {
                // If user filtered by providers, try to match one of them
                if (providers) {
                    const userProviders = providers.split('|') // '8|9' -> ['8', '9']
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const match = regionProviders.flatrate.find((p: any) => userProviders.includes(p.provider_id.toString()))
                    if (match) providerInfo = match
                }

                // Fallback: just take the first one if no match or no filter
                if (!providerInfo) {
                    providerInfo = regionProviders.flatrate[0]
                }
            }
        } catch {
            // Ignore provider fetch errors, just don't show logo
        }

        // Generate Smart Watch Link
        let watchUrl = `https://www.google.com/search?q=watch+${encodeURIComponent(movie.title)}`

        if (providerInfo) {
            const pid = providerInfo.provider_id.toString()
            const encodedTitle = encodeURIComponent(movie.title)

            if (pid === '8') watchUrl = `https://www.netflix.com/search?q=${encodedTitle}`
            else if (pid === '9') watchUrl = `https://www.amazon.com/s?k=${encodedTitle}`
            else if (pid === '337') watchUrl = `https://www.disneyplus.com/search?q=${encodedTitle}`
            else if (pid === '350') watchUrl = `https://tv.apple.com/search?term=${encodedTitle}`
        }

        return {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            rating: movie.vote_average,
            year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
            watchUrl, // <--- Dynamic URL
            provider: providerInfo ? {
                name: providerInfo.provider_name,
                logo: `https://image.tmdb.org/t/p/original${providerInfo.logo_path}`
            } : null
        }
    } catch {
        throw createError({ statusCode: 404, statusMessage: 'No movies found for this mood' })
    }
})