import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { ROUTES } from '../../../shared/constants';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="h-8 w-8 text-emerald-400" />
              <span className="font-bold text-xl">Wild Horizon Adventures</span>
            </div>
            <p className="text-gray-300 mb-4">
              Discover the heart of Africa through responsible travel and conservation efforts 
              in Kenya, Uganda, Tanzania, and Rwanda.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to={ROUTES.COUNTRIES} className="text-gray-300 hover:text-emerald-400 transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to={ROUTES.TOURS} className="text-gray-300 hover:text-emerald-400 transition-colors">
                  Adventures
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PROGRAMS} className="text-gray-300 hover:text-emerald-400 transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link to={ROUTES.BLOG} className="text-gray-300 hover:text-emerald-400 transition-colors">
                  Stories
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ABOUT} className="text-gray-300 hover:text-emerald-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4 text-emerald-400" />
                <span>info@wildhorizonadventures.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4 text-emerald-400" />
                <span>+254 700 123 456</span>
              </div>
              <div className="flex items-start space-x-2 text-gray-300">
                <MapPin className="h-4 w-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span>Nairobi, Kenya<br />East Africa</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Connected</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Subscribe to our newsletter for the latest adventure stories and conservation updates.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Wild Horizon Adventures. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to={ROUTES.PRIVACY} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to={ROUTES.TERMS} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to={ROUTES.FAQ} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}