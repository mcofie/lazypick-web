import { defineEventHandler } from 'h3'

const restaurants = [
    { id: 1, name: "Buka Restaurant", cuisine: "Local / Authentic", area: "Osu", image: "https://lh3.googleusercontent.com/p/AF1QipNqYvE_..." }, // Use real or placeholder URLs
    { id: 2, name: "Burger & Relish", cuisine: "Burgers", area: "East Legon", image: "" },
    { id: 3, name: "Starbites", cuisine: "Continental", area: "Accra", image: "" },
    { id: 4, name: "KFC", cuisine: "Fast Food", area: "Everywhere", image: "" },
    { id: 5, name: "Cheezzy Pizza", cuisine: "Pizza", area: "Circle/Osu", image: "" }
    // Add more...
]

export default defineEventHandler((event) => {
    const random = restaurants[Math.floor(Math.random() * restaurants.length)]

    // Format it exactly like the Movie API response so the Card component reuses it perfectly
    return {
        id: random.id,
        title: random.name,
        overview: `${random.cuisine} • ${random.area}`,
        poster: random.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80", // Nice food fallback
        rating: 4.5,
        year: "Open",
        netflixUrl: `https://www.google.com/search?q=${encodeURIComponent(random.name + " menu accra")}`
    }
})