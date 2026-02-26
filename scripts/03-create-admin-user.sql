-- ============================================
-- WANDERPALS ADMIN USER SETUP
-- ============================================
-- Run this in Supabase SQL Editor to create admin user
-- Email: admin@wanderpals.com
-- Password: Welcome@2026

-- IMPORTANT: You must create the user in Supabase Auth FIRST
-- Then add them to the users table

-- ============================================
-- STEP 1: Create admin user in Supabase Auth
-- ============================================
-- Go to Supabase Console:
-- 1. Click "Authentication" in left sidebar
-- 2. Go to "Users" tab
-- 3. Click "Add user"
-- 4. Email: admin@wanderpals.com
-- 5. Password: Welcome@2026
-- 6. Copy the user ID (UUID) that gets created
-- 7. Replace 'YOUR_ADMIN_UUID_HERE' below with the actual UUID

-- ============================================
-- STEP 2: Run this SQL after creating the auth user
-- ============================================

-- Insert admin user profile
INSERT INTO users (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  'YOUR_ADMIN_UUID_HERE',  -- Replace with actual UUID from Supabase Auth
  'admin@wanderpals.com',
  'Wanderpals Admin',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  email = 'admin@wanderpals.com';

-- Verify the user was created
SELECT id, email, role FROM users WHERE email = 'admin@wanderpals.com';
