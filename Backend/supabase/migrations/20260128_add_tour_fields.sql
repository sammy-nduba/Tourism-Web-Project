-- Add missing columns to tours table for enhanced tour information
-- Migration: Add itinerary, what_to_bring, tags, min_age, physical_rating, and featured columns

-- Add itinerary column (JSONB array of itinerary items)
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]'::jsonb;

-- Add what_to_bring column (JSONB array of strings)
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS what_to_bring JSONB DEFAULT '[]'::jsonb;

-- Add tags column (JSONB array of strings)
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;

-- Add min_age column (minimum age requirement)
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS min_age INTEGER DEFAULT 12;

-- Add physical_rating column (1-5 difficulty rating)
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS physical_rating INTEGER DEFAULT 2 CHECK (physical_rating >= 1 AND physical_rating <= 5);

-- Add featured column (separate from is_published)
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add availability column (JSONB array of availability slots)
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS availability JSONB DEFAULT '[]'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN tours.itinerary IS 'Array of itinerary items with day, title, description, activities, accommodation, meals';
COMMENT ON COLUMN tours.what_to_bring IS 'Array of items travelers should bring';
COMMENT ON COLUMN tours.tags IS 'Array of tags for categorization and search';
COMMENT ON COLUMN tours.min_age IS 'Minimum age requirement for tour participants';
COMMENT ON COLUMN tours.physical_rating IS 'Physical difficulty rating from 1 (easy) to 5 (very challenging)';
COMMENT ON COLUMN tours.featured IS 'Whether this tour should be featured on homepage and special sections';
COMMENT ON COLUMN tours.availability IS 'Array of availability slots with startDate, endDate, spotsAvailable, totalSpots';
