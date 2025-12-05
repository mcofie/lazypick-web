import {serverSupabaseClient, serverSupabaseUser} from "~~/server/utils/supabase";


export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)

    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const { data, error } = await client
        .from('taste_matrices')
        .select('global_prefs, domain_weights')
        .eq('user_id', user.id)
        .single()

    if (error) throw createError({ statusCode: 404, statusMessage: 'Profile not found' })

    return { profile: data }
})