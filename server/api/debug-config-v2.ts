
export default defineEventHandler((_event) => {
    const config = useRuntimeConfig()
    return {
        publicKeys: Object.keys(config.public),
        supabaseConfig: config.public.supabase,
        env: {
            SUPABASE_URL: process.env.SUPABASE_URL ? 'Set' : 'Unset',
            SUPABASE_KEY: process.env.SUPABASE_KEY ? 'Set' : 'Unset'
        }
    }
})
