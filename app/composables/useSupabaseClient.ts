
import { createClient } from '@supabase/supabase-js'

let supabaseInstance: any = null

export const useSupabaseClient = () => {
    const config = useRuntimeConfig()
    const { url, key } = config.public.supabase

    if (!url || !key) {
        console.error('Supabase URL or Key is missing in runtime config')
        // Return a dummy client or throw to prevent crash, but logging is better
    }

    if (!supabaseInstance && url && key) {
        supabaseInstance = createClient(url, key, {
            db: { schema: 'lazypick' }
        })
    }

    return supabaseInstance
}
