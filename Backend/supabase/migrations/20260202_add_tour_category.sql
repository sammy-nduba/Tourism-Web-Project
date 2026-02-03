-- Migration to add category column to tours table
-- Created: 2026-02-02

ALTER TABLE tours ADD COLUMN IF NOT EXISTS category TEXT;

-- Update existing tours with a default category if needed
-- UPDATE tours SET category = 'Classic Bush & Beach Safari' WHERE category IS NULL;
