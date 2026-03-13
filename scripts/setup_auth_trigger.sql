-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- This script creates a trigger to automatically add new signups to the 'profiles' and 'users' tables.

-- 1. Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, full_name, whatsapp_number, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'whatsapp_number',
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    whatsapp_number = EXCLUDED.whatsapp_number,
    avatar_url = EXCLUDED.avatar_url;

  -- Insert into users table 
  INSERT INTO public.users (id, email, role)
  VALUES (
    new.id, 
    new.email,
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the trigger if it exists (so you can run this multiple times safely)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Sync any existing users that might have been missed
INSERT INTO public.profiles (id, full_name, whatsapp_number)
SELECT 
  id, 
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'whatsapp_number'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT DO NOTHING;

INSERT INTO public.users (id, role, email)
SELECT 
  id, 
  'user',
  email
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT DO NOTHING;

SELECT 'Trigger successfully created and existing users synced!' AS result;
