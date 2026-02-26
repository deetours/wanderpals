-- ADMIN DASHBOARD SCHEMA UPDATE
-- Run this in your Supabase SQL Editor to add all admin dashboard columns

-- ═══ TRIPS TABLE: Add missing columns ═══
DO $$ BEGIN
    -- Name (alias for title, some code uses 'name')
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'name') THEN
        ALTER TABLE public.trips ADD COLUMN name text;
    END IF;
    
    -- Tagline
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'tagline') THEN
        ALTER TABLE public.trips ADD COLUMN tagline text;
    END IF;
    
    -- Group size (code uses group_size, schema had max_group_size)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'group_size') THEN
        ALTER TABLE public.trips ADD COLUMN group_size integer DEFAULT 12;
    END IF;
    
    -- Featured flag (controls Journeys page)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'is_featured') THEN
        ALTER TABLE public.trips ADD COLUMN is_featured boolean DEFAULT false;
    END IF;
    
    -- Show on All Trips page
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'show_on_all_trips') THEN
        ALTER TABLE public.trips ADD COLUMN show_on_all_trips boolean DEFAULT true;
    END IF;
    
    -- Show on Journeys page
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'show_on_journeys') THEN
        ALTER TABLE public.trips ADD COLUMN show_on_journeys boolean DEFAULT false;
    END IF;
    
    -- Itinerary (JSON array of days)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'itinerary') THEN
        ALTER TABLE public.trips ADD COLUMN itinerary jsonb DEFAULT '[]'::jsonb;
    END IF;
    
    -- Inclusions
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'inclusions') THEN
        ALTER TABLE public.trips ADD COLUMN inclusions jsonb DEFAULT '[]'::jsonb;
    END IF;
    
    -- Exclusions
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'exclusions') THEN
        ALTER TABLE public.trips ADD COLUMN exclusions jsonb DEFAULT '[]'::jsonb;
    END IF;
    
    -- Terms & Conditions
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'terms') THEN
        ALTER TABLE public.trips ADD COLUMN terms jsonb DEFAULT '[]'::jsonb;
    END IF;
    
    -- Things to Carry
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'things_to_carry') THEN
        ALTER TABLE public.trips ADD COLUMN things_to_carry jsonb DEFAULT '[]'::jsonb;
    END IF;
    
    -- Dates & Availability
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'dates') THEN
        ALTER TABLE public.trips ADD COLUMN dates jsonb DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- Sync name and title so both work
UPDATE public.trips SET name = title WHERE name IS NULL AND title IS NOT NULL;

-- ═══ STAYS TABLE ═══
CREATE TABLE IF NOT EXISTS public.stays (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  location text,
  tagline text,
  description text,
  price decimal,
  room_type text DEFAULT 'Dorm',
  image_url text,
  amenities jsonb DEFAULT '[]'::jsonb,
  gallery jsonb DEFAULT '[]'::jsonb,
  capacity integer DEFAULT 4,
  status text DEFAULT 'draft',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.stays ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published stays" ON public.stays;
CREATE POLICY "Anyone can view published stays" 
ON public.stays FOR SELECT 
USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage stays" ON public.stays;
CREATE POLICY "Admins can manage stays" 
ON public.stays FOR ALL 
USING (public.isAdmin());

-- ═══ LEADS TABLE: Add missing columns ═══
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'name') THEN
        ALTER TABLE public.leads ADD COLUMN name text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'trip_interest') THEN
        ALTER TABLE public.leads ADD COLUMN trip_interest text;
    END IF;
END $$;

-- Sync lead names from full_name
UPDATE public.leads SET name = full_name WHERE name IS NULL AND full_name IS NOT NULL;

-- ═══ PROFILES TABLE: Add role column ═══
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role text DEFAULT 'user';
    END IF;
END $$;

-- ═══ IMAGES STORAGE BUCKET ═══
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users (admins) to upload images
DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
CREATE POLICY "Admins can upload images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow anyone to view images (they're public)
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

SELECT 'Schema update complete! All admin dashboard columns are ready.' AS result;
