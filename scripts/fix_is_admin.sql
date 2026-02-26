-- RUN THIS IN SUPABASE SQL EDITOR
-- This updates the securely defined isAdmin() function that controls database Row Level Security.
-- It fixes the 'operator does not exist: text = user_role' error by checking roles flexibly.

CREATE OR REPLACE FUNCTION public.isAdmin() 
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role::text IN ('admin', 'superadmin')
  ) OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role::text IN ('admin', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also let's attach this improved policy to trips so Admins can actually save trips perfectly 
DROP POLICY IF EXISTS "Admins can manage trips" ON public.trips;
CREATE POLICY "Admins can manage trips" 
ON public.trips FOR ALL 
USING (public.isAdmin())
WITH CHECK (public.isAdmin());

SELECT 'isAdmin function successfully updated and trips policy secured!' AS result;
