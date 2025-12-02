/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",
    ],
    theme: {
        extend: {
            colors: {
                'brand-dark': '#0F0F0F', // Netflix-ish background
                'brand-red': '#E50914',  // Accent color
                'brand-card': '#1A1A1A',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // We will add the font link next
            }
        },
    },
    plugins: [],
}