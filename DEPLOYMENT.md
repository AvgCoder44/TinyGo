# Deployment Guide

## Step 1: Push to GitHub

### 1.1 Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in:
   - **Repository name**: `url-shortener` (or your preferred name)
   - **Description**: "URL Shortener with Cloudflare Workers backend"
   - **Visibility**: Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

### 1.2 Push Your Code

Run these commands in your terminal (from the project root):

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/url-shortener.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note**: If you haven't set up Git credentials, GitHub will prompt you to authenticate.

---

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub (recommended) or email

2. **Import Project**
   - Click **"Add New Project"**
   - Select **"Import Git Repository"**
   - Find and select your `url-shortener` repository
   - Click **"Import"**

3. **Configure Project**
   - **Framework Preset**: Select **"Vite"** (or "Other")
   - **Root Directory**: Click **"Edit"** and set to `frontend`
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

4. **Deploy**
   - Click **"Deploy"**
   - Wait for deployment to complete (usually 1-2 minutes)

5. **Get Your URL**
   - After deployment, you'll get a URL like: `https://url-shortener-xyz.vercel.app`
   - Your frontend is now live! 🎉

### Option B: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy from frontend directory**
   ```bash
   cd frontend
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? → **Yes**
   - Which scope? → Select your account
   - Link to existing project? → **No** (first time)
   - Project name? → Press Enter or enter a name
   - Directory? → **./** (current directory)
   - Override settings? → **No**

5. **Your site is deployed!**
   - You'll get a URL like: `https://your-project.vercel.app`

---

## Step 3: Verify Deployment

1. **Visit your Vercel URL**
   - Open the URL provided by Vercel
   - You should see your URL shortener frontend

2. **Test the Application**
   - Try shortening a URL
   - The frontend should connect to your Cloudflare Worker backend
   - Make sure `API_BASE_URL` in `frontend/script.js` points to your deployed worker

3. **Check Backend**
   - Your Cloudflare Worker should already be deployed at: `https://worker.tinygo.workers.dev`
   - If not, deploy it:
     ```bash
     cd worker
     npm run deploy
     ```

---

## Step 4: Update API URL (If Needed)

If your Cloudflare Worker has a different URL, update `frontend/script.js`:

```javascript
const API_BASE_URL = 'https://your-worker-name.workers.dev';
```

Then:
1. Commit the change:
   ```bash
   git add frontend/script.js
   git commit -m "Update API URL"
   git push
   ```

2. Vercel will automatically redeploy (if connected to GitHub)

---

## Troubleshooting

### Build Fails on Vercel

- **Check Root Directory**: Make sure it's set to `frontend` in Vercel settings
- **Check Build Command**: Should be `npm run build`
- **Check Output Directory**: Should be `dist`

### Frontend Can't Connect to Backend

- **Check API URL**: Verify `API_BASE_URL` in `frontend/script.js`
- **Check CORS**: Make sure your Cloudflare Worker allows requests from your Vercel domain
- **Check Network Tab**: Open browser DevTools → Network tab to see API errors

### Worker Not Deployed

- **Deploy Worker**:
  ```bash
  cd worker
  npx wrangler login
  npm run deploy
  ```

---

## Next Steps

- ✅ Your frontend is on Vercel
- ✅ Your backend is on Cloudflare Workers
- ✅ Everything is connected and working!

**Optional Enhancements:**
- Set up a custom domain on Vercel
- Add environment variables if needed
- Set up automatic deployments from GitHub

---

## Quick Reference

**Frontend URL**: `https://your-project.vercel.app`  
**Backend URL**: `https://worker.tinygo.workers.dev` (or your worker URL)

**Update Frontend**: Push to GitHub → Vercel auto-deploys  
**Update Backend**: Run `npm run deploy` in `worker/` directory

