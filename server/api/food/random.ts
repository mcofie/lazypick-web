import {defineEventHandler, getQuery} from 'h3'

// Updated list with 'moods'
const restaurants = [
    {id: 1, name: "Buka Restaurant", cuisine: "Local", area: "Osu", image: "...", moods: ['hungry', 'chill']},
    {id: 2, name: "Santoku", cuisine: "Japanese", area: "Villagio", image: "...", moods: ['romantic', 'lit']},
    {id: 3, name: "Papaye", cuisine: "Fast Food", area: "Osu", image: "...", moods: ['hungry', 'lazy']},
    {
        id: 4,
        name: "Burger & Relish",
        cuisine: "Burgers",
        area: "East Legon",
        image: "...",
        moods: ['chill', 'lit', 'hungry']
    },
    {id: 5, name: "Pinocchio Gelato", cuisine: "Dessert", area: "Osu", image: "...", moods: ['sad', 'romantic']},
    {id: 6, name: "Sandbox Beach", cuisine: "Beach Club", area: "Labadi", image: "...", moods: ['lit', 'romantic']},
    {id: 7, name: "KFC", cuisine: "Fast Food", area: "Everywhere", image: "...", moods: ['hungry', 'lazy', 'sad']}
]

export default defineEventHandler((event) => {
    const query = getQuery(event)
    const mood = query.mood as string

    // FILTER LOGIC
    let filtered = restaurants

    if (mood && mood !== 'curious') {
        filtered = restaurants.filter(r => r.moods.includes(mood))
    }

    // Fallback if filter is too strict
    if (filtered.length === 0) filtered = restaurants

    const random = filtered[Math.floor(Math.random() * filtered.length)]

    return {
        id: random.id,
        title: random.name,
        overview: `${random.cuisine} • ${random.area}`,
        poster: random.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80",
        rating: 4.5,
        year: "Open",
        netflixUrl: `https://www.google.com/search?q=${encodeURIComponent(random.name + " menu accra")}`
    }
})