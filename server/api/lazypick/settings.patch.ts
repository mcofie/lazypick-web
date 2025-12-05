import {serverSupabaseClient, serverSupabaseUser} from "~~/server/utils/supabase";

export default defineEventHandler(async (event) => {
    const _client = await serverSupabaseClient(event)
    const _user = await serverSupabaseUser(event)

    const _body = await readBody(event)
    // Body: { "domain": "food", "key": "allergies", "value": ["peanuts"] }

    // Note: You might need to adjust your JSON structure to separate "Weights" (0-1) from "Filters" (Arrays)
    // For now, let's assume you store filters in a separate key in your JSON column.

    // Logic to update the specific JSON path for constraints...
    // (Implementation depends on your exact JSON preference structure)

    return { success: true }
})