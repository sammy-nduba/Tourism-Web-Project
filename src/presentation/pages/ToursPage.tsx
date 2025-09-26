import React from 'react';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { TourCard } from '../components/Tours/TourCard';
import { useTours } from '../hooks/useTours';

export function ToursPage() {
  const { tours, loading, error } = useTours();

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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Adventures</h1>
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
            Adventure Tours
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Discover East Africa through our carefully crafted adventure tours. From wildlife safaris 
            to mountain trekking, each journey offers unique experiences and meaningful connections.
          </p>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {tours && tours.data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tours.data.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
              
              {tours.meta.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{((tours.meta.page - 1) * tours.meta.limit) + 1}</span> to{' '}
                          <span className="font-medium">
                            {Math.min(tours.meta.page * tours.meta.limit, tours.meta.total)}
                          </span>{' '}
                          of <span className="font-medium">{tours.meta.total}</span> results
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No adventures found</h3>
              <p className="text-gray-600">Check back soon for new exciting adventures!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}