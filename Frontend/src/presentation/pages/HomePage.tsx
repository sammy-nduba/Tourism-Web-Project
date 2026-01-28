import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Heart, Users, Award } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { TourCard } from '../components/Tours/TourCard';
import { CountryCard } from '../components/Countries/CountryCard';
import { TourCardSkeleton, CountryCardSkeleton } from '../components/UI/Skeleton';
import { useFeaturedTours } from '../hooks/useTours';
import { useCountries } from '../hooks/useCountries';
import { ROUTES } from '../../shared/constants';

export function HomePage() {
  const { tours: featuredTours, loading: toursLoading } = useFeaturedTours(3);
  const { countries, loading: countriesLoading } = useCountries();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg)',
          }}
        />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Wild Horizon
            <span className="block text-emerald-300">Adventures</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto leading-relaxed">
            Discover the heart of East Africa through responsible travel and conservation efforts
            in Kenya, Uganda, Tanzania, and Rwanda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to={ROUTES.TOURS}>
                Explore Adventures
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
              <Link to={ROUTES.PROGRAMS}>
                Get Involved
              </Link>
            </Button>
          </div>
        </div>
      </section>


      {/* Destinations Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore East Africa
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From Kenya's savannas to Rwanda's mountains, discover the diverse landscapes and cultures
              of East Africa.
            </p>
          </div>

          {countriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[...Array(4)].map((_, i) => (
                <CountryCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {countries.map((country) => (
                  <CountryCard key={country.id} country={country} />
                ))}
              </div>

              <div className="text-center">
                <Button size="lg" variant="outline" asChild>
                  <Link to={ROUTES.COUNTRIES}>
                    Discover All Destinations
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>



      {/* Featured Tours Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Adventures
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and highly-rated adventure experiences across East Africa.
            </p>
          </div>

          {toursLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[...Array(3)].map((_, i) => (
                <TourCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>

              <div className="text-center">
                <Button size="lg" asChild>
                  <Link to={ROUTES.TOURS}>
                    View All Adventures
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>



      {/* Mission Section */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Adventure with Purpose
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Every journey with Wild Horizon Adventures supports local communities and conservation
                efforts. We believe in responsible travel that creates positive impact for wildlife,
                environments, and people.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Heart className="h-6 w-6 text-emerald-600 mr-3 mt-0.5" />
                  <span className="text-gray-700">
                    Support local communities and conservation projects
                  </span>
                </li>
                <li className="flex items-start">
                  <Globe className="h-6 w-6 text-emerald-600 mr-3 mt-0.5" />
                  <span className="text-gray-700">
                    Sustainable and responsible travel practices
                  </span>
                </li>
                <li className="flex items-start">
                  <Users className="h-6 w-6 text-emerald-600 mr-3 mt-0.5" />
                  <span className="text-gray-700">
                    Small group experiences with expert local guides
                  </span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to={ROUTES.ABOUT}>Learn Our Story</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to={ROUTES.PROGRAMS}>Conservation Programs</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/8965191/pexels-photo-8965191.jpeg"
                alt="Conservation work in Rwanda"
                className="rounded-lg shadow-xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Globe className="h-8 w-8 text-emerald-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">4</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <Heart className="h-8 w-8 text-emerald-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600">Conservation Projects</div>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-emerald-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">10K+</div>
              <div className="text-gray-600">Travelers</div>
            </div>
            <div className="text-center">
              <Award className="h-8 w-8 text-emerald-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">15</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for Your Adventure?
          </h2>
          <p className="text-xl mb-8 text-emerald-100">
            Join us in exploring East Africa while making a positive impact on conservation
            and local communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100" asChild>
              <Link to={ROUTES.CONTACT}>Start Planning</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10" asChild>
              <Link to={ROUTES.DONATE}>Support Our Mission</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}