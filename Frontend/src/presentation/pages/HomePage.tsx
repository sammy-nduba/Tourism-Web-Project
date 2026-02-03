import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Heart, Users, Award } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { ROUTES } from '../../shared/constants';
import { Image } from '../components/UI/Image';

export function HomePage() {

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


      {/* Why Choose Kenya? Section */}
      <section className="pt-20 pb-0 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 uppercase tracking-wide">
            Why Choose Kenya?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Beaches Card */}
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&w=800&h=440&fit=crop"
                alt="Sun-Kissed Beaches"
                className="w-full h-[220px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Sun-Kissed Beaches</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Relax on pristine shores from Diani to Lamu with turquoise waters and vibrant culture.
                </p>
              </div>
            </div>

            {/* Safaris Card */}
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&w=800&h=440&fit=crop"
                alt="Thrilling Safaris"
                className="w-full h-[220px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Thrilling Safaris</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Explore the wild with game drives in Maasai Mara, Amboseli, and Tsavo.
                </p>
              </div>
            </div>

            {/* Heritage Card */}
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1564760055775-d63b17a55c44?ixlib=rb-4.0.3&w=800&h=440&fit=crop"
                alt="Rich Heritage"
                className="w-full h-[220px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Rich Heritage</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Experience diverse cultures, historical towns, and breathtaking natural landscapes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Adventures Section */}
      <section className="pt-12 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Featured Adventures
            </h2>
            <div className="w-24 h-1.5 bg-emerald-500 mx-auto mb-6 rounded-full" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Carefully curated experiences that showcase the very best of East Africa's natural wonders and cultural heritage.
            </p>
          </div>

          <div className="flex flex-col gap-16">
            {[
              {
                id: 1,
                title: "Classic Bush & Beach Safari",
                image: "/images/featured/bush-beach.png",
                description: "The quintessential African experience. Witness the big five in their natural habitat before unwinding on the sapphire shores of the Indian Ocean.",
                subcategories: ["Luxury Maasai Mara Safari", "Diani Beach Relaxation", "Serengeti & Zanzibar Combo", "Amboseli & Watamu Escape"]
              },
              {
                id: 2,
                title: "Safari Immersion",
                image: "/images/featured/safari-immersion.png",
                description: "Go beyond the vehicle. These immersive journeys offer intimate encounters with wildlife and deep connections with local communities.",
                subcategories: ["Walking Safaris in Laikipia", "Gorilla Trekking in Bwindi", "Cultural Village Stays", "Great Migration Experience"]
              },
              {
                id: 3,
                title: "Coastal Getaway",
                image: "/images/featured/coastal-getaway.png",
                description: "Escape to paradise. explore ancient Swahili culture, dive into vibrant coral reefs, and relax on some of the world's most beautiful beaches.",
                subcategories: ["Lamu Archipelago Exploration", "North Coast Marine Park", "Kilifi Creek Adventures", "Shimoni Deep Sea Fishing"]
              }
            ].map((adventure, index) => (
              <div
                key={adventure.id}
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-0 bg-gray-50 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 group border border-gray-100`}
              >
                <div className="w-full lg:w-3/5 h-[400px] lg:h-[500px] overflow-hidden">
                  <img
                    src={adventure.image}
                    alt={adventure.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                  />
                </div>
                <div className="w-full lg:w-2/5 p-10 lg:p-14 flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-6 group-hover:text-emerald-700 transition-colors">
                    {adventure.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                    {adventure.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-10">
                    {adventure.subcategories.map((sub) => (
                      <div key={sub} className="flex items-center gap-3 text-gray-700 group/sub">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover/sub:scale-150 transition-transform" />
                        <span className="text-sm font-semibold tracking-wide uppercase">{sub}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Button size="lg" className="rounded-full px-8" asChild>
                      <Link to={`${ROUTES.TOURS}?category=${encodeURIComponent(adventure.title)}`}>
                        Explore Now
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="mt-20 text-center">
            <Button variant="outline" size="lg" className="rounded-full border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-10" asChild>
              <Link to={ROUTES.TOURS}>
                View All Adventure Categories
              </Link>
            </Button>
          </div> */}
        </div>
      </section>



      {/* Mission Section
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
      </section> */}


      {/* Stats Section
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
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
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
      </section> */}
    </div>
  );
}