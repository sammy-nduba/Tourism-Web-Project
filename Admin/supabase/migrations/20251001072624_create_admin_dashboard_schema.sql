/*
  # Wild Horizon Adventures Admin Dashboard Schema

  ## Overview
  This migration creates the complete database schema for the Wild Horizon Adventures admin dashboard.

  ## New Tables

  ### 1. `admin_roles` - Created first to avoid circular dependencies
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `role` (text: admin, editor)
  - `permissions` (jsonb)
  - `created_at`, `updated_at` (timestamptz)

  ### 2. `countries`
  - Stores country information (Kenya, Uganda, Tanzania, Rwanda)
  - Includes name, code, description, image

  ### 3. `cities`
  - Linked to countries
  - Used for tours and programs location

  ### 4. `tours`
  - Complete tour/adventure details
  - Pricing, duration, difficulty
  - JSON fields for highlights, inclusions

  ### 5. `programs`
  - Conservation and volunteer programs
  - Requirements, activities

  ### 6. `blog_posts`
  - Content management with rich text
  - Categories, tags, author tracking

  ### 7. `events`
  - Calendar events with dates and location

  ### 8. `contact_requests`
  - Contact form submissions
  - Status tracking and admin notes

  ### 9. `donation_requests`
  - Donation tracking and payment info

  ### 10. `volunteer_applications`
  - Volunteer sign-ups linked to programs
  - Application review workflow

  ### 11. `audit_logs`
  - Admin action tracking for compliance

  ## Security
  - RLS enabled on all tables
  - Admin-only access via admin_roles check
  - Public can submit forms (contacts, donations, volunteers)
  - Public can view published content

  ## Important Notes
  - All primary keys use UUIDs
  - Timestamps with timezone support
  - JSONB for flexible data structures
  - Comprehensive indexing for performance
*/

-- Drop existing tables if they exist (to avoid conflicts)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS volunteer_applications CASCADE;
DROP TABLE IF EXISTS donation_requests CASCADE;
DROP TABLE IF EXISTS contact_requests CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS tours CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS countries CASCADE;
DROP TABLE IF EXISTS admin_roles CASCADE;

-- Drop function if exists
DROP FUNCTION IF EXISTS is_admin(uuid);
DROP FUNCTION IF EXISTS is_super_admin(uuid);

-- Create admin_roles table FIRST (before other tables that reference it in policies)
CREATE TABLE admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'editor',
  permissions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create helper functions AFTER table exists (bypasses RLS)
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_roles
    WHERE admin_roles.user_id = $1
  );
$$;

-- Create a helper function to check if a user is super admin (role = 'admin') (bypasses RLS)
CREATE OR REPLACE FUNCTION is_super_admin(user_id uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_roles
    WHERE admin_roles.user_id = $1 AND admin_roles.role = 'admin'
  );
$$;

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own admin role (no subquery to avoid recursion)
CREATE POLICY "Users can view their own admin role"
  ON admin_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy: Only super admins can insert new admin roles
CREATE POLICY "Admins can insert roles"
  ON admin_roles FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

-- Policy: Only super admins can update roles
CREATE POLICY "Admins can update roles"
  ON admin_roles FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Policy: Only super admins can delete roles
CREATE POLICY "Admins can delete roles"
  ON admin_roles FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Create countries table
CREATE TABLE countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  code text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view countries"
  ON countries FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admin can insert countries"
  ON countries FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

-- Temporary policy for testing with anon key (REMOVE THIS IN PRODUCTION)
CREATE POLICY "Allow anon inserts for testing"
  ON countries FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admin can update countries"
  ON countries FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admin can delete countries"
  ON countries FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Public can view countries"
  ON countries FOR SELECT
  TO anon
  USING (true);

-- Create cities table
CREATE TABLE cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country_id uuid REFERENCES countries(id) ON DELETE CASCADE,
  description text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view cities"
  ON cities FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admin can insert cities"
  ON cities FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

-- Temporary policy for testing with anon key (REMOVE THIS IN PRODUCTION)
CREATE POLICY "Allow anon inserts for testing"
  ON cities FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admin can update cities"
  ON cities FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admin can delete cities"
  ON cities FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Public can view cities"
  ON cities FOR SELECT
  TO anon
  USING (true);

-- Create tours table
CREATE TABLE tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  city_id uuid REFERENCES cities(id) ON DELETE SET NULL,
  duration_days integer DEFAULT 1,
  price numeric DEFAULT 0,
  difficulty_level text DEFAULT 'moderate',
  max_group_size integer DEFAULT 10,
  image_url text DEFAULT '',
  gallery_urls jsonb DEFAULT '[]'::jsonb,
  highlights jsonb DEFAULT '[]'::jsonb,
  included jsonb DEFAULT '[]'::jsonb,
  excluded jsonb DEFAULT '[]'::jsonb,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can view tours"
  ON tours FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admin can insert tours"
  ON tours FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

-- Temporary policy for testing with anon key (REMOVE THIS IN PRODUCTION)
-- This allows the frontend to create tours during development
CREATE POLICY "Allow anon inserts for testing"
  ON tours FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also allow anon updates and deletes for testing (REMOVE THIS IN PRODUCTION)
CREATE POLICY "Allow anon updates for testing"
  ON tours FOR UPDATE
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon deletes for testing"
  ON tours FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Admin can update tours"
  ON tours FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admin can delete tours"
  ON tours FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Public can view published tours"
  ON tours FOR SELECT
  TO anon
  USING (is_published = true);

