import {serverSupabaseClient, serverSupabaseUser} from "~~/server/utils/supabase";


export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)

    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const body = await readBody(event)

    // Example Body:
    // {
    //   "global": { "price_sensitivity": 3, "adventure_score": 0.8 },
    //   "food": { "spicy": 0.9, "vegan": 1.0, "fast-food": 0.1 },
    //   "movies": { "horror": 0.0, "rom-com": 0.8 }
    // }

    // We update the taste_matrices table directly with these "Seed Weights"
    const { error } = await client
        .from('taste_matrices')
        .update({
            global_prefs: body.global,
            domain_weights: {
                food: body.food,
                movies: body.movies
            }
        })
        .eq('user_id', user.id)

    if (error) throw createError({ statusCode: 500, statusMessage: error.message })

    return { success: true, message: 'Profile seeded successfully' }
})