import type { IDecider, DecisionResult } from '~/types/decider'

export class MovieDecider implements IDecider {
    id = 'movie'
    label = 'Watch Something'
    icon = 'heroicons:film'

    async spin(): Promise<DecisionResult> {
        // 1. Fetch data from our internal API (which we will build next)
        // We use $fetch which is native to Nuxt
        const response = await $fetch('/api/movies/random')

        // 2. Map the API response to our generic Decision format
        return {
            id: response.id,
            title: response.title,
            description: response.overview,
            imageUrl: `https://image.tmdb.org/t/p/w500${response.poster_path}`,
            actionLabel: 'Watch on Netflix',
            actionUrl: `https://www.netflix.com/search?q=${encodeURIComponent(response.title)}`,
            provider: 'Netflix'
        }
    }
}