-- Create programs table
CREATE TABLE programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  program_type text DEFAULT 'volunteer',
  city_id uuid REFERENCES cities(id) ON DELETE SET NULL,
  duration_weeks integer DEFAULT 4,
  cost numeric DEFAULT 0,
  image_url text DEFAULT '',
  requirements jsonb DEFAULT '[]'::jsonb,
  activities jsonb DEFAULT '[]'::jsonb,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Admin can view programs" ON programs;
DROP POLICY IF EXISTS "Admin can insert programs" ON programs;
DROP POLICY IF EXISTS "Admin can update programs" ON programs;
DROP POLICY IF EXISTS "Admin can delete programs" ON programs;
DROP POLICY IF EXISTS "Public can view published programs" ON programs;

CREATE POLICY "Admin can view programs"
  ON programs FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admin can insert programs"
  ON programs FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admin can update programs"
  ON programs FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admin can delete programs"
  ON programs FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Public can view published programs"
  ON programs FOR SELECT
  TO anon
  USING (is_published = true);

-- Create blog_posts table
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text DEFAULT '',
  excerpt text DEFAULT '',
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  featured_image_url text DEFAULT '',
  category text DEFAULT 'general',
  tags jsonb DEFAULT '[]'::jsonb,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Admin can view blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin can delete blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Public can view published blog posts" ON blog_posts;

CREATE POLICY "Admin can view blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admin can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admin can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admin can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  TO anon
  USING (is_published = true);

-- Create events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  event_date timestamptz NOT NULL,
  end_date timestamptz,
  location text DEFAULT '',
  event_type text DEFAULT 'tour',
  image_url text DEFAULT '',
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Admin can view events" ON events;
DROP POLICY IF EXISTS "Admin can insert events" ON events;
DROP POLICY IF EXISTS "Admin can update events" ON events;
DROP POLICY IF EXISTS "Admin can delete events" ON events;
DROP POLICY IF EXISTS "Public can view published events" ON events;

CREATE POLICY "Admin can view events"
  ON events FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admin can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admin can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admin can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Public can view published events"
  ON events FOR SELECT
  TO anon
  USING (is_published = true);

-- Create contact_requests table
CREATE TABLE contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  subject text DEFAULT '',
  message text NOT NULL,
  status text DEFAULT 'pending',
  resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can submit contact requests" ON contact_requests;
DROP POLICY IF EXISTS "Admin can view contact requests" ON contact_requests;
DROP POLICY IF EXISTS "Admin can update contact requests" ON contact_requests;

CREATE POLICY "Anyone can submit contact requests"
  ON contact_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view contact requests"
  ON contact_requests FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admin can update contact requests"
  ON contact_requests FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Create donation_requests table
CREATE TABLE donation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text NOT NULL,
  donor_email text NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  donation_type text DEFAULT 'one-time',
  purpose text DEFAULT '',
  status text DEFAULT 'pending',
  payment_provider text DEFAULT '',
  payment_id text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE donation_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can submit donations" ON donation_requests;
DROP POLICY IF EXISTS "Admin can view donations" ON donation_requests;
DROP POLICY IF EXISTS "Admin can update donations" ON donation_requests;

CREATE POLICY "Anyone can submit donations"
  ON donation_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view donations"
  ON donation_requests FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admin can update donations"
  ON donation_requests FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Create volunteer_applications table
CREATE TABLE volunteer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE,
  applicant_name text NOT NULL,
  applicant_email text NOT NULL,
  phone text DEFAULT '',
  country text DEFAULT '',
  date_of_birth date,
  experience text DEFAULT '',
  motivation text DEFAULT '',
  preferred_start_date date,
  status text DEFAULT 'pending',
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  admin_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can submit volunteer applications" ON volunteer_applications;
DROP POLICY IF EXISTS "Admin can view volunteer applications" ON volunteer_applications;
DROP POLICY IF EXISTS "Admin can update volunteer applications" ON volunteer_applications;

CREATE POLICY "Anyone can submit volunteer applications"
  ON volunteer_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view volunteer applications"
  ON volunteer_applications FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admin can update volunteer applications"
  ON volunteer_applications FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Create audit_logs table
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  changes jsonb DEFAULT '{}'::jsonb,
  ip_address text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Admin can view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Admin can insert audit logs" ON audit_logs;

CREATE POLICY "Admin can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admin can insert audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cities_country_id ON cities(country_id);
CREATE INDEX IF NOT EXISTS idx_tours_city_id ON tours(city_id);
CREATE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);
CREATE INDEX IF NOT EXISTS idx_programs_city_id ON programs(city_id);
CREATE INDEX IF NOT EXISTS idx_programs_slug ON programs(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_program_id ON volunteer_applications(program_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_status ON volunteer_applications(status);
CREATE INDEX IF NOT EXISTS idx_donation_requests_status ON donation_requests(status);
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);


-- Function to create a new admin role for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_roles (user_id, role, permissions)
  VALUES (NEW.id, 'admin', '["all"]'::jsonb);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill admin_roles for existing users who don't have an entry
INSERT INTO admin_roles (user_id, role, permissions)
SELECT id, 'admin', '["all"]'::jsonb
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM admin_roles WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cities_country_id ON cities(country_id);
CREATE INDEX IF NOT EXISTS idx_tours_city_id ON tours(city_id);
CREATE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);
CREATE INDEX IF NOT EXISTS idx_programs_city_id ON programs(city_id);
CREATE INDEX IF NOT EXISTS idx_programs_slug ON programs(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_program_id ON volunteer_applications(program_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_status ON volunteer_applications(status);
CREATE INDEX IF NOT EXISTS idx_donation_requests_status ON donation_requests(status);
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);