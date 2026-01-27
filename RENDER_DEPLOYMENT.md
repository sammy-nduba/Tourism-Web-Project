# Wild Horizon Backend - Render Deployment Guide

## Step-by-Step Deployment to Render

### Prerequisites
- Render account (you have this)
- GitHub repository (you have this: Tourism-Web-Project)
- Environment variables ready

### Step 1: Prepare Your GitHub Repository
Your Backend is ready to deploy. The key files are:
- `Backend/package.json` - Build and start scripts configured ✓
- `Backend/src/index.ts` - Express server entry point ✓
- `Backend/.env` - Environment variables (see Step 3)

### Step 2: Create a Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **+ New** → **Web Service**
3. Connect your GitHub repository:
   - Search for "Tourism-Web-Project"
   - Click **Connect**
4. Fill in the service details:
   - **Name**: `wild-horizon-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install -ws && npm run build --workspace=Backend`
   - **Start Command**: `npm start --workspace=Backend`
   - **Plan**: Free or paid (Free tier available)

### Step 3: Set Environment Variables

In Render dashboard, scroll to **Environment** section and add:

```
PORT=3000
NODE_ENV=production

VITE_SUPABASE_URL=https://trhmjqelcznwnvdxdtai.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyaG1qcWVsY3pud252ZHhkdGFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTI1NjM2NiwiZXhwIjoyMDc0ODMyMzY2fQ.Pw1KSrmYoad2R6RZJJgrhCq52BJbkYDCHr_m0hmGUl0

FRONTEND_URL=https://your-netlify-domain.netlify.app,https://your-netlify-domain.netlify.app/admin

ADMIN_SECRET=your-secret-key-here
RATE_LIMIT_WINDOW_MS=15000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important**: Replace `https://your-netlify-domain.netlify.app` with your actual Netlify domain

### Step 4: Deploy

1. Click **Create Web Service**
2. Render will automatically build and deploy your service
3. You'll see a deployment log - wait for it to complete
4. Once deployed, you'll get a URL like: `https://wild-horizon-backend.onrender.com`

### Step 5: Update Netlify Configuration

Once you have your Render Backend URL, update the Frontend:

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your Wild Horizon project
3. Go to **Site settings** → **Build & deploy** → **Environment**
4. Set `VITE_BACKEND_URL` to your Render URL: `https://wild-horizon-backend.onrender.com`
5. Trigger a redeploy

### Step 6: Test the Integration

After deployment:
1. Visit your Netlify Frontend URL
2. Check browser console for any errors
3. Verify tours, countries, and cities load correctly

### Troubleshooting

**Build fails**: Check the build log for errors. Common issues:
- Missing environment variables
- Port conflicts
- TypeScript compilation errors

**API returns 502**: 
- Backend may be starting up (takes a moment)
- Check Render logs for runtime errors
- Verify Supabase credentials are correct

**CORS errors**: 
- Check `FRONTEND_URL` environment variable matches your Netlify domain
- Should be comma-separated if multiple URLs

### Useful Links
- [Render Documentation](https://render.com/docs)
- [Render Dashboard](https://dashboard.render.com)
- [Check Service Status](https://status.render.com)
