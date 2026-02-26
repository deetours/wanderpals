-- ============================================
-- WANDERPALS ADMIN USER - DIAGNOSTIC QUERIES
-- ============================================
-- Run these in Supabase SQL Editor to diagnose the issue

-- ============================================
-- QUERY 1: Check if admin user exists in users table
-- ============================================
SELECT id, email, full_name, role, created_at FROM users WHERE email = 'admin@wanderpals.com';

-- Expected Result: Should show 1 row with role = 'admin'
-- If NO RESULTS: User not added to users table (need to run INSERT)
-- If results but role != 'admin': Need to UPDATE role


-- ============================================
-- QUERY 2: If user doesn't exist, get the UUID from Auth
-- ============================================
-- Go to Supabase Auth > Users tab and copy the UUID for admin@wanderpals.com
-- Then run this INSERT:

INSERT INTO users (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  'PASTE_YOUR_UUID_HERE',  -- Replace with actual UUID from Supabase Auth Users list
  'admin@wanderpals.com',
  'Wanderpals Admin',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin';

-- After running: Check with Query 1 to verify


-- ============================================
-- QUERY 3: If role is wrong, fix it
-- ============================================
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@wanderpals.com';

-- Then verify with Query 1


-- ============================================
-- QUERY 4: Check ALL users and their roles
-- ============================================
SELECT id, email, role FROM users LIMIT 20;

-- This shows all users to verify data consistency
