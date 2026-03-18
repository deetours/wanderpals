# 🚀 Deployment Environment Setup Guide

## ⚠️ WHY YOU'RE GETTING 500 ERRORS IN PRODUCTION

Your `.env.local` file **only works locally**. When you deploy to Netlify, these environment variables are NOT automatically included. You must set them manually in the Netlify dashboard.

## 🔧 NETLIFY SETUP (REQUIRED)

### Step 1: Go to Netlify Dashboard
1. Log in to [netlify.com](https://netlify.com)
2. Select your "Wanderpals" site

### Step 2: Add Environment Variables
Navigate to: **Site settings → Build & deploy → Environment**

### Step 3: Add These Exact Variables

Click "Add environment variable" for each:

| Variable Name | Value | Source |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ralkdbmoaypdjwtkvbhz.supabase.co` | From `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | From `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | From `.env.local` line 5 |
| `RESEND_API_KEY` | Your Resend API key | From `.env.local` |
| `INTERNAL_API_SECRET` | `wanderpals_secure_bridge_2025` | From `.env.local` |

### ✅ How to Copy Values from .env.local

Your `.env.local` file has all the values. Just copy-paste them into Netlify:
- `NEXT_PUBLIC_SUPABASE_URL` → Copy the URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Copy the anon key (long string)
- `SUPABASE_SERVICE_ROLE_KEY` → Copy the service role key (even longer JWT)
- `RESEND_API_KEY` → Copy the Resend key
- `INTERNAL_API_SECRET` → Copy the secret token

### Step 4: Trigger a Redeployment

After adding env vars:
1. Go to **Deploys**
2. Click **Trigger deploy → Deploy site**
3. Wait for the build to complete

## ✅ VERIFY IT'S WORKING

### Check Health Endpoint
```bash
curl https://your-wanderpals-site.netlify.app/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "All systems operational",
  "environment": "production",
  "supabase": {
    "connected": true,
    "tripsCount": 4
  }
}
```

### If You See Error
```json
{
  "status": "error",
  "message": "Missing required environment variables: SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY",
  "setupInstructions": "Set these in Netlify Dashboard → Site settings → Build & deploy → Environment"
}
```

→ Go back and check you added ALL variables correctly in Netlify UI.

## 🔍 DEBUGGING: Check Server Logs

If you see mysterious 500 errors:

1. **Netlify Logs**: Go to **Deploys → Click latest deploy → Logs** tab
2. **Error Details**: The health endpoint will now show exactly which env vars are missing
3. **Console Errors**: Check browser console if it's a client-side error

## 📋 CHECKLIST BEFORE DEPLOYING

- [ ] All 5 environment variables set in Netlify UI
- [ ] Redeployed site after adding vars
- [ ] Health check endpoint returns `status: ok`
- [ ] Admin pages work without 500 errors
- [ ] Bookings API works
- [ ] User profile API works

## 🆘 STILL GETTING 500 ERRORS?

### Most Common Issues:

1. **Env vars not saved in Netlify**
   - Refresh the page and verify all 5 variables are listed
   - Check for typos in variable names

2. **Didn't redeploy after adding vars**
   - Just adding vars isn't enough - trigger a new deploy
   - Go to Deploys → Trigger deploy → Deploy site

3. **Wrong values copied**
   - Double-check that you copied ENTIRE values
   - JWT tokens (SERVICE_ROLE_KEY) are very long
   - Don't include quotes or extra spaces

4. **Still stuck?**
   - Check `/api/health` endpoint to see which vars are missing
   - Netlify Logs will show detailed error messages

## 📍 LOCAL DEVELOPMENT

Your local development uses `.env.local` (which is git-ignored). This works because:
- Next.js automatically loads `.env.local` when you run `npm run dev`
- Never commit `.env.local` to git
- Each developer has their own `.env.local`

For production, all variables MUST be in Netlify dashboard (not git).

---

**When you deploy again, repeat these steps to prevent the 500 errors from coming back!**
