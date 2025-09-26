import { BaseEntity, Image, TourCategory, Country } from '../../shared/types';

export interface TourPrice {
  amount: number;
  currency: string;
  includes: string[];
  excludes: string[];
}

export interface TourItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  accommodation?: string;
  meals: string[];
}

export interface TourReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface TourAvailability {
  startDate: string;
  endDate: string;
  spotsAvailable: number;
  totalSpots: number;
}

export interface Tour extends BaseEntity {
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: TourCategory;
  duration: number;
  difficultyLevel: 'easy' | 'moderate' | 'challenging' | 'extreme';
  price: TourPrice;
  images: Image[];
  heroImage: Image;
  country: Country;
  city: string;
  itinerary: TourItinerary[];
  includes: string[];
  excludes: string[];
  whatToBring: string[];
  availability: TourAvailability[];
  reviews: TourReview[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  maxGroupSize: number;
  minAge: number;
  physicalRating: number;
  tags: string[];
}

export interface TourSummary extends Pick<Tour, 
  'id' | 'title' | 'slug' | 'summary' | 'category' | 'duration' | 
  'price' | 'heroImage' | 'country' | 'city' | 'rating' | 'reviewCount' | 
  'featured' | 'difficultyLevel'
> {}