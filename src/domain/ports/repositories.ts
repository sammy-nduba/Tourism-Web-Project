import { 
  Country, City, Tour, TourSummary, Program, ProgramSummary, 
  BlogPost, BlogSummary, ContactSubmission 
} from '../models';
import { PaginatedResponse, SearchFilters } from '../../shared/types';

export interface CountryRepository {
  getAll(): Promise<Country[]>;
  getBySlug(slug: string): Promise<Country | null>;
}

export interface CityRepository {
  getByCountry(countrySlug: string): Promise<City[]>;
  getBySlug(countrySlug: string, citySlug: string): Promise<City | null>;
}

export interface TourRepository {
  getAll(filters?: SearchFilters): Promise<PaginatedResponse<TourSummary>>;
  getById(id: string): Promise<Tour | null>;
  getBySlug(slug: string): Promise<Tour | null>;
  getFeatured(limit?: number): Promise<TourSummary[]>;
  search(query: string, filters?: SearchFilters): Promise<PaginatedResponse<TourSummary>>;
}

export interface ProgramRepository {
  getAll(filters?: SearchFilters): Promise<PaginatedResponse<ProgramSummary>>;
  getById(id: string): Promise<Program | null>;
  getBySlug(slug: string): Promise<Program | null>;
  getFeatured(limit?: number): Promise<ProgramSummary[]>;
}

export interface BlogRepository {
  getAll(filters?: SearchFilters): Promise<PaginatedResponse<BlogSummary>>;
  getById(id: string): Promise<BlogPost | null>;
  getBySlug(slug: string): Promise<BlogPost | null>;
  getFeatured(limit?: number): Promise<BlogSummary[]>;
}

export interface ContactRepository {
  submit(form: ContactForm): Promise<ContactSubmission>;
}