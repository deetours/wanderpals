-- PHASE 1: SECURITY HARDENING & SCHEMA SETUP (Robust Version)
-- Run this in your Supabase SQL Editor

-- 1. Create Roles Enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin', 'superadmin');
    END IF;
END $$;

-- 2. Setup public.users table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure role column exists in public.users
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE public.users ADD COLUMN role user_role DEFAULT 'user'::user_role;
    END IF;
END $$;

-- 3. Create Admin Check Function
CREATE OR REPLACE FUNCTION public.isAdmin() 
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin'::user_role, 'superadmin'::user_role)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Set up RLS for Users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
CREATE POLICY "Admins can view all profiles" 
ON public.users FOR SELECT 
USING (public.isAdmin());

-- 5. Trigger for new user sync
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (new.id, new.email, 'user')
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Setup Trips Table with RLS
CREATE TABLE IF NOT EXISTS public.trips (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure missing columns exist in trips
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'description') THEN
        ALTER TABLE public.trips ADD COLUMN description text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'region') THEN
        ALTER TABLE public.trips ADD COLUMN region text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'terrain') THEN
        ALTER TABLE public.trips ADD COLUMN terrain text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'duration') THEN
        ALTER TABLE public.trips ADD COLUMN duration integer;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'price') THEN
        ALTER TABLE public.trips ADD COLUMN price decimal;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'max_group_size') THEN
        ALTER TABLE public.trips ADD COLUMN max_group_size integer;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'status') THEN
        ALTER TABLE public.trips ADD COLUMN status text DEFAULT 'draft';
    END IF;
END $$;

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published trips" ON public.trips;
CREATE POLICY "Anyone can view published trips" 
ON public.trips FOR SELECT 
USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage trips" ON public.trips;
CREATE POLICY "Admins can manage trips" 
ON public.trips FOR ALL 
USING (public.isAdmin());

-- 7. Setup Memories Table with RLS
CREATE TABLE IF NOT EXISTS public.memories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES public.trips(id),
  content text,
  media_urls jsonb DEFAULT '[]'::jsonb,
  visibility text DEFAULT 'private',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own memories" ON public.memories;
CREATE POLICY "Users can manage their own memories" 
ON public.memories FOR ALL 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view public memories" ON public.memories;
CREATE POLICY "Anyone can view public memories" 
ON public.memories FOR SELECT 
USING (visibility = 'public');

DROP POLICY IF EXISTS "Admins can view all memories" ON public.memories;
CREATE POLICY "Admins can view all memories" 
ON public.memories FOR SELECT 
USING (public.isAdmin());

