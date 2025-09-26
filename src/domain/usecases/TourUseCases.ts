import { Tour, TourSummary } from '../models';
import { TourRepository } from '../ports/repositories';
import { PaginatedResponse, SearchFilters } from '../../shared/types';

export class TourUseCases {
  constructor(private tourRepository: TourRepository) {}

  async getAllTours(filters?: SearchFilters): Promise<PaginatedResponse<TourSummary>> {
    return this.tourRepository.getAll(filters);
  }

  async getTourById(id: string): Promise<Tour | null> {
    if (!id) throw new Error('Tour ID is required');
    return this.tourRepository.getById(id);
  }

  async getTourBySlug(slug: string): Promise<Tour | null> {
    if (!slug) throw new Error('Tour slug is required');
    return this.tourRepository.getBySlug(slug);
  }

  async getFeaturedTours(limit = 6): Promise<TourSummary[]> {
    return this.tourRepository.getFeatured(limit);
  }

  async searchTours(query: string, filters?: SearchFilters): Promise<PaginatedResponse<TourSummary>> {
    if (!query.trim()) {
      return this.getAllTours(filters);
    }
    return this.tourRepository.search(query, filters);
  }
}