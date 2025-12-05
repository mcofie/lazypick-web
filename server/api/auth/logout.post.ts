import {serverSupabaseClient} from "~~/server/utils/supabase";


export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)

    // This invalidates the session and clears cookies
    const { error } = await client.auth.signOut()

    if (error) {
        throw createError({ statusCode: 500, statusMessage: 'Logout failed' })
    }

    return { success: true }
})