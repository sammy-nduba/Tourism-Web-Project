import type { Database } from '../../lib/database.types';

const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000'),
};

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

// Helper for making authenticated requests to generic admin CRUD endpoints
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('admin_token');
  const headers = {
    ...options.headers,
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export class AdminService {
  async getDashboardStats(): Promise<DashboardStats> {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/stats`);
  }

  // Tours CRUD
  async getTours(filters?: {
    country?: string;
    city?: string;
    category?: string;
    limit?: number;
    offset?: number;
    featured?: boolean;
  }) {
    const params = new URLSearchParams();
    if (filters?.country) params.append('country', filters.country);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.featured) params.append('featured', 'true');
    if (filters?.category) params.append('category', filters.category);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const url = `${API_CONFIG.BASE_URL}/api/tours/admin/all${queryString ? `?${queryString}` : ''}`;
    return fetchWithAuth(url);
  }

  async getTour(id: string) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/tours/${id}`);
  }

  async getTourBySlug(slug: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/tours/slug/${slug}`);
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  }

  async createTour(tour: Database['public']['Tables']['tours']['Insert']) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/tours`, {
      method: 'POST',
      body: JSON.stringify(tour),
    });
  }

  async updateTour(id: string, tour: Database['public']['Tables']['tours']['Update']) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/tours/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tour),
    });
  }

  async deleteTour(id: string) {
    await fetchWithAuth(`${API_CONFIG.BASE_URL}/api/tours/${id}`, {
      method: 'DELETE',
    });
    return true;
  }

  // Programs CRUD
  async getPrograms() {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/programs`);
  }

  async getProgram(id: string) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/programs/${id}`);
  }

  async createProgram(program: Database['public']['Tables']['programs']['Insert']) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/programs`, {
      method: 'POST',
      body: JSON.stringify(program),
    });
  }

  async updateProgram(id: string, program: Database['public']['Tables']['programs']['Update']) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(program),
    });
  }

  async deleteProgram(id: string) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/programs/${id}`, {
      method: 'DELETE',
    });
  }

  // Contact requests CRUD
  async getContactRequests() {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/contact_requests`);
  }

  async updateContactRequest(id: string, updates: Database['public']['Tables']['contact_requests']['Update']) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/contact_requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Volunteer applications CRUD
  async getVolunteerApplications() {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/volunteer_applications`);
  }

  async updateVolunteerApplication(id: string, updates: Database['public']['Tables']['volunteer_applications']['Update']) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/volunteer_applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Donations CRUD
  async getDonations() {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/donation_requests`);
  }

  async updateDonation(id: string, updates: Database['public']['Tables']['donation_requests']['Update']) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/donation_requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Blog posts CRUD
  async getBlogPosts() {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/blog_posts`);
  }

  async getBlogPost(id: string) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/blog_posts/${id}`);
  }

  async createBlogPost(post: Database['public']['Tables']['blog_posts']['Insert']) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/blog_posts`, {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  async updateBlogPost(id: string, post: Database['public']['Tables']['blog_posts']['Update']) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/blog_posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    });
  }

  async deleteBlogPost(id: string) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/blog_posts/${id}`, {
      method: 'DELETE',
    });
  }

  // Events CRUD
  async getEvents() {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/events`);
  }

  async getEvent(id: string) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/events/${id}`);
  }

  async createEvent(event: Database['public']['Tables']['events']['Insert']) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/events`, {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  async updateEvent(id: string, event: Database['public']['Tables']['events']['Update']) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    });
  }

  async deleteEvent(id: string) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/events/${id}`, {
      method: 'DELETE',
    });
  }

  // Featured and published tours for frontend
  async getFeaturedTours(limit: number = 6) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/tours/featured?limit=${limit}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch featured tours');
    }
    return response.json();
  }

  async getPublishedTours(filters?: {
    country?: string;
    city?: string;
    limit?: number;
    offset?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.country) params.append('country', filters.country);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const url = `${API_CONFIG.BASE_URL}/api/tours${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch published tours');
    }
    return response.json();
  }

  async searchTours(query: string, filters?: {
    country?: string;
    limit?: number;
    offset?: number;
  }) {
    const params = new URLSearchParams({ q: query });
    if (filters?.country) params.append('country', filters.country);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/search?${params.toString()}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to search tours');
    }
    return response.json();
  }

  // Countries CRUD
  async getCountries() {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/countries`);
  }

  async createCountry(country: Database['public']['Tables']['countries']['Insert']) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/countries`, {
      method: 'POST',
      body: JSON.stringify(country),
    });
  }

  async updateCountry(id: string, updates: Partial<Country>) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/countries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteCountry(id: string) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/countries/${id}`, {
      method: 'DELETE',
    });
  }

  // Cities CRUD
  async getCities(countryId?: string) {
    let url = `${API_CONFIG.BASE_URL}/api/admin/cities`;
    if (countryId) {
      url += `?countryId=${countryId}`;
    }
    return fetchWithAuth(url);
  }

  async createCity(city: Database['public']['Tables']['cities']['Insert']) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/cities`, {
      method: 'POST',
      body: JSON.stringify(city),
    });
  }

  async updateCity(id: string, updates: Partial<City>) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/cities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteCity(id: string) {
    return fetchWithAuth(`${API_CONFIG.BASE_URL}/api/admin/cities/${id}`, {
      method: 'DELETE',
    });
  }
}

export const adminService = new AdminService();
