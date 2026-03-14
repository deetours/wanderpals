-- ==========================================
-- WANDERPALS COMPLETE FIX SQL
-- Fixes:
--   1. "operator does not exist: text = user_role" error
--   2. Trip/Stay RLS policies for admin editing
--   3. Public read access for published stays + trips
-- Run this in your Supabase SQL Editor
-- ==========================================

-- ─────────────────────────────────────────
-- 1. DROP & RECREATE isAdmin() with safe cast
--    This is the root fix for the type mismatch error.
--    role::text converts the enum to text before comparing.
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.isAdmin()
RETURNS boolean AS $$
BEGIN
  -- Check both possible tables (profiles and users)
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role::text IN ('admin', 'superadmin')
  ) OR EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role::text IN ('admin', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Also update is_admin() if it exists (some setups use this name)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role::text IN ('admin', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION public.isAdmin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;


-- ─────────────────────────────────────────
-- 2. TRIPS TABLE — Fix RLS policies
-- ─────────────────────────────────────────
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Drop all old policies first
DROP POLICY IF EXISTS "Admins can manage trips" ON public.trips;
DROP POLICY IF EXISTS "Anyone can view published trips" ON public.trips;
DROP POLICY IF EXISTS "Public can view published trips" ON public.trips;
DROP POLICY IF EXISTS "trips_public_read" ON public.trips;
DROP POLICY IF EXISTS "trips_admin_all" ON public.trips;

-- Public can read published trips (no auth required)
CREATE POLICY "trips_public_read"
ON public.trips FOR SELECT
USING (status = 'published' OR status IS NULL);

-- Admins can do everything (uses safe cast)
CREATE POLICY "trips_admin_all"
ON public.trips FOR ALL
TO authenticated
USING (public.isAdmin())
WITH CHECK (public.isAdmin());


-- ─────────────────────────────────────────
-- 3. STAYS TABLE — Fix RLS policies
-- ─────────────────────────────────────────
ALTER TABLE public.stays ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published stays" ON public.stays;
DROP POLICY IF EXISTS "Admins can manage stays" ON public.stays;
DROP POLICY IF EXISTS "stays_public_read" ON public.stays;
DROP POLICY IF EXISTS "stays_admin_all" ON public.stays;

-- Public can read published stays
CREATE POLICY "stays_public_read"
ON public.stays FOR SELECT
USING (status = 'published');

-- Admins can do everything
CREATE POLICY "stays_admin_all"
ON public.stays FOR ALL
TO authenticated
USING (public.isAdmin())
WITH CHECK (public.isAdmin());


-- ─────────────────────────────────────────
-- 4. LEADS TABLE — Ensure policies exist
-- ─────────────────────────────────────────
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leads_public_insert" ON public.leads;
DROP POLICY IF EXISTS "leads_admin_all" ON public.leads;

CREATE POLICY "leads_public_insert"
ON public.leads FOR INSERT
WITH CHECK (true);

CREATE POLICY "leads_admin_all"
ON public.leads FOR ALL
TO authenticated
USING (public.isAdmin());


-- ─────────────────────────────────────────
-- 5. VERIFY — Show current policies
-- ─────────────────────────────────────────
SELECT tablename, policyname, permissive, cmd, qual
FROM pg_policies
WHERE tablename IN ('trips', 'stays', 'leads', 'profiles')
ORDER BY tablename, policyname;

SELECT 'All fixes applied successfully!' AS result;
