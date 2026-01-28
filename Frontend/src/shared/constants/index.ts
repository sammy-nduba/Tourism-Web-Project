import { Country } from '../types';

export const COUNTRIES: Record<Country, { name: string; code: string; flag: string }> = {
  kenya: { name: 'Kenya', code: 'KE', flag: '🇰🇪' },
  uganda: { name: 'Uganda', code: 'UG', flag: '🇺🇬' },
  tanzania: { name: 'Tanzania', code: 'TZ', flag: '🇹🇿' },
  rwanda: { name: 'Rwanda', code: 'RW', flag: '🇷🇼' },
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3000');

export const API_ENDPOINTS = {
  COUNTRIES: '/api/countries',
  CITIES: '/api/cities',
  TOURS: '/api/tours',
  PROGRAMS: '/api/programs',
  BLOG: '/api/blog',
  CONTACT: '/api/contact',
  DONATE: '/api/donate',
  SEARCH: '/api/search',
  FAQ: '/api/faq',
} as const;

export const ROUTES = {
  HOME: '/',
  COUNTRIES: '/destinations',
  COUNTRY: '/adventures/:country',
  CITY: '/destinations/:country/:city',
  TOURS: '/adventures',
  TOUR: '/adventures/:slug',
  PROGRAMS: '/programs',
  PROGRAM: '/programs/:slug',
  BLOG: '/stories',
  BLOG_POST: '/stories/:slug',
  ABOUT: '/about',
  CONTACT: '/contact',
  DONATE: '/get-involved',
  SEARCH: '/search',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  BOOKING_SUCCESS: '/booking/success',
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 12,
  DEFAULT_PAGE: 1,
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;