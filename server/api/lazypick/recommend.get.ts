// server/api/lazypick/recommend.get.ts


import {serverSupabaseClient, serverSupabaseUser} from "~~/server/utils/supabase";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)

    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    // 1. Get Query Params (e.g., ?domain=food&adventure=true)
    const query = getQuery(event)
    const domain = query.domain as string || 'food'
    const adventureMode = query.adventure === 'true' // Convert string to boolean

    // 2. Call the RPC "Retrieval"
    const { data, error } = await client.rpc('get_recommendations', {
        p_user_id: user.id,
        p_domain: domain,
        p_limit: 5,
        p_adventure_mode: adventureMode
    })

    if (error) {
        console.error('Recommendation Error:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch picks' })
    }

    return {
        suggestions: data,
        meta: {
            mode: adventureMode ? 'adventure' : 'safe',
            domain: domain
        }
    }
})