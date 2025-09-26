import React from 'react';
import { Heart, Globe, Users, Award, Shield, Leaf } from 'lucide-react';

export function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Conservation First',
      description: 'Every journey supports wildlife conservation and habitat protection across East Africa.'
    },
    {
      icon: Users,
      title: 'Community Impact',
      description: 'We partner with local communities to ensure tourism benefits everyone involved.'
    },
    {
      icon: Shield,
      title: 'Responsible Travel',
      description: 'Sustainable practices that minimize environmental impact and maximize positive outcomes.'
    },
    {
      icon: Globe,
      title: 'Cultural Respect',
      description: 'Authentic experiences that honor and celebrate local cultures and traditions.'
    }
  ];

  const stats = [
    { number: '15+', label: 'Years of Experience' },
    { number: '50+', label: 'Conservation Projects Supported' },
    { number: '10,000+', label: 'Travelers Inspired' },
    { number: '$2M+', label: 'Donated to Conservation' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Story & Mission
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Wild Horizon Adventures was born from a passion for East Africa's incredible wildlife 
              and a commitment to conservation. We create transformative travel experiences that 
              benefit both travelers and the communities they visit.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Founded on Conservation
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  Founded in 2009 by wildlife biologist Dr. Sarah Matthews, Wild Horizon Adventures 
                  emerged from a simple yet powerful vision: to create travel experiences that would 
                  inspire conservation action and support local communities.
                </p>
                <p>
                  After spending years researching mountain gorillas in Rwanda and working with 
                  conservation organizations across East Africa, Dr. Matthews recognized the 
                  incredible potential of responsible tourism to fund conservation efforts and 
                  provide sustainable livelihoods for local communities.
                </p>
                <p>
                  Today, we're proud to have supported over 50 conservation projects, worked with 
                  hundreds of local guides and community members, and inspired thousands of 
                  travelers to become conservation advocates.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/5471643/pexels-photo-5471643.jpeg"
                alt="Dr. Sarah Matthews with mountain gorillas in Rwanda"
                className="rounded-lg shadow-xl w-full h-96 object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-sm text-gray-900 font-medium">Dr. Sarah Matthews, Founder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every decision we make is guided by these core principles that shape how we operate 
              and the experiences we create.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Impact by the Numbers
            </h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Together with our travelers and partners, we're making a real difference for 
              conservation and communities across East Africa.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-emerald-100 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our passionate team combines decades of experience in wildlife conservation, 
              sustainable tourism, and East African culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg"
                alt="Dr. Sarah Matthews"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Dr. Sarah Matthews</h3>
              <p className="text-emerald-600 mb-3">Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                Wildlife biologist with 20+ years of conservation experience in East Africa.
              </p>
            </div>

            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
                alt="James Mwangi"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">James Mwangi</h3>
              <p className="text-emerald-600 mb-3">Head of Operations, Kenya</p>
              <p className="text-gray-600 text-sm">
                Born in Kenya, James brings intimate knowledge of local cultures and wildlife.
              </p>
            </div>

            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg"
                alt="Grace Mukamana"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Grace Mukamana</h3>
              <p className="text-emerald-600 mb-3">Conservation Programs Director</p>
              <p className="text-gray-600 text-sm">
                Leads our community partnerships and conservation project initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Conservation Mission
          </h2>
          <p className="text-xl mb-8 text-emerald-100">
            Ready to experience East Africa while making a positive impact? Let's plan your 
            adventure together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Start Planning
            </a>
            <a 
              href="/get-involved" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Support Our Work
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}