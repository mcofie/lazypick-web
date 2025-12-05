
import { createClient } from '@supabase/supabase-js'

import type { SupabaseClient } from '@supabase/supabase-js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseInstance: SupabaseClient<any, "lazypick", any> | null = null

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
