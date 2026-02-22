# WANDERPALS - QUICK START GUIDE

## 🚀 FOR TESTING LOCALLY

### 1. Clone & Install
```bash
git clone [your-repo]
cd wanderpals
npm install
```

### 2. Set Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run Locally
```bash
npm run dev
```

Visit: http://localhost:3000

### 4. Test Admin Dashboard
- Go to http://localhost:3000/return
- Sign in with: admin@wanderpals.com / [password]
- Redirected to http://localhost:3000/admin
- Add a test trip and watch it appear on /all-trips instantly

### 5. Test Customer Flow
- Create user account
- Book a trip/stay
- Check /memories dashboard

---

## 🎯 FOR PRODUCTION DEPLOYMENT

### Step 1: Supabase Setup (10 minutes)
- [ ] Create Supabase project
- [ ] Run `/scripts/01-create-tables.sql` in SQL editor
- [ ] Get `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 2: Seed Data (15 minutes)
- [ ] Create `/scripts/02-seed-data.sql` with trips/stays/admin
- [ ] Run it in Supabase
- [ ] Or use admin dashboard to manually add data

### Step 3: Payment Integration (1-2 hours)
- [ ] Sign up for Razorpay/Stripe
- [ ] Create payment endpoints
- [ ] Test end-to-end

### Step 4: WhatsApp Integration (1-2 hours)
- [ ] Sign up for Twilio WhatsApp Business
- [ ] Create WhatsApp endpoints
- [ ] Connect to /api/whatsapp/send-message

### Step 5: Deploy to Vercel (30 minutes)
```bash
npm install -g vercel
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel deploy
```

---

## 📋 ADMIN TASKS

### Adding a New Trip
1. Go to /admin (must be logged in as admin)
2. Click "Trips" tab
3. Click "+ Add Trip"
4. Fill form:
   - Name: "Himalayan Hidden Valleys"
   - Duration: "7 Days"
   - Price: "15999"
   - Region: "north" (or choose filter)
   - Group Size: "8-10 travellers"
5. Click "Create Trip"
6. It appears immediately on /all-trips

### Adding a New Stay
1. Go to /admin
2. Click "Stays" tab
3. Click "+ Add Stay"
4. Fill form:
   - Name: "Wanderpals Jaipur"
   - Location: "Rajasthan"
   - Price: "3999"
   - Room Type: "Dorm"
5. Click "Create Stay"
6. It appears immediately on /stays

### Viewing Bookings
1. Go to /admin
2. Click "Bookings" tab
3. See all users' bookings with status (pending/confirmed/cancelled)

### Viewing Analytics
1. Go to /admin
2. Click "Analytics" tab
3. See live counts:
   - Total Users
   - Total Bookings
   - Total Trips
   - Total Stays

---

## 🔐 ACCOUNT CREDENTIALS

### Initial Admin Setup
- Email: admin@wanderpals.com
- Password: [Set in seed data]
- Role: admin
- Access: /admin dashboard

### Create More Admins
```sql
INSERT INTO public.users (email, password, role)
VALUES ('newadmin@wanderpals.com', crypt('password123', gen_salt('bf')), 'admin');
```

---

## 🧪 TESTING CHECKLIST

### Landing Page
- [ ] All 16 scenes load
- [ ] Animations smooth (no jank)
- [ ] Navbar appears on scroll
- [ ] WhatsApp popup appears
- [ ] All links work

### Booking Flow
- [ ] Can select dates on trip/stay
- [ ] WhatsApp number validation works
- [ ] Confirms to /confirmed page
- [ ] Shows correct price
- [ ] Post-booking message sent to WhatsApp

### Admin Dashboard
- [ ] Can add trip (appears on site immediately)
- [ ] Can edit trip (changes live)
- [ ] Can delete trip (gone from site)
- [ ] Same for stays
- [ ] Bookings update in real-time
- [ ] Analytics show correct numbers

### Mobile
- [ ] Landing page responsive
- [ ] Booking flow usable on phone
- [ ] Admin dashboard works on tablet
- [ ] Images load on 3G speed

---

## 🚨 TROUBLESHOOTING

### Database Connection Error
```
Error: Unable to connect to database
```
**Solution**: 
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Verify Supabase project is active

### No Trips Showing on /all-trips
**Solution**:
- Check if trips exist in Supabase database
- Go to /admin and add a trip
- Refresh page

### Booking Not Confirming
**Solution**:
- Check if bookings table exists in Supabase
- Verify RLS policies allow inserts
- Check browser console for errors

### WhatsApp Popup Not Showing
**Solution**:
- Check WhatsAppPopup component is imported in layout.tsx
- Verify component is rendering (check browser devtools)
- Check if WhatsApp integration is set up

### Admin Dashboard Access Denied
**Solution**:
- Verify you're signed in as admin (role = 'admin')
- Check user role in Supabase users table
- Log out and back in

---

## 📞 SUPPORT

**For local development issues:**
1. Check Next.js docs: https://nextjs.org
2. Check Supabase docs: https://supabase.com/docs
3. Check error in terminal/console

**For deployment issues:**
1. Check Vercel logs: https://vercel.com/dashboard
2. Check Supabase logs
3. Contact Vercel/Supabase support

**For business logic issues:**
- See `/PRODUCTION_CHECKLIST.md`
- See `/IMPLEMENTATION_SUMMARY.md`

---

## 🎉 READY TO LAUNCH!

Once you've:
1. Set up Supabase ✅
2. Added payment integration ✅
3. Added WhatsApp integration ✅
4. Added trips/stays data ✅
5. Tested everything ✅
6. Deployed to Vercel ✅

**You're live! 🚀**

Monitor daily for first week, then you're golden. Wanderpals is ready to scale!
