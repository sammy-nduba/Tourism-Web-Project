import { BaseEntity, Image, ProgramType, Country } from '../../shared/types';

export interface ProgramRequirements {
  minAge: number;
  maxAge?: number;
  skills: string[];
  languages: string[];
  experience: string[];
  commitment: string;
}

export interface Program extends BaseEntity {
  title: string;
  slug: string;
  summary: string;
  description: string;
  type: ProgramType;
  duration: string;
  price: {
    amount: number;
    currency: string;
    period: string;
  };
  heroImage: Image;
  gallery: Image[];
  country: Country;
  location: string;
  objectives: string[];
  activities: string[];
  accommodation: string;
  meals: string[];
  requirements: ProgramRequirements;
  includes: string[];
  excludes: string[];
  impact: string;
  testimonials: Array<{
    author: string;
    text: string;
    date: string;
    image?: Image;
  }>;
  startDates: string[];
  applicationDeadline: string;
  featured: boolean;
  spotsAvailable: number;
  tags: string[];
}

export interface ProgramSummary extends Pick<Program,
  'id' | 'title' | 'slug' | 'summary' | 'type' | 'duration' |
  'price' | 'heroImage' | 'country' | 'location' | 'featured' | 'spotsAvailable'
> {}