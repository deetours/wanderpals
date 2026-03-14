-- ==================================================================
-- WANDERPALS LEADS FIX - RUN THIS IN SUPABASE SQL EDITOR
-- ==================================================================
-- This script fixes the leads dashboard display issue
-- Run this in your Supabase SQL editor to see leads in admin panel

-- 1. Ensure isAdmin() checks the users table for role (not profiles)
CREATE OR REPLACE FUNCTION public.isAdmin() 
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role::text IN ('admin', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Fix leads table RLS policies
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Admins can manage leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
DROP POLICY IF EXISTS "Public users can view leads" ON public.leads;

-- Create new comprehensive policies
CREATE POLICY "Admins can view all leads" 
ON public.leads FOR SELECT 
USING (public.isAdmin());

CREATE POLICY "Admins can update leads" 
ON public.leads FOR UPDATE 
USING (public.isAdmin())
WITH CHECK (public.isAdmin());

CREATE POLICY "Admins can delete leads" 
ON public.leads FOR DELETE 
USING (public.isAdmin());

CREATE POLICY "Anyone can submit a lead" 
ON public.leads FOR INSERT 
WITH CHECK (true);

-- 3. Import existing users as leads (if not already imported)
INSERT INTO public.leads (full_name, email, phone_number, source, status, notes, created_at)
SELECT 
  COALESCE(p.full_name, 'Unknown'),
  u.email,
  COALESCE(p.whatsapp_number, ''),
  'webapp_user_import',
  'new',
  'Auto-imported from existing user account',
  u.created_at
FROM public.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE NOT EXISTS (
  SELECT 1 FROM public.leads l 
  WHERE l.email = u.email OR (u.email IS NOT NULL AND l.email = u.email)
)
AND u.email IS NOT NULL
ON CONFLICT DO NOTHING;

-- 4. Verify the fix
DO $$
DECLARE
  v_lead_count integer;
  v_admin_count integer;
BEGIN
  SELECT COUNT(*) INTO v_lead_count FROM public.leads;
  SELECT COUNT(*) INTO v_admin_count FROM public.users WHERE role::text IN ('admin', 'superadmin');
  
  RAISE NOTICE '✅ LEADS FIX COMPLETED!';
  RAISE NOTICE 'Total leads in database: %', v_lead_count;
  RAISE NOTICE 'Total admins: %', v_admin_count;
  RAISE NOTICE 'Admins can now view all leads in the admin dashboard';
END $$;
