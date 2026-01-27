import { Country } from '../../domain/models';
import { API_BASE_URL, API_ENDPOINTS } from '../../shared/constants';

// Backend country structure based on your database schema
interface BackendCountry {
  id: string;
  name: string;
  code: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export class CountriesService {
  private async apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private transformBackendCountryToFrontend(country: BackendCountry): Country {
    return {
      id: country.id,
      createdAt: country.created_at,
      updatedAt: country.updated_at,
      name: country.name,
      slug: country.code.toLowerCase(),
      code: country.code,
      description: country.description,
      heroImage: {
        id: `${country.id}-hero`,
        url: country.image_url,
        alt: country.name,
      },
      flag: `${country.code} flag`, // Would need proper flag data from backend
      capital: 'Capital', // Would need to be added to backend
      language: 'English', // Would need to be added to backend
      currency: 'USD', // Would need to be added to backend
      timezone: 'UTC+3', // Would need to be added to backend
      highlights: [], // Would need to be added to backend
      coordinates: { latitude: 0, longitude: 0 }, // Would need to be added to backend
      tourCount: 0, // Would need to be added to backend
      cityCount: 0, // Would need to be added to backend
    };
  }

  async getCountries(): Promise<Country[]> {
    try {
      const backendCountries: BackendCountry[] = await this.apiCall<BackendCountry[]>(API_ENDPOINTS.COUNTRIES);
      return backendCountries.map(country => this.transformBackendCountryToFrontend(country));
    } catch (error) {
      console.error('Failed to fetch countries:', error);
      throw error;
    }
  }

  async getCountryBySlug(slug: string): Promise<Country | null> {
    try {
      const backendCountry: BackendCountry = await this.apiCall<BackendCountry>(`${API_ENDPOINTS.COUNTRIES}/slug/${slug}`);
      return this.transformBackendCountryToFrontend(backendCountry);
    } catch (error) {
      console.error(`Failed to fetch country ${slug}:`, error);
      return null;
    }
  }
}

export const countriesService = new CountriesService();