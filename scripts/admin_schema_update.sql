-- ADMIN DASHBOARD SCHEMA UPDATE (Ultra Robust Version)
-- Run this in your Supabase SQL Editor

-- ═══ 1. TRIPS TABLE SETUP ═══
CREATE TABLE IF NOT EXISTS public.trips (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

DO $$ BEGIN
    -- Add all missing columns to trips
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'tagline') THEN ALTER TABLE public.trips ADD COLUMN tagline text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'description') THEN ALTER TABLE public.trips ADD COLUMN description text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'region') THEN ALTER TABLE public.trips ADD COLUMN region text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'terrain') THEN ALTER TABLE public.trips ADD COLUMN terrain text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'duration') THEN ALTER TABLE public.trips ADD COLUMN duration integer DEFAULT 5; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'price') THEN ALTER TABLE public.trips ADD COLUMN price decimal DEFAULT 0; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'group_size') THEN ALTER TABLE public.trips ADD COLUMN group_size integer DEFAULT 12; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'image_url') THEN ALTER TABLE public.trips ADD COLUMN image_url text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'status') THEN ALTER TABLE public.trips ADD COLUMN status text DEFAULT 'draft'; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'is_featured') THEN ALTER TABLE public.trips ADD COLUMN is_featured boolean DEFAULT false; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'show_on_all_trips') THEN ALTER TABLE public.trips ADD COLUMN show_on_all_trips boolean DEFAULT true; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'show_on_journeys') THEN ALTER TABLE public.trips ADD COLUMN show_on_journeys boolean DEFAULT false; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'itinerary') THEN ALTER TABLE public.trips ADD COLUMN itinerary jsonb DEFAULT '[]'::jsonb; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'inclusions') THEN ALTER TABLE public.trips ADD COLUMN inclusions jsonb DEFAULT '[]'::jsonb; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'exclusions') THEN ALTER TABLE public.trips ADD COLUMN exclusions jsonb DEFAULT '[]'::jsonb; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'terms') THEN ALTER TABLE public.trips ADD COLUMN terms jsonb DEFAULT '[]'::jsonb; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'things_to_carry') THEN ALTER TABLE public.trips ADD COLUMN things_to_carry jsonb DEFAULT '[]'::jsonb; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'dates') THEN ALTER TABLE public.trips ADD COLUMN dates jsonb DEFAULT '[]'::jsonb; END IF;

    -- Data sync
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'title') THEN
        UPDATE public.trips SET name = title WHERE name IS NULL AND title IS NOT NULL;
    END IF;
END $$;

-- ═══ 2. STAYS TABLE SETUP ═══
CREATE TABLE IF NOT EXISTS public.stays (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stays' AND column_name = 'location') THEN ALTER TABLE public.stays ADD COLUMN location text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stays' AND column_name = 'tagline') THEN ALTER TABLE public.stays ADD COLUMN tagline text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stays' AND column_name = 'description') THEN ALTER TABLE public.stays ADD COLUMN description text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stays' AND column_name = 'price') THEN ALTER TABLE public.stays ADD COLUMN price decimal DEFAULT 0; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stays' AND column_name = 'room_type') THEN ALTER TABLE public.stays ADD COLUMN room_type text DEFAULT 'Dorm'; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stays' AND column_name = 'image_url') THEN ALTER TABLE public.stays ADD COLUMN image_url text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stays' AND column_name = 'capacity') THEN ALTER TABLE public.stays ADD COLUMN capacity integer DEFAULT 4; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stays' AND column_name = 'status') THEN ALTER TABLE public.stays ADD COLUMN status text DEFAULT 'draft'; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stays' AND column_name = 'amenities') THEN ALTER TABLE public.stays ADD COLUMN amenities jsonb DEFAULT '[]'::jsonb; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stays' AND column_name = 'gallery') THEN ALTER TABLE public.stays ADD COLUMN gallery jsonb DEFAULT '[]'::jsonb; END IF;
END $$;

-- Policies for Stays (after ensuring status column exists)
ALTER TABLE public.stays ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view published stays" ON public.stays;
CREATE POLICY "Anyone can view published stays" ON public.stays FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Admins can manage stays" ON public.stays;
CREATE POLICY "Admins can manage stays" ON public.stays FOR ALL USING (true); -- Loose for setup, fix with isAdmin() later

-- ═══ 3. LEADS TABLE SETUP ═══
CREATE TABLE IF NOT EXISTS public.leads (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'name') THEN ALTER TABLE public.leads ADD COLUMN name text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'email') THEN ALTER TABLE public.leads ADD COLUMN email text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'phone_number') THEN ALTER TABLE public.leads ADD COLUMN phone_number text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'status') THEN ALTER TABLE public.leads ADD COLUMN status text DEFAULT 'new'; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'notes') THEN ALTER TABLE public.leads ADD COLUMN notes text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'source') THEN ALTER TABLE public.leads ADD COLUMN source text DEFAULT 'direct'; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'trip_interest') THEN ALTER TABLE public.leads ADD COLUMN trip_interest text; END IF;

    -- Data sync for leads
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'full_name') THEN
        UPDATE public.leads SET name = full_name WHERE name IS NULL AND full_name IS NOT NULL;
    END IF;
END $$;

-- ═══ 4. PROFILES & ROLES ═══
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role text DEFAULT 'user';
    END IF;
END $$;

-- ═══ 5. STORAGE SETUP ═══
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public access for images" ON storage.objects;
CREATE POLICY "Public access for images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
CREATE POLICY "Admins can upload images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');

SELECT 'Schema update success! You are ready to go.' AS result;
