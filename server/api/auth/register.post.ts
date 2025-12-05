import {serverSupabaseClient} from "~~/server/utils/supabase";


export default defineEventHandler(async (event) => {
    // 1. We use the server client to interact with Supabase
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    // 2. Validate Input (Basic Example)
    if (!body.email || !body.password || !body.name) {
        throw createError({ statusCode: 400, statusMessage: 'Missing fields' })
    }

    // 3. Create User
    // Note: 'options.data' is critical. This passes the name to your Postgres Trigger.
    const { data, error } = await client.auth.signUp({
        email: body.email,
        password: body.password,
        options: {
            data: {
                full_name: body.name
            }
        }
    })

    if (error) {
        throw createError({ statusCode: 400, statusMessage: error.message })
    }

    // 4. Return Success
    // If email confirmation is on, Supabase returns a user but session is null.
    return {
        success: true,
        user_id: data.user?.id,
        message: 'Check your email to confirm account.'
    }
})