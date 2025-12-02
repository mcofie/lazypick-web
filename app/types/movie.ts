export interface Provider {
    logo: string;
    name: string;
}

export interface Movie {
    id?: number | string;
    title: string;
    poster: string;
    rating: number;
    year: string;
    description?: string;
    overview?: string;
    netflixUrl?: string; // Deprecated in favor of watchUrl
    watchUrl?: string;
    provider?: Provider;
}
