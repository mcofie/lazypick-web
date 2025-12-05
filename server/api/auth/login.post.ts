import {serverSupabaseClient} from "~~/server/utils/supabase";


export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    if (!body.email || !body.password) {
        throw createError({ statusCode: 400, statusMessage: 'Email and password required' })
    }

    const { data, error } = await client.auth.signInWithPassword({
        email: body.email,
        password: body.password
    })

    if (error) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }

    return { success: true, user: data.user }
})