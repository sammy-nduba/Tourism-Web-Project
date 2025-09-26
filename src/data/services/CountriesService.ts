import { Country } from '../../domain/models';
import { mockCountries } from '../mocks/countries';

export class CountriesService {
  async getCountries(): Promise<Country[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockCountries;
  }

  async getCountryBySlug(slug: string): Promise<Country | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockCountries.find(country => country.slug === slug) || null;
  }
}

export const countriesService = new CountriesService();