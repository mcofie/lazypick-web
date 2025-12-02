// types/decider.ts

export interface DecisionResult {
    id: string | number;
    title: string;
    description: string;
    imageUrl: string;
    actionLabel: string; // e.g. "Watch Now", "Order Food"
    actionUrl: string;   // The deep link
    provider?: string;   // e.g. "Netflix", "UberEats"
}

export interface IDecider {
    id: string;          // e.g. 'movie'
    label: string;       // e.g. 'Watch Something'
    icon: string;        // Nuxt Icon name

    // The magic function that returns ONE random item
    spin(filters?: Record<string, unknown>): Promise<DecisionResult>;
}