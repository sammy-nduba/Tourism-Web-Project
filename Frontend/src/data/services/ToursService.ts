import { Tour, TourSummary } from '../../domain/models';
import { PaginatedResponse, SearchFilters } from '../../shared/types';
import { API_BASE_URL, API_ENDPOINTS, PAGINATION } from '../../shared/constants';

// API response types based on backend structure
interface BackendTour {
  id: string;
  title: string;
  slug: string;
  description: string;
  city_id: string | null;
  duration_days: number;
  price: number;
  difficulty_level: string;
  max_group_size: number;
  image_url: string;
  gallery_urls: any;
  highlights: any;
  included: any;
  excluded: any;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  cities?: {
    id: string;
    name: string;
    countries?: {
      id: string;
      name: string;
    };
  } | null;
}

interface BackendTourSummary extends Omit<BackendTour, 'description' | 'gallery_urls' | 'highlights' | 'included' | 'excluded' | 'itinerary' | 'reviews'> {
  summary?: string;
}

export class ToursService {
  private async apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private transformBackendTourToFrontend(tour: BackendTour): Tour {
    return {
      id: tour.id,
      createdAt: tour.created_at,
      updatedAt: tour.updated_at,
      title: tour.title,
      slug: tour.slug,
      summary: tour.description.substring(0, 150) + '...', // Create summary from description
      description: tour.description,
      category: 'wildlife', // Default category, should be added to backend
      duration: tour.duration_days,
      difficultyLevel: tour.difficulty_level as any, // Already using correct categories
      price: {
        amount: tour.price,
        currency: 'USD',
        includes: tour.included || [],
        excludes: tour.excluded || [],
      },
      images: tour.gallery_urls || [],
      heroImage: {
        id: `${tour.id}-hero`,
        url: tour.image_url,
        alt: tour.title,
      },
      country: tour.cities?.countries?.name?.toLowerCase() as any || 'kenya',
      city: tour.cities?.name || 'Nairobi',
      itinerary: [], // Would need to be added to backend
      includes: tour.included || [],
      excludes: tour.excluded || [],
      whatToBring: [], // Would need to be added to backend
      availability: [], // Would need to be added to backend
      reviews: [], // Would need to be added to backend
      rating: 4.5, // Default rating
      reviewCount: 0, // Default count
      featured: tour.is_published,
      maxGroupSize: tour.max_group_size,
      minAge: 12, // Default minimum age
      physicalRating: 2, // Default physical rating
      tags: tour.highlights || [],
    };
  }

  private transformBackendTourToSummary(tour: BackendTour): TourSummary {
    const fullTour = this.transformBackendTourToFrontend(tour);
    return {
      id: fullTour.id,
      title: fullTour.title,
      slug: fullTour.slug,
      summary: fullTour.summary,
      category: fullTour.category,
      duration: fullTour.duration,
      price: fullTour.price,
      heroImage: fullTour.heroImage,
      country: fullTour.country,
      city: fullTour.city,
      rating: fullTour.rating,
      reviewCount: fullTour.reviewCount,
      featured: fullTour.featured,
      difficultyLevel: fullTour.difficultyLevel,
    };
  }

  async getTours(filters?: SearchFilters): Promise<PaginatedResponse<TourSummary>> {
    try {
      const params = new URLSearchParams();

      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.country) params.append('country', filters.country);
      if (filters?.city) params.append('city', filters.city);
      if (filters?.category) params.append('category', filters.category);

      const queryString = params.toString();
      const endpoint = `${API_ENDPOINTS.TOURS}${queryString ? `?${queryString}` : ''}`;

      const backendTours: BackendTour[] = await this.apiCall<BackendTour[]>(endpoint);

      const tourSummaries = backendTours.map(tour => this.transformBackendTourToSummary(tour));

      // Apply client-side filtering for features not supported by backend yet
      let filteredTours = [...tourSummaries];

      const page = filters?.page || PAGINATION.DEFAULT_PAGE;
      const limit = filters?.limit || PAGINATION.DEFAULT_LIMIT;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedTours = filteredTours.slice(startIndex, endIndex);

      return {
        data: paginatedTours,
        meta: {
          page,
          limit,
          total: filteredTours.length,
          totalPages: Math.ceil(filteredTours.length / limit)
        }
      };
    } catch (error) {
      console.error('Failed to fetch tours:', error);
      throw error;
    }
  }

  async getTourById(id: string): Promise<Tour | null> {
    try {
      const backendTour: BackendTour = await this.apiCall<BackendTour>(`${API_ENDPOINTS.TOURS}/${id}`);
      return this.transformBackendTourToFrontend(backendTour);
    } catch (error) {
      console.error(`Failed to fetch tour ${id}:`, error);
      return null;
    }
  }

  async getTourBySlug(slug: string): Promise<Tour | null> {
    try {
      const backendTour: BackendTour = await this.apiCall<BackendTour>(`${API_ENDPOINTS.TOURS}/slug/${slug}`);
      return this.transformBackendTourToFrontend(backendTour);
    } catch (error) {
      console.error(`Failed to fetch tour with slug ${slug}:`, error);
      return null;
    }
  }

  async getFeaturedTours(limit = 6): Promise<TourSummary[]> {
    try {
      const backendTours: BackendTour[] = await this.apiCall<BackendTour[]>(`${API_ENDPOINTS.TOURS}?featured=true&limit=${limit}`);

      return backendTours
        .filter(tour => tour.is_published)
        .map(tour => this.transformBackendTourToSummary(tour))
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch featured tours:', error);
      return [];
    }
  }

  async searchTours(query: string, filters?: SearchFilters): Promise<PaginatedResponse<TourSummary>> {
    try {
      const searchParams = new URLSearchParams({ q: query });

      if (filters?.page) searchParams.append('page', filters.page.toString());
      if (filters?.limit) searchParams.append('limit', filters.limit.toString());

      const backendTours: BackendTour[] = await this.apiCall<BackendTour[]>(
        `${API_ENDPOINTS.SEARCH}?${searchParams.toString()}`
      );

      const tourSummaries = backendTours.map(tour => this.transformBackendTourToSummary(tour));

      const page = filters?.page || PAGINATION.DEFAULT_PAGE;
      const limit = filters?.limit || PAGINATION.DEFAULT_LIMIT;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedTours = tourSummaries.slice(startIndex, endIndex);

      return {
        data: paginatedTours,
        meta: {
          page,
          limit,
          total: tourSummaries.length,
          totalPages: Math.ceil(tourSummaries.length / limit)
        }
      };
    } catch (error) {
      console.error('Failed to search tours:', error);
      throw error;
    }
  }
}

export const toursService = new ToursService();