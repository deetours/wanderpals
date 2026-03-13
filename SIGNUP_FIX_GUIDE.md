# 🔧 Wanderpals Signup Issue - COMPLETE FIX GUIDE

## Problem Summary
The signup process was failing with database errors because:
1. **WhatsApp number wasn't being captured** - The database trigger didn't include `whatsapp_number` during user creation
2. **Profile creation was incomplete** - The trigger used `ON CONFLICT DO NOTHING`, so updates failed
3. **RLS policies** - Row-level security could block profile updates
4. **Timing issues** - Profile updates happened before trigger completed

---

## ✅ Fixes Applied

### 1. **Updated Trigger Function** (supabase_setup.sql)
- Now captures `whatsapp_number` from user metadata
- Changed `ON CONFLICT DO NOTHING` to `ON CONFLICT DO UPDATE` for proper sync
- Ensures profiles are created/updated atomically with user creation

### 2. **Enhanced Signup Action** (app/auth/actions.ts)
- Added 500ms delay for trigger completion
- Changed from UPDATE to UPSERT for better handling
- Added detailed error logging
- Verify both `profiles` and `users` table entries
- Non-blocking profile updates (don't fail signup if profile update has minor issues)

### 3. **Fixed Setup Scripts** (scripts/setup_auth_trigger.sql)
- Removed incorrect `role` column reference (doesn't exist in profiles table)
- Properly syncs whatsapp_number for existing users
- Correct schema matching

---

## 🚀 What You Need To Do NOW

### **Step 1: Apply the SQL Fix in Supabase**

1. Go to [Supabase Console](https://supabase.com) → Your Project
2. Click **SQL Editor** in left sidebar
3. Click **New Query**
4. Copy-paste the entire content from: `scripts/FIX_SIGNUP_ISSUES.sql`
5. Click **Run** (or press Ctrl+Enter)
6. Wait for it to complete successfully ✅

### **Step 2: Test the Signup**

1. Go to your app's login page: `http://localhost:3000/login` (or your deployed URL)
2. Click **Sign Up**
3. Fill in:
   - **Email**: `testuser@example.com`
   - **Password**: `TestPass123!`
   - **Full Name**: `Test User`
   - **WhatsApp**: `+1234567890`
4. Click **Sign Up**
5. You should be redirected to `/return` page ✅

### **Step 3: Verify in Supabase**

1. Go to **SQL Editor** and run:
   ```sql
   SELECT p.id, p.full_name, p.whatsapp_number, u.email, u.role
   FROM public.profiles p
   LEFT JOIN public.users u ON p.id = u.id
   ORDER BY p.updated_at DESC
   LIMIT 10;
   ```

2. You should see your test user with all fields populated:
   - ✅ id
   - ✅ full_name = "Test User"
   - ✅ whatsapp_number = "+1234567890"
   - ✅ email = "testuser@example.com"
   - ✅ role = "user"

---

## 🐛 If It Still Doesn't Work

### Check 1: Profile Table Structure
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```
**Should have**: id, full_name, whatsapp_number, avatar_url, updated_at

### Check 2: Users Table Structure
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```
**Should have**: id, email, role, created_at

### Check 3: Check Auth User Metadata
```sql
SELECT id, email, raw_user_meta_data
FROM auth.users
WHERE email LIKE 'testuser%'
LIMIT 1;
```
**Should see**: `whatsapp_number` in the raw_user_meta_data JSON

### Check 4: Browser Console Logs
1. Open your app
2. Press **F12** (DevTools)
3. Go to **Console** tab
4. Try signing up and watch for errors
5. Look for logs with `SIGNUP ACTION` - they'll show detailed errors

### Check 5: Supabase Function Logs
1. Go to Supabase Console → **Functions** tab
2. Look for error logs during signup
3. Check the trigger execution logs

---

## 📋 Files Modified

1. ✅ [supabase_setup.sql](supabase_setup.sql#L55) - Updated trigger
2. ✅ [app/auth/actions.ts](app/auth/actions.ts#L86) - Enhanced signup action
3. ✅ [scripts/setup_auth_trigger.sql](scripts/setup_auth_trigger.sql#L1) - Fixed setup script
4. ✅ [scripts/FIX_SIGNUP_ISSUES.sql](scripts/FIX_SIGNUP_ISSUES.sql) - NEW fix script

---

## 🎯 Key Changes Summary

| Issue | Before | After |
|-------|--------|-------|
| WhatsApp capture | ❌ Not captured | ✅ Captured in trigger |
| Profile on signup | ❌ Missing fields | ✅ Complete with whatsapp_number |
| Conflict handling | ❌ DO NOTHING (fails) | ✅ DO UPDATE (succeeds) |
| Error reporting | ❌ Silent failures | ✅ Detailed logging |
| Update handling | ❌ Raw UPDATE | ✅ UPSERT for safety |
| Timing | ❌ Race condition | ✅ 500ms delay + upsert |

---

## 🔍 Debugging Commands

Run these in Supabase SQL Editor to debug:

**See all users created in last 24 hours:**
```sql
SELECT u.id, u.email, u.role, p.full_name, p.whatsapp_number, p.updated_at
FROM public.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.created_at > NOW() - INTERVAL '24 hours'
ORDER BY u.created_at DESC;
```

**Check for orphaned auth users (no profile):**
```sql
SELECT au.id, au.email
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;
```

**Fix orphaned users (sync them now):**
```sql
INSERT INTO public.profiles (id, full_name, whatsapp_number, updated_at)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', ''),
  COALESCE(au.raw_user_meta_data->>'whatsapp_number', ''),
  NOW()
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();
```

---

## ✨ What's Next

After testing signup works:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Fix: Signup database issues with whatsapp_number capture and profile creation"
   git push
   ```

2. **Deploy to production** - Run the FIX_SIGNUP_ISSUES.sql in your production database

3. **Test end-to-end** - Do a full signup flow on production

---

## 📞 Support

If errors persist:
1. **Check the console logs** - Enable DEBUG mode if needed
2. **Run the debug commands** above
3. **Verify RLS policies** are correctly set
4. **Ensure all columns exist** using the structure checks above

**Common error messages and solutions:**

- `"Field required"` → User didn't fill all fields (email, password, name, whatsapp)
- `"Email already exists"` → That email is already signed up, try another
- `"Invalid password"` → Password must be 6+ characters
- `"Database error"` → Likely RLS issue - run the FIX_SIGNUP_ISSUES.sql script

---

**Last Updated**: March 13, 2026
