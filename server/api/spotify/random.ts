import { defineEventHandler, getQuery, createError } from 'h3'

interface SpotifyItem {
    id: string
    name: string
    subtitle: string // Artist or Owner
    image: string
    url: string
    type: 'track' | 'album' | 'playlist'
}

const MOCK_DB: Record<string, SpotifyItem[]> = {
    chill: [
        { id: '1', name: 'Lofi Beats', subtitle: 'Spotify Studios', image: 'https://i.scdn.co/image/ab67706f0000000354a67d30d635e6129f7f0273', url: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn', type: 'playlist' },
        { id: '2', name: 'Night Trouble', subtitle: 'Petit Biscuit', image: 'https://i.scdn.co/image/ab67616d0000b273063fc49219c025816964cc94', url: 'https://open.spotify.com/track/5LLtNp8qc3NaCIieNwikWq', type: 'track' },
        { id: '3', name: 'Peaceful Piano', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f00000003ca5a7517156021292e5663a6', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO', type: 'playlist' }
    ],
    lit: [
        { id: '4', name: 'RapCaviar', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f000000039249b35f23fb696b4b006aac', url: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd', type: 'playlist' },
        { id: '5', name: 'ASTROWORLD', subtitle: 'Travis Scott', image: 'https://i.scdn.co/image/ab67616d0000b273072e9faef2ef7b6db63834a3', url: 'https://open.spotify.com/album/41GuZcammIkupWk2G42BdH', type: 'album' },
        { id: '6', name: 'Beast Mode', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f000000035d7423450e181559771144f8', url: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP', type: 'playlist' }
    ],
    sad: [
        { id: '7', name: 'Life Sucks', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f00000003a55a8927016333f26941783d', url: 'https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634', type: 'playlist' },
        { id: '8', name: 'Blonde', subtitle: 'Frank Ocean', image: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526', url: 'https://open.spotify.com/album/3mH6qwIy9crq0I9YQbOuDf', type: 'album' },
        { id: '9', name: 'Broken Heart', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f000000035a0c27943580b56f89076043', url: 'https://open.spotify.com/playlist/37i9dQZF1DX6pGi5vfd9k8', type: 'playlist' }
    ],
    romantic: [
        { id: '10', name: 'Romantic Mix', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f00000003bd0e19e810bb4b55ab164a95', url: 'https://open.spotify.com/playlist/37i9dQZF1EIdChYeHNDfK5', type: 'playlist' },
        { id: '11', name: 'Divide', subtitle: 'Ed Sheeran', image: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96', url: 'https://open.spotify.com/album/3T4tUhGYeRNVUGevb0wThu', type: 'album' },
        { id: '12', name: 'Love Pop', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f000000032195a92a5d9a972b904e2297', url: 'https://open.spotify.com/playlist/37i9dQZF1DX50QitC6McUH', type: 'playlist' }
    ],
    hungry: [
        { id: '13', name: 'Cooking & Dining', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f00000003d073e656e546e43bc387ad79', url: 'https://open.spotify.com/playlist/37i9dQZF1DWT7oSlhX838D', type: 'playlist' },
        { id: '14', name: 'Dinner with Friends', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f0000000336283d5a4e8d24b6113b23b1', url: 'https://open.spotify.com/playlist/37i9dQZF1DX428WXDcQ523', type: 'playlist' },
        { id: '15', name: 'Italian Dinner', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f000000036492737603378b8712398d6c', url: 'https://open.spotify.com/playlist/37i9dQZF1DX67Zf31b45Kx', type: 'playlist' }
    ],
    curious: [
        { id: '16', name: 'Discover Weekly', subtitle: 'Spotify', image: 'https://newjams-images.scdn.co/image/ab676477000033ad/dt/v3/discover-weekly/aAbca4VNfzWuUCQ_FGiEFA==/bmVuZW5lbmVuZW5lbmVuZQ==', url: 'https://open.spotify.com/playlist/37i9dQZEVXcQ9COmYvdajy', type: 'playlist' },
        { id: '17', name: 'Dark Side of the Moon', subtitle: 'Pink Floyd', image: 'https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe', url: 'https://open.spotify.com/album/4LH4d3cOWNNsVw41Gqt2kv', type: 'album' },
        { id: '18', name: 'Deep Focus', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f000000035551996f500ba876b6537191', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ', type: 'playlist' }
    ]
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const mood = query.mood as string || 'chill'

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const items = MOCK_DB[mood] || MOCK_DB['chill']
    const item = items[Math.floor(Math.random() * items.length)]

    return {
        id: item.id,
        title: item.name,
        overview: `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} • ${item.subtitle}`,
        poster: item.image,
        rating: (Math.random() * 2) + 8, // Random rating between 8 and 10
        year: '2024',
        watchUrl: item.url,
        provider: {
            name: 'Spotify',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg'
        }
    }
})
