import { defineEventHandler } from 'h3'

export default defineEventHandler(async (_event) => {
    return { message: "It works!" } // Test this simple return first
})