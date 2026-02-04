import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';
console.log('[AdminService] Environment Variables Debug:');
console.log('[AdminService] SUPABASE_URL:', supabaseUrl ? `✓ ${supabaseUrl.substring(0, 30)}...` : '✗ missing');
console.log('[AdminService] SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? `✓ ${supabaseServiceKey.substring(0, 20)}...` : '✗ missing');
const missingVars = [];
if (!supabaseUrl)
    missingVars.push('SUPABASE_URL (or VITE_SUPABASE_URL)');
if (!supabaseServiceKey)
    missingVars.push('SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY)');
if (missingVars.length > 0) {
    throw new Error(`Missing Supabase configuration: ${missingVars.join(', ')}. Create a .env with these variables in the Backend folder.`);
}
const supabase = createClient(supabaseUrl, supabaseServiceKey);
console.log('[AdminService] Supabase client initialized successfully');
export class AdminService {
    async createTour(tourData) {
        const { data, error } = await supabase
            .from('tours')
            .insert(tourData)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async getTour(id) {
        const { data, error } = await supabase
            .from('tours')
            .select(`
        *,
        cities(*, countries(*))
      `)
            .eq('id', id)
            .single();
        if (error)
            throw error;
        return data;
    }
    async getTourBySlug(slug) {
        const { data, error } = await supabase
            .from('tours')
            .select(`
        *,
        cities(*, countries(*))
      `)
            .eq('slug', slug)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw error;
        }
        return data;
    }
    async updateTour(id, updates) {
        const { data, error } = await supabase
            .from('tours')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async deleteTour(id) {
        const { error } = await supabase
            .from('tours')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
    }
    async getTours(filters = {}) {
        let cityIds;
        if (filters.country) {
            const { data: cities, error: citiesError } = await supabase
                .from('cities')
                .select('id')
                .eq('country_id', filters.country);
            if (citiesError)
                throw new Error(`Failed to fetch cities: ${citiesError.message}`);
            cityIds = cities?.map(c => c.id) || [];
        }
        let query = supabase
            .from('tours')
            .select(`
        *,
        cities(*, countries(*))
      `);
        if (cityIds && cityIds.length > 0) {
            query = query.in('city_id', cityIds);
        }
        else if (filters.country) {
            return [];
        }
        if (filters.city) {
            query = query.eq('city_id', filters.city);
        }
        if (filters.category) {
            query = query.eq("category", filters.category);
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
        if (error)
            throw error;
        return data;
    }
    async getPublishedTours(filters = {}) {
        let query = supabase
            .from('tours')
            .select(`
        *,
        cities(*, countries(*))
      `)
            .eq('is_published', true);
        if (filters.country) {
            const countryInput = filters.country;
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(countryInput);
            if (isUUID) {
                const { data: cities } = await supabase
                    .from('cities')
                    .select('id')
                    .eq('country_id', countryInput);
                if (cities && cities.length > 0) {
                    query = query.in('city_id', cities.map(c => c.id));
                }
                else {
                    return [];
                }
            }
            else {
                const { data: countries } = await supabase
                    .from('countries')
                    .select('id')
                    .or(`code.eq.${countryInput.toUpperCase()},name.ilike.${countryInput}`);
                if (countries && countries.length > 0) {
                    const countryIds = countries.map(c => c.id);
                    const { data: cities } = await supabase
                        .from('cities')
                        .select('id')
                        .in('country_id', countryIds);
                    if (cities && cities.length > 0) {
                        query = query.in('city_id', cities.map(c => c.id));
                    }
                    else {
                        return [];
                    }
                }
                else {
                    return [];
                }
            }
        }
        if (filters.category) {
            query = query.eq("category", filters.category);
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
        if (error)
            throw error;
        return data;
    }
    async getFeaturedTours(limit = 6) {
        const { data, error } = await supabase
            .from('tours')
            .select(`
        *,
        cities(*, countries(*))
      `)
            .eq('is_published', true)
            .eq('featured', true)
            .limit(limit)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data;
    }
    async getToursByCountry(filters = {}) {
        let query = supabase
            .from('tours')
            .select(`
        *,
        cities(*, countries(*))
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
        if (error)
            throw error;
        return data;
    }
    async searchTours(filters = {}) {
        let query = supabase
            .from('tours')
            .select(`
        *,
        cities(*, countries(*))
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
        if (error)
            throw error;
        return data;
    }
    async getCountries() {
        const { data, error } = await supabase
            .from('countries')
            .select('*')
            .order('name');
        if (error)
            throw error;
        return data;
    }
    async getCountryWithCities(countryId) {
        const { data, error } = await supabase
            .from('countries')
            .select(`
        *,
        cities(*)
      `)
            .eq('id', countryId)
            .single();
        if (error)
            throw error;
        return data;
    }
    async getCities(countryId) {
        let query = supabase
            .from('cities')
            .select('*')
            .order('name');
        if (countryId) {
            query = query.eq('country_id', countryId);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        return data;
    }
}
export const adminService = new AdminService();
