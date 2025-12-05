// server/api/lazypick/feedback.post.ts


import {serverSupabaseClient, serverSupabaseUser} from "~~/server/utils/supabase";

export default defineEventHandler(async (event) => {
    // 1. Initialize Supabase on the server
    const client = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)

    // Security: Ensure user is logged in
    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    // 2. Parse the body (e.g., { "item_tags": ["horror"], "liked": true, "domain": "movies" })
    const body = await readBody(event)

    // Validate inputs (Basic check)
    if (!body.item_tags || typeof body.liked !== 'boolean') {
        throw createError({ statusCode: 400, statusMessage: 'Invalid Payload' })
    }

    // 3. Call the RPC "Brain"
    const { error } = await client.rpc('update_taste_weights', {
        p_user_id: user.id,
        p_domain: body.domain || 'general',
        p_tags: body.item_tags,
        p_liked: body.liked
    })

    if (error) {
        console.error('Learning Error:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to update profile' })
    }

    return { success: true, message: 'Taste profile updated' }
})