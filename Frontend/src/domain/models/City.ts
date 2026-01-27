import { BaseEntity, Coordinates, Image, Country } from '../../shared/types';

export interface City extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  heroImage: Image;
  gallery: Image[];
  country: Country;
  coordinates: Coordinates;
  highlights: string[];
  population?: number;
  elevation?: number;
  climate: string;
  bestTimeToVisit: string;
  tourCount: number;
  featured: boolean;
}