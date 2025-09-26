import { BaseEntity, Coordinates, Image } from '../../shared/types';

export interface Country extends BaseEntity {
  name: string;
  code: string;
  slug: string;
  description: string;
  heroImage: Image;
  flag: string;
  capital: string;
  language: string;
  currency: string;
  timezone: string;
  highlights: string[];
  coordinates: Coordinates;
  tourCount: number;
  cityCount: number;
}