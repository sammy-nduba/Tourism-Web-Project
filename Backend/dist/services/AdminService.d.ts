export interface TourFilters {
    country?: string;
    city?: string;
    experience_level?: string;
    min_price?: number;
    max_price?: number;
    limit?: number;
    offset?: number;
    featured?: boolean;
    category?: string;
    q?: string;
}
export declare class AdminService {
    createTour(data: Record<string, any>): Promise<any>;
    getTour(id: string): Promise<any>;
    getTourBySlug(slug: string): Promise<any>;
    updateTour(id: string, updates: Record<string, any>): Promise<any>;
    deleteTour(id: string): Promise<void>;
    getTours(filters?: TourFilters): Promise<any[]>;
    getPublishedTours(filters?: TourFilters): Promise<any[]>;
    getFeaturedTours(limit?: number): Promise<any[]>;
    getToursByCountry(filters?: TourFilters): Promise<any[]>;
    searchTours(filters?: TourFilters): Promise<any[]>;
    getCountries(): Promise<any[]>;
    getCountryWithCities(countryId: string): Promise<any>;
    createCountry(data: Record<string, any>): Promise<any>;
    updateCountry(id: string, updates: Record<string, any>): Promise<any>;
    deleteCountry(id: string): Promise<void>;
    getCities(countryId?: string): Promise<any[]>;
    createCity(data: Record<string, any>): Promise<any>;
    updateCity(id: string, updates: Record<string, any>): Promise<any>;
    deleteCity(id: string): Promise<void>;
    saveContactRequest(data: {
        name: string;
        email: string;
        phone?: string;
        subject?: string;
        message: string;
        inquiry_type?: string;
        preferred_contact?: string;
        newsletter?: boolean;
    }): Promise<any>;
    getContactRequests(): Promise<any[]>;
    updateContactRequest(id: string, updates: Record<string, any>): Promise<any>;
    createBooking(data: {
        tour_id: string;
        customer_name: string;
        customer_email: string;
        customer_phone?: string;
        start_date: string;
        end_date: string;
        guests: number;
        total_amount: number;
        special_requests?: string;
    }): Promise<any>;
    getBookings(): Promise<any[]>;
    getDashboardStats(): Promise<{
        totalTours: number;
        pendingContacts: number;
        totalBookings: number;
    }>;
    private _applyFilters;
}
export declare const adminService: AdminService;
