import { Tour, TourSummary } from '../../domain/models';
import { TourRepository } from '../../domain/ports/repositories';
import { PaginatedResponse, SearchFilters } from '../../shared/types';
import { toursService } from '../services/ToursService';

export class TourRepositoryImpl implements TourRepository {
  async getAll(filters?: SearchFilters): Promise<PaginatedResponse<TourSummary>> {
    return toursService.getTours(filters);
  }

  async getById(id: string): Promise<Tour | null> {
    return toursService.getTourById(id);
  }

  async getBySlug(slug: string): Promise<Tour | null> {
    return toursService.getTourBySlug(slug);
  }

  async getFeatured(limit?: number): Promise<TourSummary[]> {
    return toursService.getFeaturedTours(limit);
  }

  async search(query: string, filters?: SearchFilters): Promise<PaginatedResponse<TourSummary>> {
    return toursService.searchTours(query, filters);
  }
}

export const tourRepository = new TourRepositoryImpl();