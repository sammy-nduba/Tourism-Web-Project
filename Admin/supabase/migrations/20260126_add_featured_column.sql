-- Add featured column to tours table
ALTER TABLE tours ADD COLUMN featured boolean DEFAULT false;

-- Create index for featured tours queries
CREATE INDEX idx_tours_featured_published ON tours(featured, is_published);
