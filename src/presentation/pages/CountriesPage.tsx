import React from 'react';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { CountryCard } from '../components/Countries/CountryCard';
import { useCountries } from '../hooks/useCountries';

export function CountriesPage() {
  const { countries, loading, error } = useCountries();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Destinations</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore East Africa
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Discover the diverse landscapes, incredible wildlife, and rich cultures of Kenya, 
            Uganda, Tanzania, and Rwanda through our carefully curated adventures.
          </p>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {countries.map((country) => (
              <CountryCard key={country.id} country={country} />
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Why Choose East Africa?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Incredible Wildlife</h3>
              <p className="text-gray-600">
                Home to the Big Five, mountain gorillas, and the Great Migration, East Africa 
                offers unparalleled wildlife viewing opportunities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Rich Cultures</h3>
              <p className="text-gray-600">
                Experience vibrant traditions, meet local communities, and learn about centuries-old 
                cultures that continue to thrive today.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Conservation Impact</h3>
              <p className="text-gray-600">
                Your travels directly support conservation efforts and community development projects 
                throughout the region.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}