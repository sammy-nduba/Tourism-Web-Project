export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface TourCountry {
  id: string
  name: string
  code: string
  flag_emoji: string
  created_at: string
  updated_at: string
}

export interface TourCity {
  id: string
  name: string
  country_id: string
  created_at: string
  updated_at: string
}

export interface Tour {
  id: string
  title: string
  slug: string
  description: string
  location: string
  country_id: string
  city_id: string
  price: number
  duration: string
  experience_level: 'Budget' | 'Comfort' | 'Luxury' | 'Platinum Experience'
  max_group_size: number
  featured: boolean
  published: boolean
  images: string[]
  itinerary: Json
  included: string[]
  excluded: string[]
  requirements: string[]
  created_at: string
  updated_at: string
  country?: TourCountry
  city?: TourCity
}

export interface CreateTourData {
  title: string
  slug: string
  description: string
  location: string
  country_id: string
  city_id: string
  price: number
  duration: string
  experience_level: 'Budget' | 'Comfort' | 'Luxury' | 'Platinum Experience'
  max_group_size: number
  featured?: boolean
  published?: boolean
  images?: string[]
  itinerary?: Json
  included?: string[]
  excluded?: string[]
  requirements?: string[]
}

export interface UpdateTourData {
  title?: string
  slug?: string
  description?: string
  location?: string
  country_id?: string
  city_id?: string
  price?: number
  duration?: string
  experience_level?: 'Budget' | 'Comfort' | 'Luxury' | 'Platinum Experience'
  max_group_size?: number
  featured?: boolean
  published?: boolean
  images?: string[]
  itinerary?: Json
  included?: string[]
  excluded?: string[]
  requirements?: string[]
}