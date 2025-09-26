import { Tour, TourSummary } from '../../domain/models';
import { PaginatedResponse, SearchFilters } from '../../shared/types';
import { mockTours, mockTourSummaries } from '../mocks/tours';
import { PAGINATION } from '../../shared/constants';

export class ToursService {
  async getTours(filters?: SearchFilters): Promise<PaginatedResponse<TourSummary>> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let filteredTours = [...mockTourSummaries];
    
    if (filters?.country) {
      filteredTours = filteredTours.filter(tour => tour.country === filters.country);
    }
    
    if (filters?.city) {
      filteredTours = filteredTours.filter(tour => 
        tour.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    
    if (filters?.category) {
      filteredTours = filteredTours.filter(tour => tour.category === filters.category);
    }

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
  }

  async getTourById(id: string): Promise<Tour | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockTours.find(tour => tour.id === id) || null;
  }

  async getTourBySlug(slug: string): Promise<Tour | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockTours.find(tour => tour.slug === slug) || null;
  }

  async getFeaturedTours(limit = 6): Promise<TourSummary[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockTourSummaries.filter(tour => tour.featured).slice(0, limit);
  }

  async searchTours(query: string, filters?: SearchFilters): Promise<PaginatedResponse<TourSummary>> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const searchQuery = query.toLowerCase();
    const filteredTours = mockTourSummaries.filter(tour => 
      tour.title.toLowerCase().includes(searchQuery) ||
      tour.summary.toLowerCase().includes(searchQuery) ||
      tour.category.toLowerCase().includes(searchQuery)
    );

    const page = filters?.page || PAGINATION.DEFAULT_PAGE;
    const limit = filters?.limit || PAGINATION.DEFAULT_LIMIT;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      data: filteredTours.slice(startIndex, endIndex),
      meta: {
        page,
        limit,
        total: filteredTours.length,
        totalPages: Math.ceil(filteredTours.length / limit)
      }
    };
  }
}

export const toursService = new ToursService();