// Common types used throughout the application

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ServiceError {
  code: string;
  message: string;
  status: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ServiceError;
}

export interface SearchFilters {
  query?: string;
  country?: string;
  city?: string;
  category?: string;
  priceRange?: [number, number];
  duration?: string;
  page?: number;
  limit?: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Image {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

export type Country = 'kenya' | 'uganda' | 'tanzania' | 'rwanda';
export type TourCategory = 'wildlife' | 'cultural' | 'adventure' | 'conservation' | 'mountain' | 'beach';
export type TourExperienceLevel = 'Budget' | 'Comfort' | 'Luxury' | 'Platinum Experience';
export type ProgramType = 'volunteer' | 'conservation' | 'research' | 'education';
export type BlogCategory = 'adventure' | 'conservation' | 'culture' | 'wildlife' | 'travel-tips';