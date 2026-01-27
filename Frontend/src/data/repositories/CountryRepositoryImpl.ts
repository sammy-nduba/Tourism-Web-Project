import { Country } from '../../domain/models';
import { CountryRepository } from '../../domain/ports/repositories';
import { countriesService } from '../services/CountriesService';

export class CountryRepositoryImpl implements CountryRepository {
  async getAll(): Promise<Country[]> {
    return countriesService.getCountries();
  }

  async getBySlug(slug: string): Promise<Country | null> {
    return countriesService.getCountryBySlug(slug);
  }
}

export const countryRepository = new CountryRepositoryImpl();