import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

// API Configuration for clean architecture
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
};

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

export class AdminService {
  async getDashboardStats(): Promise<DashboardStats> {
    const [tours, programs, contacts, volunteers, donations] = await Promise.all([
      supabase.from('tours').select('id', { count: 'exact', head: true }),
      supabase.from('programs').select('id', { count: 'exact', head: true }),
      supabase.from('contact_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('volunteer_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('donation_requests').select('id', { count: 'exact', head: true }),
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
    try {
      const params = new URLSearchParams();

      if (filters?.country) params.append('country', filters.country);
      if (filters?.city) params.append('city', filters.city);
      if (filters?.featured) params.append('featured', 'true');
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const queryString = params.toString();
      const url = `${API_CONFIG.BASE_URL}/api/tours${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch tours');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching tours:', error);
      throw error;
    }
  }

  async getTour(id: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/tours/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch tour');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching tour:', error);
      throw error;
    }
  }

  async getTourBySlug(slug: string) {
    const { data, error } = await supabase
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
      console.log('Creating tour:', tour);
      console.log('Making API call to /api/tours');

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/tours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tour),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response status:', response.status);
        console.error('Error response headers:', Object.fromEntries(response.headers.entries()));
        console.error('Error response body:', errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        console.error('Parsed error data:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Tour created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating tour:', error);
      throw error;
    }
  }

  async updateTour(id: string, tour: Database['public']['Tables']['tours']['Update']) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/tours/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...tour, updated_at: new Date().toISOString() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update tour');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating tour:', error);
      throw error;
    }
  }

  async deleteTour(id: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/tours/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete tour');
      }

      return true;
    } catch (error) {
      console.error('Error deleting tour:', error);
      throw error;
    }
  }

  async getPrograms() {
    const { data, error } = await supabase
      .from('programs')
      .select('*, cities(name, countries(name))')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getProgram(id: string) {
    const { data, error } = await supabase
      .from('programs')
      .select('*, cities(id, name, countries(id, name))')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createProgram(program: Database['public']['Tables']['programs']['Insert']) {
    const { data, error } = await (supabase as any)
      .from('programs')
      .insert(program)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProgram(id: string, program: Database['public']['Tables']['programs']['Update']) {
    const { data, error } = await (supabase as any)
      .from('programs')
      .update({ ...program, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteProgram(id: string) {
    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getContactRequests() {
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateContactRequest(id: string, updates: Database['public']['Tables']['contact_requests']['Update']) {
    const { data, error } = await (supabase as any)
      .from('contact_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getVolunteerApplications() {
    const { data, error } = await supabase
      .from('volunteer_applications')
      .select('*, programs(title)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateVolunteerApplication(id: string, updates: Database['public']['Tables']['volunteer_applications']['Update']) {
    const { data, error } = await (supabase as any)
      .from('volunteer_applications')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getDonations() {
    const { data, error } = await supabase
      .from('donation_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateDonation(id: string, updates: Database['public']['Tables']['donation_requests']['Update']) {
    const { data, error } = await (supabase as any)
      .from('donation_requests')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getBlogPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getBlogPost(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createBlogPost(post: Database['public']['Tables']['blog_posts']['Insert']) {
    const { data, error } = await (supabase as any)
      .from('blog_posts')
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateBlogPost(id: string, post: Database['public']['Tables']['blog_posts']['Update']) {
    const { data, error } = await (supabase as any)
      .from('blog_posts')
      .update({ ...post, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteBlogPost(id: string) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getEvent(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createEvent(event: Database['public']['Tables']['events']['Insert']) {
    const { data, error } = await (supabase as any)
      .from('events')
      .insert(event)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateEvent(id: string, event: Database['public']['Tables']['events']['Update']) {
    const { data, error } = await (supabase as any)
      .from('events')
      .update({ ...event, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getFeaturedTours(limit: number = 6) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/tours/featured?limit=${limit}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch featured tours');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching featured tours:', error);
      throw error;
    }
  }

  // Enhanced tour queries for frontend API
  async getPublishedTours(filters?: {
    country?: string;
    city?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      const params = new URLSearchParams();

      if (filters?.country) params.append('country', filters.country);
      if (filters?.city) params.append('city', filters.city);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const queryString = params.toString();
      const url = `${API_CONFIG.BASE_URL}/api/tours${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch published tours');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching published tours:', error);
      throw error;
    }
  }

  async searchTours(query: string, filters?: {
    country?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      const params = new URLSearchParams({ q: query });

      if (filters?.country) params.append('country', filters.country);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/search?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search tours');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching tours:', error);
      throw error;
    }
  }

  // ==================== Countries CRUD ====================
  async getCountries() {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }

  async createCountry(country: Database['public']['Tables']['countries']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('countries')
        .insert([country])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating country:', error);
      throw error;
    }
  }

  async updateCountry(id: string, updates: Partial<Country>) {
    try {
      const { data, error } = await supabase
        .from('countries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating country:', error);
      throw error;
    }
  }

  async deleteCountry(id: string) {
    try {
      const { error } = await supabase
        .from('countries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting country:', error);
      throw error;
    }
  }

  // ==================== Cities CRUD ====================
  async getCities(countryId?: string) {
    try {
      let query = supabase.from('cities').select('*, countries(id, name)');

      if (countryId) {
        query = query.eq('country_id', countryId);
      }

      const { data, error } = await query.order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  }

  async createCity(city: Database['public']['Tables']['cities']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('cities')
        .insert([city])
        .select('*, countries(id, name)')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating city:', error);
      throw error;
    }
  }

  async updateCity(id: string, updates: Partial<City>) {
    try {
      const { data, error } = await supabase
        .from('cities')
        .update(updates)
        .eq('id', id)
        .select('*, countries(id, name)')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating city:', error);
      throw error;
    }
  }

  async deleteCity(id: string) {
    try {
      const { error } = await supabase
        .from('cities')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting city:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
