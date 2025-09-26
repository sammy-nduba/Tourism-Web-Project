import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, Globe } from 'lucide-react';
import { ROUTES } from '../../../shared/constants';
import { cn } from '../../../shared/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: ROUTES.HOME },
    { name: 'Destinations', href: ROUTES.COUNTRIES },
    { name: 'Adventures', href: ROUTES.TOURS },
    { name: 'Programs', href: ROUTES.PROGRAMS },
    { name: 'Stories', href: ROUTES.BLOG },
    { name: 'Get Involved', href: ROUTES.DONATE },
    { name: 'About', href: ROUTES.ABOUT },
    { name: 'Contact', href: ROUTES.CONTACT },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-emerald-600" />
              <span className="font-bold text-xl text-gray-900">Wild Horizon Adventures</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <Link
              to={ROUTES.SEARCH}
              className="text-gray-700 hover:text-emerald-600 p-2 transition-colors"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link
              to={ROUTES.DONATE}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Get Involved
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-emerald-600 p-2 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          'lg:hidden transition-all duration-200 ease-in-out',
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        )}>
          <div className="pt-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-700 hover:text-emerald-600 px-3 py-2 text-base font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <Link
                to={ROUTES.SEARCH}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center text-gray-700 hover:text-emerald-600 px-3 py-2 text-base font-medium transition-colors"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Link>
              <Link
                to={ROUTES.DONATE}
                onClick={() => setMobileMenuOpen(false)}
                className="block bg-emerald-600 text-white px-3 py-2 mx-3 mt-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-center"
              >
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}