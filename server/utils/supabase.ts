import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getCookie } from 'h3'

export const serverSupabaseClient = async (event: any): Promise<SupabaseClient> => {
    const config = useRuntimeConfig()
    const { url, key } = config.public.supabase

    if (!url || !key) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Supabase URL or Key is missing in runtime config'
        })
    }

    // Attempt to get the session from cookies
    const accessToken = getCookie(event, 'sb-access-token')
    const refreshToken = getCookie(event, 'sb-refresh-token')

    const client = createClient(url, key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
    })

    if (accessToken && refreshToken) {
        await client.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
        })
    }

    return client
}

export const serverSupabaseUser = async (event: any) => {
    const client = await serverSupabaseClient(event)
    const { data: { user }, error } = await client.auth.getUser()

    if (error || !user) {
        return null
    }

    return user
}
