import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';
import { Tour, CreateTourData, UpdateTourData, TourCountry, TourCity } from '../types/database.js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

console.log('[AdminService] Environment Variables Debug:');
console.log('[AdminService] SUPABASE_URL:', supabaseUrl ? `✓ ${supabaseUrl.substring(0, 30)}...` : '✗ missing');
console.log('[AdminService] SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? `✓ ${supabaseServiceKey.substring(0, 20)}...` : '✗ missing');

const missingVars: string[] = [];
if (!supabaseUrl) missingVars.push('SUPABASE_URL (or VITE_SUPABASE_URL)');
if (!supabaseServiceKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY)');

if (missingVars.length > 0) {
  throw new Error(`Missing Supabase configuration: ${missingVars.join(', ')}. Create a .env with these variables in the Backend folder.`);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
console.log('[AdminService] Supabase client initialized successfully');

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

export class AdminService {
  // Tour CRUD operations
  async createTour(tourData: CreateTourData): Promise<Tour> {
    const { data, error } = await supabase
      .from('tours')
      .insert(tourData)
      .select()
      .single();

    if (error) throw error;
    return data as Tour;
  }

  async getTour(id: string): Promise<Tour | null> {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        city:cities(*, country:countries(*))
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Tour;
  }

  async getTourBySlug(slug: string): Promise<Tour | null> {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        city:cities(*, country:countries(*))
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data as Tour;
  }

  async updateTour(id: string, updates: UpdateTourData): Promise<Tour> {
    const { data, error } = await supabase
      .from('tours')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Tour;
  }

  async deleteTour(id: string) {
    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getPublishedTours(filters: TourFilters = {}): Promise<Tour[]> {
    let query = supabase
      .from('tours')
      .select(`
        *,
        city:cities(*, country:countries(*))
      `)
      .eq('is_published', true);

    if (filters.country) {
      query = query.eq('city.countries.id', filters.country);
    }

    if (filters.city) {
      query = query.eq('city_id', filters.city);
    }

    if (filters.experience_level) {
      query = query.eq('difficulty_level', filters.experience_level);
    }

    if (filters.min_price) {
      query = query.gte('price', filters.min_price);
    }

    if (filters.max_price) {
      query = query.lte('price', filters.max_price);
    }

    if (filters.featured) {
      query = query.eq('featured', true);
    }

    if (filters.query) {
      query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data as Tour[];
  }

  async getFeaturedTours(limit = 6): Promise<Tour[]> {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        city:cities(*, country:countries(*))
      `)
      .eq('is_published', true)
      .eq('featured', true)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Tour[];
  }

  async getToursByCountry(filters: TourFilters = {}): Promise<Tour[]> {
    let query = supabase
      .from('tours')
      .select(`
        *,
        city:cities(*, country:countries(*))
      `)
      .eq('is_published', true);

    if (filters.country) {
      query = query.eq('city.countries.id', filters.country);
    }

    if (filters.experience_level) {
      query = query.eq('difficulty_level', filters.experience_level);
    }

    if (filters.min_price) {
      query = query.gte('price', filters.min_price);
    }

    if (filters.max_price) {
      query = query.lte('price', filters.max_price);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data as Tour[];
  }

  async searchTours(filters: SearchFilters = {}): Promise<Tour[]> {
    let query = supabase
      .from('tours')
      .select(`
        *,
        city:cities(*, country:countries(*))
      `)
      .eq('is_published', true);

    if (filters.query) {
      query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
    }

    if (filters.country) {
      query = query.eq('city.countries.id', filters.country);
    }

    if (filters.city) {
      query = query.eq('city_id', filters.city);
    }

    if (filters.experience_level) {
      query = query.eq('difficulty_level', filters.experience_level);
    }

    if (filters.min_price) {
      query = query.gte('price', filters.min_price);
    }

    if (filters.max_price) {
      query = query.lte('price', filters.max_price);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data as Tour[];
  }

  // Country operations
  async getCountries(): Promise<TourCountry[]> {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as TourCountry[];
  }

  async getCountryWithCities(countryId: string): Promise<TourCountry | null> {
    const { data, error } = await supabase
      .from('countries')
      .select(`
        *,
        cities(*)
      `)
      .eq('id', countryId)
      .single();

    if (error) throw error;
    return data as TourCountry;
  }

  // City operations
  async getCities(countryId?: string): Promise<TourCity[]> {
    let query = supabase
      .from('cities')
      .select('*')
      .order('name');

    if (countryId) {
      query = query.eq('country_id', countryId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as TourCity[];
  }
}

// Export singleton instance
export const adminService = new AdminService();