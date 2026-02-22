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

  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

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
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'image_url') THEN
        ALTER TABLE public.trips ADD COLUMN image_url text;
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

-- 8. Lead Management Table
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text,
  phone_number text,
  email text,
  source text DEFAULT 'whatsapp_popup',
  status text DEFAULT 'new', -- new, contacted, interested, qualified, closed
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage leads" ON public.leads;
CREATE POLICY "Admins can manage leads" 
ON public.leads FOR ALL 
USING (public.isAdmin());

DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Anyone can submit a lead" 
ON public.leads FOR INSERT 
WITH CHECK (true);

-- 9. User Onboarding & Metadata
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'onboarding_complete') THEN
        ALTER TABLE public.users ADD COLUMN onboarding_complete boolean DEFAULT false;
    END IF;
END $$;

-- 10. Social Interactions (Likes & Comments)
CREATE TABLE IF NOT EXISTS public.story_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  story_id text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, story_id)
);

CREATE TABLE IF NOT EXISTS public.story_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  story_id text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.story_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own likes" ON public.story_likes;
CREATE POLICY "Users can manage their own likes" ON public.story_likes FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view likes" ON public.story_likes;
CREATE POLICY "Anyone can view likes" ON public.story_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own comments" ON public.story_comments;
CREATE POLICY "Users can manage their own comments" ON public.story_comments FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view comments" ON public.story_comments;
CREATE POLICY "Anyone can view comments" ON public.story_comments FOR SELECT USING (true);

-- 12. Robust Profile System
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  whatsapp_number text,
  avatar_url text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
CREATE POLICY "Users can manage their own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.isAdmin());

-- 13. Storage Setup & Policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('memories', 'memories', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload their own memories" ON storage.objects;
CREATE POLICY "Users can upload their own memories"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'memories' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can view their own memories" ON storage.objects;
CREATE POLICY "Users can view their own memories"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'memories' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Admins can view all storage" ON storage.objects;
CREATE POLICY "Admins can view all storage"
ON storage.objects FOR SELECT TO authenticated
USING (public.isAdmin());
