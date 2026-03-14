-- ==================================================================
-- WANDERPALS SIGNUP FIX - RUN THIS IN SUPABASE SQL EDITOR
-- ==================================================================
-- This script fixes signup issues with Supabase user creation
-- Run this as admin in your Supabase SQL editor

-- 1. DROP and recreate the trigger function with correct schema
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Insert into users table
  INSERT INTO public.users (id, email, role)
  VALUES (new.id, new.email, 'user'::user_role)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

  -- Insert into profiles table with all fields including whatsapp_number
  INSERT INTO public.profiles (id, full_name, whatsapp_number, avatar_url, updated_at)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    COALESCE(new.raw_user_meta_data->>'whatsapp_number', ''),
    new.raw_user_meta_data->>'avatar_url',
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    whatsapp_number = EXCLUDED.whatsapp_number,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Sync any existing users that might have been missed (optional but recommended)
DO $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*) INTO v_count FROM auth.users WHERE id NOT IN (SELECT id FROM public.profiles);
  IF v_count > 0 THEN
    RAISE NOTICE 'Syncing % users to profiles table', v_count;
    
    INSERT INTO public.profiles (id, full_name, whatsapp_number, avatar_url, updated_at)
    SELECT 
      u.id, 
      COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''),
      COALESCE(u.raw_user_meta_data->>'whatsapp_number', ''),
      u.raw_user_meta_data->>'avatar_url',
      NOW()
    FROM auth.users u
    WHERE u.id NOT IN (SELECT id FROM public.profiles)
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      whatsapp_number = EXCLUDED.whatsapp_number,
      avatar_url = EXCLUDED.avatar_url,
      updated_at = NOW();
  END IF;
END $$;

-- 4. Verify profiles table has all required columns
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'whatsapp_number') THEN
        ALTER TABLE public.profiles ADD COLUMN whatsapp_number text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'updated_at') THEN
        ALTER TABLE public.profiles ADD COLUMN updated_at timestamp with time zone DEFAULT NOW();
    END IF;
END $$;

-- 5. Update RLS policies to ensure users can update their own data
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
CREATE POLICY "Users can manage their own profile" 
ON public.profiles FOR ALL 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 6. Allow auth trigger to bypass RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 7. Verify users table structure
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email') THEN
        ALTER TABLE public.users ADD COLUMN email text UNIQUE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE public.users ADD COLUMN role user_role DEFAULT 'user'::user_role;
    END IF;
END $$;

-- 8. Log completion
DO $$
BEGIN
  RAISE NOTICE '✅ Signup fix applied successfully!';
  RAISE NOTICE 'New users will now automatically get profiles created with whatsapp_number.';
  RAISE NOTICE 'Existing users have been synced to the profiles table.';
END $$;
