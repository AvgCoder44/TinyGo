# TinyGo - URL Shortener

A modern, full-stack URL shortener built with Cloudflare Workers and Vite. Create short, memorable links with analytics tracking and custom aliases.

## Features

- ✨ **URL Shortening**: Create short URLs with 7-character codes
- 🎯 **Custom Short Codes**: Use your own custom aliases
- 🔒 **Collision-Proof Generation**: Guaranteed unique codes
- 📊 **Click Analytics**: Track total clicks, first click, and last click
- ⏰ **Auto-Expiration**: URLs expire after 30 days (configurable)
- ⚡ **Lightning Fast**: Built on Cloudflare Workers edge network

## Project Structure

```
TinyGo/
├── frontend/          # Frontend application (HTML, CSS, JS)
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── package.json
│   └── vercel.json
├── worker/            # Cloudflare Worker backend
│   ├── src/
│   │   └── index.js
│   ├── wrangler.jsonc
│   └── package.json
├── vercel.json        # Vercel deployment config
├── DEPLOYMENT.md      # Detailed deployment guide
└── README.md
```

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Vite
- **Backend**: Cloudflare Workers
- **Database**: Cloudflare KV (Key-Value Store)
- **Deployment**: Vercel (Frontend) + Cloudflare Workers (Backend)

## Setup

### Prerequisites

- Node.js 16+ installed
- Cloudflare account (for backend)
- Vercel account (for frontend deployment)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/AvgCoder44/TinyGo.git
   cd TinyGo
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

3. **Backend Setup (Cloudflare Worker)**
   ```bash
   cd worker
   npm install
   npx wrangler dev --local
   ```
   Backend will run on `http://localhost:8787`

## Deployment

### Deploy Frontend to Vercel

#### Option 1: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from frontend directory**
   ```bash
   cd frontend
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name? (Enter a name or press Enter)
   - Directory? **./** (current directory)
   - Override settings? **No**

#### Option 2: Using GitHub Integration (Recommended)

1. **Code is already on GitHub**
   - Repository: [github.com/AvgCoder44/TinyGo](https://github.com/AvgCoder44/TinyGo)

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Import `TinyGo` repository
   - **Root Directory**: Set to `frontend`
   - Framework Preset: **Vite**
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
   - Click "Deploy"

### Deploy Backend to Cloudflare Workers

1. **Navigate to worker directory**
   ```bash
   cd worker
   ```

2. **Login to Cloudflare**
   ```bash
   npx wrangler login
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Frontend API Configuration**
   - The frontend is configured to use: `https://worker.tinygo.workers.dev`
   - If you deploy a new worker, update `API_BASE_URL` in `frontend/script.js`

## Configuration

### Frontend API Configuration

The frontend connects to the Cloudflare Worker backend. Current configuration:

```javascript
// frontend/script.js
const API_BASE_URL = 'https://worker.tinygo.workers.dev';
```

To use a different worker URL, update this value in `frontend/script.js`.

### Backend Configuration

Cloudflare Worker configuration is in `worker/wrangler.jsonc`:

- **KV Namespace**: Already configured
- **Compatibility Date**: 2025-12-05

## API Endpoints

### POST /shorten
Create a short URL

**Request:**
```json
{
  "url": "https://example.com",
  "custom_code": "my-link",  // optional
  "expires_in": 2592000      // optional (seconds)
}
```

**Response:**
```json
{
  "short_url": "https://worker.tinygo.workers.dev/abc1234",
  "code": "abc1234",
  "expires_in": 2592000
}
```

### GET /{code}
Redirect to original URL (tracks clicks)

### GET /stats/{code}
Get click analytics

**Response:**
```json
{
  "code": "abc1234",
  "total_clicks": 42,
  "metadata": {
    "created": "2025-12-06T...",
    "firstClick": "2025-12-06T...",
    "lastClick": "2025-12-06T...",
    "totalClicks": 42
  }
}
```

## Environment Variables

### Cloudflare Worker
- KV namespace is configured in `wrangler.jsonc`
- No additional environment variables needed

### Vercel
- No environment variables needed for frontend
- Frontend uses public API endpoint

## Live Demo

- **Frontend**: Deployed on Vercel (configure in Vercel dashboard)
- **Backend API**: `https://worker.tinygo.workers.dev`

## Development

### Making Changes

1. **Frontend Changes**
   ```bash
   cd frontend
   npm run dev  # Start dev server on localhost:3000
   ```

2. **Backend Changes**
   ```bash
   cd worker
   npx wrangler dev --local  # Start local worker on localhost:8787
   ```

3. **Deploy Changes**
   - Frontend: Push to GitHub → Vercel auto-deploys
   - Backend: `cd worker && npm run deploy`

## License

MIT License - feel free to use this project for learning or production!

## Author

Built by [AvgCoder44](https://github.com/AvgCoder44)

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/AvgCoder44/TinyGo/issues).

