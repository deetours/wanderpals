# 🔐 ADMIN USER SETUP GUIDE

## Quick Summary
- **Email**: `admin@wanderpals.com`
- **Password**: `Welcome@2026`
- **Access**: `/admin` dashboard
- **Capabilities**: Add/edit/delete trips & stays, view bookings, analytics

---

## Step-by-Step Setup

### **Step 1: Create Auth User in Supabase**

1. Go to [Supabase Console](https://supabase.com)
2. Select your Wanderpals project
3. Click **Authentication** in the left sidebar
4. Click **Users** tab
5. Click **Add user** button (top right)
6. Fill in the form:
   - **Email**: `admin@wanderpals.com`
   - **Password**: `Welcome@2026`
   - **Auto Confirm User**: Toggle ON (makes user immediately active)
7. Click **Create user**
8. **Copy the User ID** (UUID format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

### **Step 2: Add User to Database**

1. Go to **SQL Editor** in Supabase
2. Open `/scripts/03-create-admin-user.sql`
3. **Replace** `YOUR_ADMIN_UUID_HERE` with the UUID from Step 1
4. Example:
   ```sql
   INSERT INTO users (
     id,
     email,
     full_name,
     role,
     created_at,
     updated_at
   ) VALUES (
     'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  -- ← Your actual UUID here
     'admin@wanderpals.com',
     'Wanderpals Admin',
     'admin',
     NOW(),
     NOW()
   ) ON CONFLICT (id) DO UPDATE SET
     role = 'admin',
     email = 'admin@wanderpals.com';
   ```
5. Click **Run** button
6. Check the result - should show 1 row inserted

---

### **Step 3: Login and Verify**

1. Go to your Wanderpals app: `http://localhost:3000/login`
2. Click **Sign In** tab
3. Enter:
   - **Email**: `admin@wanderpals.com`
   - **Password**: `Welcome@2026`
4. Click **Sign In**
5. **Should redirect to** `/admin` dashboard ✅

---

## Admin Dashboard Features

Once logged in at `/admin`:

### **Trips Manager**
- View all trips added
- Click **Edit** to modify trip details
- Click **Delete** to remove a trip
- Click **+ Add Trip** to create new trip
- New form fields include:
  - Trip Title
  - Region
  - **Terrain** (dropdown: Mountains, Forest, Coast, Desert, etc.)
  - Duration
  - Max Group Size
  - Price
  - Image URL
  - Status (Draft/Published/Archived)
  - Featured on Journeys Page (checkbox)

### **Stays Manager**
- Manage accommodation listings
- Same add/edit/delete functionality

### **Bookings Viewer**
- See all customer bookings in real-time
- View booking status
- Send WhatsApp messages
- Mark as confirmed/completed

### **Analytics Dashboard**
- Total users registered
- Total bookings this month
- Revenue tracking
- Best-performing trips/stays

---

## Testing Checklist

- [ ] Admin login works with `admin@wanderpals.com` / `Welcome@2026`
- [ ] Redirects to `/admin` (not `/return`)
- [ ] Can see "Trips" tab
- [ ] Can see "Stays" tab
- [ ] Can see "Bookings" tab
- [ ] Can see "Analytics" tab
- [ ] "+ Add Trip" button works
- [ ] Trip form includes **Terrain** dropdown
- [ ] Can successfully add a new trip
- [ ] New trip appears on `/all-trips` page after saving

---

## Troubleshooting

### **Login fails with "Invalid credentials"**
- ✅ Verify email is exactly: `admin@wanderpals.com`
- ✅ Verify password is exactly: `Welcome@2026`
- ✅ Check that **Auto Confirm User** was enabled

### **Login succeeds but redirects to `/return` instead of `/admin`**
- ✅ The user wasn't created in the `users` table (see Step 2)
- ✅ Run the SQL query again with correct UUID
- ✅ Verify `role` is set to `'admin'` (not `'customer'`)

### **Admin dashboard is blank/not loading**
- ✅ Check browser console for errors (F12 → Console)
- ✅ Verify Supabase credentials in `.env.local`
- ✅ Clear browser cache and refresh

### **Can add trip but doesn't appear on `/all-trips`**
- ✅ Make sure `status` is set to **"Published"**
- ✅ Make sure `terrain` field has a value
- ✅ Refresh the page (Ctrl+Shift+R)
- ✅ Check Supabase database directly

---

## Required Environment Variables

Ensure your `.env.local` has:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## Creating Additional Admins

To add more admin users, repeat the process:

1. Add user in Supabase Auth (get UUID)
2. Run SQL:
   ```sql
   INSERT INTO users (id, email, full_name, role, created_at, updated_at)
   VALUES ('NEW_UUID_HERE', 'newadmin@wanderpals.com', 'Admin Name', 'admin', NOW(), NOW());
   ```

---

## Security Notes

### **Change Password After First Login** (Recommended)
1. Login to admin account
2. Go to user settings (if available)
3. Change password from `Welcome@2026` to something secure

### **Use Strong Passwords for Production**
- Avoid simple passwords like `Welcome@2026`
- Use: Uppercase + Lowercase + Numbers + Symbols
- Example: `Wnd3rp@ls!2026$ecure`

### **Limit Admin Access**
- Only promote trusted team members to admin
- Admin can see all bookings and customer data
- Monitor admin activity

---

## Next Steps

1. ✅ Create admin user (this guide)
2. ✅ Login and verify admin dashboard works
3. ✅ Add your first trip via admin form
4. ✅ Verify trip appears on `/all-trips`
5. ✅ Test filters and search
6. ✅ Share login credentials securely with team members

---

**Document Created**: February 26, 2026  
**Status**: Ready for Production
