import { supabase } from '../lib/supabase';
import type { Database } from '../../../src/lib/database.types';

type Tour = Database['public']['Tables']['tours']['Row'];
type Program = Database['public']['Tables']['programs']['Row'];
type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
type Event = Database['public']['Tables']['events']['Row'];
type ContactRequest = Database['public']['Tables']['contact_requests']['Row'];
type DonationRequest = Database['public']['Tables']['donation_requests']['Row'];
type VolunteerApplication = Database['public']['Tables']['volunteer_applications']['Row'];
type Country = Database['public']['Tables']['countries']['Row'];
type City = Database['public']['Tables']['cities']['Row'];

export interface DashboardStats {
  totalTours: number;
  totalPrograms: number;
  pendingContacts: number;
  pendingVolunteers: number;
  totalDonations: number;
  recentActivity: number;
}

export class ServerAdminService {
  async getDashboardStats(): Promise<DashboardStats> {
    const [tours, programs, contacts, volunteers, donations] = await Promise.all([
      (supabase as any).from('tours').select('id', { count: 'exact', head: true }),
      (supabase as any).from('programs').select('id', { count: 'exact', head: true }),
      (supabase as any).from('contact_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      (supabase as any).from('volunteer_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      (supabase as any).from('donation_requests').select('id', { count: 'exact', head: true }),
    ]);

    return {
      totalTours: tours.count || 0,
      totalPrograms: programs.count || 0,
      pendingContacts: contacts.count || 0,
      pendingVolunteers: volunteers.count || 0,
      totalDonations: donations.count || 0,
      recentActivity: (contacts.count || 0) + (volunteers.count || 0),
    };
  }

  async getTours(filters?: {
    country?: string;
    city?: string;
    category?: string;
    limit?: number;
    offset?: number;
    featured?: boolean;
  }) {
    let query = (supabase as any)
      .from('tours')
      .select('*, cities(name, countries(name))')
      .order('created_at', { ascending: false });

    if (filters?.country) {
      query = query.eq('cities.countries.name', filters.country);
    }

    if (filters?.city) {
      query = query.eq('cities.name', filters.city);
    }

    if (filters?.featured) {
      query = query.eq('is_published', true);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters?.limit || 10)) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  async getTour(id: string) {
    const { data, error } = await (supabase as any)
      .from('tours')
      .select('*, cities(id, name, countries(id, name))')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getTourBySlug(slug: string) {
    const { data, error } = await (supabase as any)
      .from('tours')
      .select('*, cities(id, name, countries(id, name))')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createTour(tour: Database['public']['Tables']['tours']['Insert']) {
    try {
      console.log('ServerAdminService.createTour called with:', JSON.stringify(tour, null, 2));

      // First, let's check what tables exist
      console.log('Checking database tables...');
      const { data: tables, error: tablesError } = await (supabase as any)
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(10);

      console.log('Available tables:', tables);
      console.log('Tables error:', tablesError);

      const { data, error } = await (supabase as any)
        .from('tours')
        .insert(tour)
        .select()
        .single();

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Tour created successfully in database');
      return data;
    } catch (error) {
      console.error('Error in ServerAdminService.createTour:', error);
      throw error;
    }
  }

  async updateTour(id: string, tour: Database['public']['Tables']['tours']['Update']) {
    const { data, error } = await (supabase as any)
      .from('tours')
      .update({ ...tour, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTour(id: string) {
    const { error } = await (supabase as any)
      .from('tours')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getCountries() {
    const { data, error } = await (supabase as any)
      .from('countries')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  async createCountry(country: Database['public']['Tables']['countries']['Insert']) {
    const { data, error } = await (supabase as any)
      .from('countries')
      .insert(country)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getFeaturedTours(limit: number = 6) {
    const { data, error } = await (supabase as any)
      .from('tours')
      .select('*, cities(name, countries(name))')
      .eq('is_published', true)
      .eq('is_featured', true)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getPublishedTours(filters?: {
    country?: string;
    city?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = (supabase as any)
      .from('tours')
      .select('*, cities(name, countries(name))')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (filters?.country) {
      query = query.eq('cities.countries.name', filters.country);
    }

    if (filters?.city) {
      query = query.eq('cities.name', filters.city);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters?.limit || 10)) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  async searchTours(query: string, filters?: {
    country?: string;
    limit?: number;
    offset?: number;
  }) {
    let supabaseQuery = (supabase as any)
      .from('tours')
      .select('*, cities(name, countries(name))')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%, description.ilike.%${query}%, short_description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (filters?.country) {
      supabaseQuery = supabaseQuery.eq('cities.countries.name', filters.country);
    }

    if (filters?.limit) {
      supabaseQuery = supabaseQuery.limit(filters.limit);
    }

    if (filters?.offset) {
      supabaseQuery = supabaseQuery.range(filters.offset, (filters.offset + (filters?.limit || 10)) - 1);
    }

    const { data, error } = await supabaseQuery;

    if (error) throw error;
    return data;
  }
}

export const serverAdminService = new ServerAdminService();