import { useState, useEffect } from 'react';
import { Country } from '../../domain/models';
import { CountryUseCases } from '../../domain/usecases/CountryUseCases';
import { countryRepository } from '../../data/repositories/CountryRepositoryImpl';

const countryUseCases = new CountryUseCases(countryRepository);

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await countryUseCases.getAllCountries();
        setCountries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch countries');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
}

export function useCountry(slug: string) {
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchCountry = async () => {
      try {
        setLoading(true);
        const data = await countryUseCases.getCountryBySlug(slug);
        setCountry(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch country');
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [slug]);

  return { country, loading, error };
}