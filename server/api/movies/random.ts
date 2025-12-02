import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (_event) => {
    const config = useRuntimeConfig()
    const apiKey = config.tmdbApiKey

    // 1. Get total pages for Netflix (Provider 8) in Ghana (GH)
    const discoveryUrl = 'https://api.themoviedb.org/3/discover/movie'
    const baseParams = new URLSearchParams({
        api_key: apiKey,
        include_adult: 'false',
        watch_region: 'GH',
        with_watch_providers: '8', // Netflix
        language: 'en-US',
        sort_by: 'popularity.desc'
    })

    interface TMDBMovie {
        id: number
        title: string
        overview: string
        poster_path: string
        backdrop_path: string
        vote_average: number
        release_date: string
    }

    try {
        // Pick a random page (limit to top 20 pages to ensure quality)
        const randomPage = Math.floor(Math.random() * 20) + 1
        baseParams.append('page', randomPage.toString())

        // 2. Fetch the movies from that page
        const data = await $fetch<{ results: TMDBMovie[] }>(`${discoveryUrl}?${baseParams.toString()}`)
        const movies = data.results

        if (!movies.length) throw new Error("No movies found")

        // 3. Pick one random movie
        const movie = movies[Math.floor(Math.random() * movies.length)]

        if (!movie) throw new Error("Failed to pick a movie")

        return {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`,
            rating: movie.vote_average,
            year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
            // Universal Netflix Search Link (safest bet without specific Netflix IDs)
            netflixUrl: `https://www.netflix.com/search?q=${encodeURIComponent(movie.title)}`
        }

    } catch {
        throw createError({ statusCode: 500, statusMessage: 'Could not fetch movie' })
    }
})