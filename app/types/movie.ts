export interface Movie {
    id?: number | string;
    title: string;
    poster: string;
    rating: number;
    year: string;
    description?: string;
    overview?: string;
    netflixUrl: string;
}
