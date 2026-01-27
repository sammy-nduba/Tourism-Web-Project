import { Country } from '../models/Country';
import { CountryRepository } from '../ports/repositories';

export class CountryUseCases {
  constructor(private countryRepository: CountryRepository) {}

  async getAllCountries(): Promise<Country[]> {
    return this.countryRepository.getAll();
  }

  async getCountryBySlug(slug: string): Promise<Country | null> {
    if (!slug) throw new Error('Country slug is required');
    return this.countryRepository.getBySlug(slug);
  }
}