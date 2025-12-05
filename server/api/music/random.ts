import { defineEventHandler, getQuery, createError } from 'h3'

interface MusicItem {
    id: string
    name: string
    subtitle: string // Artist or Owner
    image: string
    url: string
    type: 'track' | 'album' | 'playlist'
    provider: 'Spotify' | 'Apple Music'
}

// --- MOCK DATA FALLBACK ---
const SPOTIFY_DB: Record<string, MusicItem[]> = {
    chill: [
        { id: 's1', name: 'Lofi Beats', subtitle: 'Spotify Studios', image: 'https://i.scdn.co/image/ab67706f0000000354a67d30d635e6129f7f0273', url: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn', type: 'playlist', provider: 'Spotify' },
        { id: 's2', name: 'Night Trouble', subtitle: 'Petit Biscuit', image: 'https://i.scdn.co/image/ab67616d0000b273063fc49219c025816964cc94', url: 'https://open.spotify.com/track/5LLtNp8qc3NaCIieNwikWq', type: 'track', provider: 'Spotify' },
        { id: 's3', name: 'Peaceful Piano', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f00000003ca5a7517156021292e5663a6', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO', type: 'playlist', provider: 'Spotify' }
    ],
    lit: [
        { id: 's4', name: 'RapCaviar', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f000000039249b35f23fb696b4b006aac', url: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd', type: 'playlist', provider: 'Spotify' },
        { id: 's5', name: 'ASTROWORLD', subtitle: 'Travis Scott', image: 'https://i.scdn.co/image/ab67616d0000b273072e9faef2ef7b6db63834a3', url: 'https://open.spotify.com/album/41GuZcammIkupWk2G42BdH', type: 'album', provider: 'Spotify' },
        { id: 's6', name: 'Beast Mode', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f000000035d7423450e181559771144f8', url: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP', type: 'playlist', provider: 'Spotify' }
    ],
    sad: [
        { id: 's7', name: 'Life Sucks', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f00000003a55a8927016333f26941783d', url: 'https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634', type: 'playlist', provider: 'Spotify' },
        { id: 's8', name: 'Blonde', subtitle: 'Frank Ocean', image: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526', url: 'https://open.spotify.com/album/3mH6qwIy9crq0I9YQbOuDf', type: 'album', provider: 'Spotify' },
        { id: 's9', name: 'Broken Heart', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f000000035a0c27943580b56f89076043', url: 'https://open.spotify.com/playlist/37i9dQZF1DX6pGi5vfd9k8', type: 'playlist', provider: 'Spotify' }
    ],
    romantic: [
        { id: 's10', name: 'Romantic Mix', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f00000003bd0e19e810bb4b55ab164a95', url: 'https://open.spotify.com/playlist/37i9dQZF1EIdChYeHNDfK5', type: 'playlist', provider: 'Spotify' },
        { id: 's11', name: 'Divide', subtitle: 'Ed Sheeran', image: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96', url: 'https://open.spotify.com/album/3T4tUhGYeRNVUGevb0wThu', type: 'album', provider: 'Spotify' },
        { id: 's12', name: 'Love Pop', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f000000032195a92a5d9a972b904e2297', url: 'https://open.spotify.com/playlist/37i9dQZF1DX50QitC6McUH', type: 'playlist', provider: 'Spotify' }
    ],
    hungry: [
        { id: 's13', name: 'Cooking & Dining', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f00000003d073e656e546e43bc387ad79', url: 'https://open.spotify.com/playlist/37i9dQZF1DWT7oSlhX838D', type: 'playlist', provider: 'Spotify' },
        { id: 's14', name: 'Dinner with Friends', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f0000000336283d5a4e8d24b6113b23b1', url: 'https://open.spotify.com/playlist/37i9dQZF1DX428WXDcQ523', type: 'playlist', provider: 'Spotify' },
        { id: 's15', name: 'Italian Dinner', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f000000036492737603378b8712398d6c', url: 'https://open.spotify.com/playlist/37i9dQZF1DX67Zf31b45Kx', type: 'playlist', provider: 'Spotify' }
    ],
    curious: [
        { id: 's16', name: 'Discover Weekly', subtitle: 'Spotify', image: 'https://newjams-images.scdn.co/image/ab676477000033ad/dt/v3/discover-weekly/aAbca4VNfzWuUCQ_FGiEFA==/bmVuZW5lbmVuZW5lbmVuZQ==', url: 'https://open.spotify.com/playlist/37i9dQZEVXcQ9COmYvdajy', type: 'playlist', provider: 'Spotify' },
        { id: 's17', name: 'Dark Side of the Moon', subtitle: 'Pink Floyd', image: 'https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe', url: 'https://open.spotify.com/album/4LH4d3cOWNNsVw41Gqt2kv', type: 'album', provider: 'Spotify' },
        { id: 's18', name: 'Deep Focus', subtitle: 'Spotify', image: 'https://i.scdn.co/image/ab67706f000000035551996f500ba876b6537191', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ', type: 'playlist', provider: 'Spotify' }
    ]
}

const APPLE_DB: Record<string, MusicItem[]> = {
    chill: [
        { id: 'a1', name: 'Chill Station', subtitle: 'Apple Music', image: 'https://is1-ssl.mzstatic.com/image/thumb/Features114/v4/01/e4/69/01e46990-c759-4156-8343-483515431668/source/600x600bb.jpg', url: 'https://music.apple.com/us/station/chill-station/ra.985484166', type: 'playlist', provider: 'Apple Music' },
        { id: 'a2', name: 'Pure Focus', subtitle: 'Apple Music', image: 'https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/24/95/24/24952406-3b8e-3665-2a29-086f84395346/source/600x600bb.jpg', url: 'https://music.apple.com/us/playlist/pure-focus/pl.a479426a87dd4b35a89a6d96794d076c', type: 'playlist', provider: 'Apple Music' }
    ],
    lit: [
        { id: 'a3', name: 'Rap Life', subtitle: 'Apple Music Hip-Hop', image: 'https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/cb/04/e7/cb04e768-4796-0b39-122f-763cb6439375/source/600x600bb.jpg', url: 'https://music.apple.com/us/playlist/rap-life/pl.abe8ba42278f4ef490e3a9fc5ec56525', type: 'playlist', provider: 'Apple Music' },
        { id: 'a4', name: 'Today\'s Hits', subtitle: 'Apple Music Hits', image: 'https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/f4/6b/a9/f46ba963-c93a-4456-806e-1952735383b4/source/600x600bb.jpg', url: 'https://music.apple.com/us/playlist/todays-hits/pl.f4d106fed2bd41149aaacabb233eb5eb', type: 'playlist', provider: 'Apple Music' }
    ],
    sad: [
        { id: 'a5', name: 'Heartbreak Pop', subtitle: 'Apple Music Pop', image: 'https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/9b/89/52/9b895269-0794-2723-68f4-602a37696c66/source/600x600bb.jpg', url: 'https://music.apple.com/us/playlist/heartbreak-pop/pl.043a2c9876a142919ef76326191c5968', type: 'playlist', provider: 'Apple Music' },
        { id: 'a6', name: 'Sad Songs', subtitle: 'Apple Music', image: 'https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/4a/04/14/4a04146c-9748-038c-3359-66b271e9d530/source/600x600bb.jpg', url: 'https://music.apple.com/us/playlist/sad-songs/pl.c51485231e6446529ae88d9744f8e4d7', type: 'playlist', provider: 'Apple Music' }
    ],
    romantic: [
        { id: 'a7', name: 'Love Songs', subtitle: 'Apple Music Pop', image: 'https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/05/2c/95/052c953f-7c42-06e7-1300-3668350d535e/source/600x600bb.jpg', url: 'https://music.apple.com/us/playlist/love-songs/pl.219ed015d96a48d2937886cbd83067d4', type: 'playlist', provider: 'Apple Music' }
    ],
    hungry: [
        { id: 'a8', name: 'Dinner Party', subtitle: 'Apple Music', image: 'https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/d1/2c/32/d12c3296-0977-88c2-3a9d-1725368d1d26/source/600x600bb.jpg', url: 'https://music.apple.com/us/playlist/dinner-party/pl.0b593f1142b84a50a2c1e7088b3f1254', type: 'playlist', provider: 'Apple Music' }
    ],
    curious: [
        { id: 'a9', name: 'New Music Daily', subtitle: 'Apple Music', image: 'https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/5d/42/f6/5d42f666-c865-6d34-0546-512123f9c56c/source/600x600bb.jpg', url: 'https://music.apple.com/us/playlist/new-music-daily/pl.2b0e6e332fdf4b7a91164da3162127b5', type: 'playlist', provider: 'Apple Music' }
    ]
}

// --- API HELPERS ---

// Spotify Auth & Search
let spotifyToken: string | null = null
let spotifyTokenExpiry: number = 0

const getSpotifyToken = async (clientId: string, clientSecret: string) => {
    if (spotifyToken && Date.now() < spotifyTokenExpiry) return spotifyToken

    try {
        const response = await $fetch<{ access_token: string, expires_in: number }>('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ grant_type: 'client_credentials' })
        })
        spotifyToken = response.access_token
        spotifyTokenExpiry = Date.now() + (response.expires_in * 1000)
        return spotifyToken
    } catch (e) {
        console.error('Spotify Auth Error:', e)
        return null
    }
}

const searchSpotify = async (query: string, token: string): Promise<MusicItem | null> => {
    try {
        // Search for playlists first as they are better for "moods"
        const response = await $fetch<any>(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist,album&limit=5`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const items = [...(response.playlists?.items || []), ...(response.albums?.items || [])]
        if (!items.length) return null

        const item = items[Math.floor(Math.random() * items.length)]
        return {
            id: item.id,
            name: item.name,
            subtitle: item.owner?.display_name || item.artists?.[0]?.name || 'Spotify',
            image: item.images?.[0]?.url || '',
            url: item.external_urls?.spotify || '',
            type: item.type,
            provider: 'Spotify'
        }
    } catch (e) {
        console.error('Spotify Search Error:', e)
        return null
    }
}

// Apple Music Search
const searchAppleMusic = async (query: string, token: string): Promise<MusicItem | null> => {
    try {
        const response = await $fetch<any>(`https://api.music.apple.com/v1/catalog/us/search?term=${encodeURIComponent(query)}&types=playlists,albums&limit=5`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const playlists = response.results?.playlists?.data || []
        const albums = response.results?.albums?.data || []
        const items = [...playlists, ...albums]

        if (!items.length) return null

        const item = items[Math.floor(Math.random() * items.length)]
        const attributes = item.attributes
        return {
            id: item.id,
            name: attributes.name,
            subtitle: attributes.curatorName || attributes.artistName || 'Apple Music',
            image: attributes.artwork?.url?.replace('{w}', '600').replace('{h}', '600') || '',
            url: attributes.url,
            type: item.type === 'playlists' ? 'playlist' : 'album',
            provider: 'Apple Music'
        }
    } catch (e) {
        console.error('Apple Music Search Error:', e)
        return null
    }
}

// Mood to Search Query Mapping
const MOOD_QUERIES: Record<string, string[]> = {
    chill: ['lofi', 'chill', 'ambient', 'study', 'relax'],
    lit: ['party', 'hip hop', 'dance', 'hits', 'upbeat'],
    sad: ['sad', 'heartbreak', 'melancholy', 'acoustic', 'ballads'],
    romantic: ['love', 'romance', 'date night', 'r&b', 'soul'],
    hungry: ['dinner', 'cooking', 'jazz', 'italian', 'background'],
    curious: ['discover', 'experimental', 'indie', 'new music', 'alternative']
}

// Mood to Genre Mapping for Recommendations
const MOOD_GENRES: Record<string, string> = {
    chill: 'chill,ambient,study,sleep',
    lit: 'party,hip-hop,dance,pop',
    sad: 'sad,acoustic,piano,rainy-day',
    romantic: 'romance,r-n-b,soul',
    hungry: 'jazz,dinner,instrumental',
    curious: 'indie,alternative,new-release'
}

const getSpotifyRecommendations = async (mood: string, token: string): Promise<MusicItem | null> => {
    try {
        const seed_genres = MOOD_GENRES[mood] || MOOD_GENRES['chill']
        const response = await $fetch<any>(`https://api.spotify.com/v1/recommendations?seed_genres=${seed_genres}&limit=5`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!response.tracks?.length) return null

        const item = response.tracks[Math.floor(Math.random() * response.tracks.length)]
        return {
            id: item.id,
            name: item.name,
            subtitle: item.artists.map((a: any) => a.name).join(', '),
            image: item.album.images[0]?.url || '',
            url: item.external_urls.spotify,
            type: 'track',
            provider: 'Spotify'
        }
    } catch (e) {
        console.error('Spotify Recommendations Error:', e)
        return null
    }
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const mood = query.mood as string || 'chill'

    // Simulate network delay for realism if using mock
    // await new Promise(resolve => setTimeout(resolve, 800))

    // Determine Provider
    // If both keys exist, random 50/50. If only one, use that. If neither, use Mock.
    const hasSpotify = !!(config.spotifyClientId && config.spotifyClientSecret)
    const hasApple = !!config.appleMusicDeveloperToken

    let provider: 'Spotify' | 'Apple Music' | 'Mock' = 'Mock'

    if (hasSpotify && hasApple) {
        provider = Math.random() > 0.5 ? 'Spotify' : 'Apple Music'
    } else if (hasSpotify) {
        provider = 'Spotify'
    } else if (hasApple) {
        provider = 'Apple Music'
    }

    // Get Search Query
    const possibleQueries = MOOD_QUERIES[mood] || MOOD_QUERIES['chill']
    const searchQuery = possibleQueries[Math.floor(Math.random() * possibleQueries.length)]

    let result: MusicItem | null = null

    // Execute API Call
    if (provider === 'Spotify') {
        const token = await getSpotifyToken(config.spotifyClientId, config.spotifyClientSecret)
        if (token) {
            // 50/50 chance to use Recommendations (Tracks) or Search (Playlists/Albums)
            if (Math.random() > 0.5) {
                result = await getSpotifyRecommendations(mood, token)
            }

            // Fallback to search if recommendations failed or weren't chosen
            if (!result) {
                result = await searchSpotify(searchQuery, token)
            }
        }
    } else if (provider === 'Apple Music') {
        result = await searchAppleMusic(searchQuery, config.appleMusicDeveloperToken)
    }

    // Fallback to Mock if API failed or no result
    if (!result) {
        const useApple = Math.random() > 0.5
        const db = useApple ? APPLE_DB : SPOTIFY_DB
        const items = db[mood] || db['chill']
        const finalItems = items || (useApple ? APPLE_DB['chill'] : SPOTIFY_DB['chill'])
        const item = finalItems[Math.floor(Math.random() * finalItems.length)]

        result = item
    }

    return {
        id: result.id,
        title: result.name,
        overview: `${result.type.charAt(0).toUpperCase() + result.type.slice(1)} • ${result.subtitle}`,
        poster: result.image,
        rating: (Math.random() * 2) + 8,
        year: '2024',
        watchUrl: result.url,
        provider: {
            name: result.provider,
            logo: result.provider === 'Spotify'
                ? 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg'
                : 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Apple_Music_logo.svg'
        }
    }
})
