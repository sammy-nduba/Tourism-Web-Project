import { useState, useEffect } from 'react';
import { Tour, TourSummary } from '../../domain/models';
import { TourUseCases } from '../../domain/usecases/TourUseCases';
import { tourRepository } from '../../data/repositories/TourRepositoryImpl';
import { PaginatedResponse, SearchFilters } from '../../shared/types';

const tourUseCases = new TourUseCases(tourRepository);

export function useTours(filters?: SearchFilters) {
  const [tours, setTours] = useState<PaginatedResponse<TourSummary> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const data = await tourUseCases.getAllTours(filters);
        setTours(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tours');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [filters?.page, filters?.country, filters?.category]);

  return { tours, loading, error };
}

export function useTour(slug: string) {
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchTour = async () => {
      try {
        setLoading(true);
        const data = await tourUseCases.getTourBySlug(slug);
        setTour(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tour');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [slug]);

  return { tour, loading, error };
}

export function useFeaturedTours(limit = 6) {
  const [tours, setTours] = useState<TourSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        setLoading(true);
        const data = await tourUseCases.getFeaturedTours(limit);
        setTours(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured tours');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTours();
  }, [limit]);

  return { tours, loading, error };
}