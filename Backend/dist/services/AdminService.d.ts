import { Tour, CreateTourData, UpdateTourData, TourCountry, TourCity } from '../types/database.js';
export interface TourFilters {
    country?: string;
    city?: string;
    experience_level?: string;
    min_price?: number;
    max_price?: number;
    limit?: number;
    offset?: number;
    featured?: boolean;
    query?: string;
}
export interface SearchFilters {
    query?: string;
    country?: string;
    city?: string;
    experience_level?: string;
    min_price?: number;
    max_price?: number;
    limit?: number;
    offset?: number;
}
export declare class AdminService {
    createTour(tourData: CreateTourData): Promise<Tour>;
    getTour(id: string): Promise<Tour | null>;
    getTourBySlug(slug: string): Promise<Tour | null>;
    updateTour(id: string, updates: UpdateTourData): Promise<Tour>;
    deleteTour(id: string): Promise<void>;
    getPublishedTours(filters?: TourFilters): Promise<Tour[]>;
    getFeaturedTours(limit?: number): Promise<Tour[]>;
    getToursByCountry(filters?: TourFilters): Promise<Tour[]>;
    searchTours(filters?: SearchFilters): Promise<Tour[]>;
    getCountries(): Promise<TourCountry[]>;
    getCountryWithCities(countryId: string): Promise<TourCountry | null>;
    getCities(countryId?: string): Promise<TourCity[]>;
}
export declare const adminService: AdminService;
