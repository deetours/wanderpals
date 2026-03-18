# 🔄 Backend Keep-Alive Setup Guide

## Why Keep-Alive Is Needed

Serverless backends (Supabase + Netlify) can experience:
- **Cold starts**: First request takes 2-5+ seconds
- **Database idle timeout**: Connection drops after 30+ minutes of inactivity
- **Connection pooling issues**: Stale connections causing errors

**Solution**: Ping your health endpoint periodically to keep connections warm.

---

## ✅ What We've Set Up

### 1. **Smart Keep-Alive** (`.github/workflows/keep-alive.yml`)
- ✅ Runs every **5 minutes** (always-on approach)
- ✅ Pings `/api/health` endpoint
- ✅ Validates Supabase connection
- ✅ Lightweight and reliable

### 2. **Aggressive Keep-Alive** (`.github/workflows/keep-alive-aggressive.yml`)
- ✅ Every **3 minutes** during business hours (9 AM - 9 PM UTC)
- ✅ Every **15 minutes** outside business hours
- ✅ Pings multiple endpoints (health, bookings, leads)
- ✅ Better for high-traffic periods

---

## 🚀 How It Works

### GitHub Actions Workflow
```yaml
on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
```

The cron job:
1. ⏰ Triggers automatically on schedule
2. 🔄 Sends HTTP request to `/api/health`
3. ✅ Verifies response is `status: ok`
4. 📊 Logs results to GitHub Actions
5. 📝 No cost (free GitHub Actions minutes)

---

## 🔧 Customization

### Change Frequency

Edit `.github/workflows/keep-alive.yml`:

```yaml
on:
  schedule:
    # Every minute (most aggressive)
    - cron: '* * * * *'
    
    # Every 10 minutes (balanced)
    - cron: '*/10 * * * *'
    
    # Every hour (minimal)
    - cron: '0 * * * *'
```

### Cron Syntax Reference
```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

**Examples:**
- `*/5 * * * *` → Every 5 minutes
- `0 */4 * * *` → Every 4 hours
- `0 9 * * 1-5` → 9 AM on weekdays
- `*/15 9-17 * * *` → Every 15 min, 9 AM - 5 PM

---

## 📊 Monitor Keep-Alive Runs

### View Workflow Runs
1. Go to GitHub: `github.com/deetours/wanderpals`
2. Click **Actions** tab
3. Click **"Keep Wanderpals Backend Alive"** workflow
4. See execution history and logs

### Check Logs
1. Click on a workflow run
2. Expand **"Ping Health Endpoint"** step
3. View HTTP status and response

### Expected Output
```
🔄 Pinging Wanderpals backend...
📊 Response Code: 200
📄 Response Body:
{
  "status": "ok",
  "timestamp": "2026-03-18T19:55:00.000Z",
  "message": "All systems operational",
  "environment": "production",
  "supabase": {
    "url": "ralkdbmoaypdjwtkvbhz.supabase.co",
    "connected": true,
    "tripsCount": 4
  },
  "envVarsLoaded": 5
}
✅ Backend is healthy!
```

---

## 🎯 Recommended Settings

### For Development
```yaml
# Keep-alive only during work hours
- cron: '0 9-18 * * 1-5'
```

### For Production (Wanderpals)
```yaml
# Always keep alive, 5-minute intervals
- cron: '*/5 * * * *'
```

### For High-Traffic
```yaml
# Every 2 minutes
- cron: '*/2 * * * *'
```

---

## 📈 Benefits

✅ **No more 500 errors** from cold starts  
✅ **Faster first request** (connection already warm)  
✅ **Prevents database timeout** errors  
✅ **Cost-effective** (free GitHub Actions)  
✅ **Zero configuration** (auto-runs)  
✅ **Easy to monitor** (GitHub Actions dashboard)  

---

## 🆘 Troubleshooting

### Workflow not running?
- Check GitHub Settings → Actions → Allow all actions
- Verify `.github/workflows/` folder exists
- Push workflow files to main branch

### Getting 401 errors?
- Expected for endpoints that require auth (bookings, leads)
- `/api/health` won't require auth (401 is acceptable)

### Health endpoint returning errors?
- Check environment variables on Netlify dashboard
- Verify Supabase connection is working
- Check Netlify logs for detailed errors

---

## 🔗 Related Documentation

- [DEPLOYMENT_ENV_SETUP.md](DEPLOYMENT_ENV_SETUP.md) - Environment variables
- [app/api/health/route.ts](../app/api/health/route.ts) - Health endpoint code
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

## 💡 Alternative Keep-Alive Methods

If GitHub Actions doesn't work for you:

### Option 1: External Cron Service
- **EasyCron**: easycron.com
- **PingPlus**: pingplus.io
- **Uptime Robot**: uptimerobot.com
- Cost: Usually free tier available

### Option 2: Netlify Scheduled Functions
```javascript
// netlify/functions/keep-alive.js
export async function handler(event, context) {
  const response = await fetch('https://api.example.com/health')
  return { statusCode: 200 }
}
```
Set interval: Create schedule in Netlify UI

### Option 3: SystemCron or Task Scheduler
- Local machine or VPS running a script
- Not recommended for serverless (requires always-on server)

---

## ✨ Current Status

**Status**: ✅ Configured and Active

**Workflows**:
- `keep-alive.yml` - Smart pinging (5 min intervals)
- `keep-alive-aggressive.yml` - Aggressive pinging (3-15 min intervals)

**Next Steps**:
1. Push to GitHub (already done!)
2. Go to Actions tab and verify workflows appear
3. Wait for first scheduled run
4. Monitor logs for any issues

**Result**: Your Wanderpals backend will stay warm and responsive! 🚀
