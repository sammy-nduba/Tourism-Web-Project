import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { TourCard } from '../components/Tours/TourCard';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { useTours } from '../hooks/useTours';
import { useCountries } from '../hooks/useCountries';
import { SearchFilters } from '../../shared/types';
import { TourSummary } from '../../domain/models';
import { API_BASE_URL } from '../../shared/constants';

export function CountryToursPage() {
  const { country: countrySlug } = useParams<{ country: string }>();
  const [tours, setTours] = useState<TourSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { countries } = useCountries();

  // Find the current country
  const currentCountry = countries.find(country => country.slug === countrySlug);

  useEffect(() => {
    const loadCountryTours = async () => {
      if (!countrySlug) return;

      setLoading(true);
      setError(null);

      try {
        const filters: SearchFilters = {
          country: countrySlug,
          limit: 50 // Get all tours for this country
        };

        const response = await fetch(`${API_BASE_URL}/api/tours?${new URLSearchParams({
          country: countrySlug,
          limit: '50'
        })}`);

        if (!response.ok) {
          throw new Error('Failed to fetch tours');
        }

        const backendTours = await response.json();

        // Transform backend tours to frontend format
        const transformedTours: TourSummary[] = backendTours.map((tour: any) => ({
          id: tour.id,
          title: tour.title,
          slug: tour.slug,
          summary: tour.description?.substring(0, 150) + '...' || '',
          category: 'wildlife', // Default category
          duration: tour.duration_days,
          price: {
            amount: tour.price,
            currency: 'USD',
            includes: tour.included || [],
            excludes: tour.excluded || [],
          },
          heroImage: {
            id: `${tour.id}-hero`,
            url: tour.image_url,
            alt: tour.title,
          },
          country: tour.cities?.countries?.name?.toLowerCase() || countrySlug,
          city: tour.cities?.name || 'Various',
          rating: 4.5,
          reviewCount: 0,
          featured: tour.is_published,
          difficultyLevel: tour.difficulty_level,
        }));

        setTours(transformedTours);
      } catch (err) {
        console.error('Error loading country tours:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tours');
      } finally {
        setLoading(false);
      }
    };

    loadCountryTours();
  }, [countrySlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !currentCountry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? 'Error Loading Tours' : 'Country Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error || 'The requested country could not be found.'}
          </p>
          <Link
            to="/destinations"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <Link
              to="/destinations"
              className="inline-flex items-center text-emerald-100 hover:text-white mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Destinations
            </Link>
          </div>

          <div className="flex items-center mb-4">
            <span className="text-4xl mr-4">{currentCountry.flag}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Adventures in {currentCountry.name}
              </h1>
              <p className="text-xl text-emerald-100 mt-2">
                Discover incredible experiences in {currentCountry.name}
              </p>
            </div>
          </div>

          <div className="flex items-center text-emerald-100">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{currentCountry.capital} • {tours.length} adventures available</span>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {tours.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Tours Available</h2>
              <p className="text-gray-600 mb-6">
                We're currently working on adding amazing adventures in {currentCountry.name}.
                Check back soon for new experiences!
              </p>
              <Link
                to="/adventures"
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                View All Adventures
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Available Adventures
                </h2>
                <p className="text-gray-600">
                  Discover {tours.length} incredible experience{tours.length !== 1 ? 's' : ''} in {currentCountry.name}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Country Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Visit {currentCountry.name}?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {currentCountry.description}
            </p>
          </div>

          {currentCountry.highlights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCountry.highlights.map((highlight, index) => (
                <div key={index} className="text-center">
                  <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{currentCountry.flag}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{highlight}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}