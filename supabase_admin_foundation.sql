-- ==========================================
-- WANDERPALS ADMIN FOUNDATION SQL v2
-- FIXES: Infinite recursion in RLS policies
-- Run this in your Supabase SQL Editor
-- ==========================================

-- ─────────────────────────────────────────
-- 1. ADMIN CHECKER (SECURITY DEFINER)
--    This breaks the RLS recursion cycle.
--    It runs with elevated privileges and
--    bypasses row-level security entirely.
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Grant execute to all authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;


-- ─────────────────────────────────────────
-- 2. PROFILES TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    full_name TEXT,
    whatsapp_number TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user'
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop old broken policies first
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Users can read their OWN profile (no recursion, uses auth.uid() directly)
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Admins can read ALL profiles (uses is_admin() function, not a direct query)
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_admin());

-- Admins can update ALL profiles
CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (public.is_admin());


-- ─────────────────────────────────────────
-- 3. LEADS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT,
    full_name TEXT,
    email TEXT,
    phone_number TEXT,
    message TEXT,
    source TEXT DEFAULT 'direct',
    status TEXT DEFAULT 'new',
    notes TEXT,
    trip_interest TEXT,
    stay_interest TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop old broken policies
DROP POLICY IF EXISTS "Allow public insert to leads" ON public.leads;
DROP POLICY IF EXISTS "Allow admins full access to leads" ON public.leads;

-- Anyone can submit a lead (contact form, WhatsApp, etc.)
CREATE POLICY "Allow public insert to leads"
ON public.leads FOR INSERT
WITH CHECK (true);

-- Admins can do everything (uses is_admin() to avoid recursion)
CREATE POLICY "Allow admins full access to leads"
ON public.leads FOR ALL
TO authenticated
USING (public.is_admin());


-- ─────────────────────────────────────────
-- 4. AUTH TRIGGER (auto-create profile)
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─────────────────────────────────────────
-- 5. GRANTS & INDEXES
-- ─────────────────────────────────────────
GRANT ALL ON public.leads TO postgres, service_role;
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;

GRANT ALL ON public.profiles TO postgres, service_role;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;

CREATE INDEX IF NOT EXISTS profiles_whatsapp_idx ON public.profiles (whatsapp_number);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles (role);
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads (email);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads (status);

-- ─────────────────────────────────────────
-- 6. BACKFILL existing auth users who
--    don't yet have a profile row
-- ─────────────────────────────────────────
INSERT INTO public.profiles (id, full_name, role)
SELECT
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  'user'
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = au.id
);

-- ==========================================
-- DONE. Reload your Admin Dashboard.
-- ==========================================
