-- Storage Policies for tour-images bucket
-- Enable authenticated users to upload and download images

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;

-- Create new policies for the tour-images bucket
CREATE POLICY "Allow authenticated upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'tour-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'tour-images');

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'tour-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated update"
ON storage.objects FOR UPDATE
WITH CHECK (
  bucket_id = 'tour-images'
  AND auth.role() = 'authenticated'
);
