# CMS Integration Guide

## Overview
Your portfolio website automatically fetches data from the CMS API. This guide explains how the integration works.

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     CMS (final_cms)                         │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │   Database   │ ───> │  Public API  │                    │
│  │   (D1/SQLite)│      │  /api/public │                    │
│  └──────────────┘      └──────────────┘                    │
│                              │                               │
└──────────────────────────────┼───────────────────────────────┘
                               │ HTTP Request
                               │ (CORS enabled)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Portfolio Website (final_portfolio_website)    │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │ data-loader  │ ───> │ site-config  │                    │
│  │     .js      │      │     .js      │                    │
│  └──────────────┘      └──────────────┘                    │
│         │                     │                              │
│         └─────────────────────┴──────> Renders Website      │
└─────────────────────────────────────────────────────────────┘
```

## How It Works

### 1. **Data Loader (data-loader.js)**
This is the central data fetching module that handles all API calls.

**Location:** `assets/js/data-loader.js`

**Configuration:**
```javascript
const API_CONFIG = {
  USE_CMS_API: true,  // Set to true to use CMS API
  CMS_BASE_URL: 'https://dubail-film-maker-website-portfolio.vercel.app/api/public',
  LOCAL_PATHS: {
    projects: 'data/project.json',
    about: 'data/about.json',
    contact: 'data/contact.json',
    header: 'data/header.json'
  }
};
```

**Functions:**
- `fetchProjects()` - Fetches all published projects
- `fetchAbout()` - Fetches about page content
- `fetchContact()` - Fetches contact information
- `fetchHeader()` - Fetches header configuration

**Fallback Strategy:**
If CMS API fails, automatically falls back to local JSON files in `/data/` folder.

### 2. **Site Config (site-config.js)**
Applies the fetched configuration to the website.

**Location:** `assets/js/site-config.js`

**What it does:**
- Loads header configuration from CMS
- Applies header styles based on active preset
- Updates logo based on selected preset
- Handles responsive styles for mobile/desktop

### 3. **Page Renderer (page-renderer.js)**
Renders content on specific pages.

**Location:** `assets/js/page-renderer.js`

**Functions:**
- `renderAboutContent()` - Renders about page
- `renderContactContent()` - Renders contact page
- `renderWorksProjects()` - Renders projects grid

## API Endpoints Used

### Projects
**Endpoint:** `GET https://dubail-film-maker-website-portfolio.vercel.app/api/public/projects`

**Used on:** Works page (`/works`)

**Data:** All published projects with videos, images, and metadata

### About
**Endpoint:** `GET https://dubail-film-maker-website-portfolio.vercel.app/api/public/about`

**Used on:** About page (`/about`)

**Data:** Founder info, company description, video button

### Contact
**Endpoint:** `GET https://dubail-film-maker-website-portfolio.vercel.app/api/public/contact`

**Used on:** Contact page (`/contact`)

**Data:** Email, phone, address, social media links

### Header
**Endpoint:** `GET https://dubail-film-maker-website-portfolio.vercel.app/api/public/header`

**Used on:** All pages (global header)

**Data:** Active preset, logo URLs, layout configuration

## Configuration Steps

### Step 1: Enable CMS API
In `data-loader.js`, ensure:
```javascript
USE_CMS_API: true
```

### Step 2: Set CMS URL
For local development:
```javascript
CMS_BASE_URL: 'https://dubail-film-maker-website-portfolio.vercel.app/api/public'
```

For production:
```javascript
CMS_BASE_URL: 'https://your-cms-domain.com/api/public'
```

### Step 3: Test the Integration
1. Start CMS: `cd final_cms && npm run dev`
2. Start Portfolio: Open `index.html` in browser or use a local server
3. Open browser console
4. Look for these messages:
   ```
   ✓ DataLoader module initialized
   🔄 Fetching header config from CMS API...
   ✓ Header config loaded from CMS API
   ✓ Projects loaded from CMS API
   ```

## Debugging

### Check if API is working
Open these URLs in your browser:
- https://dubail-film-maker-website-portfolio.vercel.app/api/public/projects
- https://dubail-film-maker-website-portfolio.vercel.app/api/public/about
- https://dubail-film-maker-website-portfolio.vercel.app/api/public/contact
- https://dubail-film-maker-website-portfolio.vercel.app/api/public/header

You should see JSON responses.

### Check browser console
Look for:
- ✅ Success messages: `✓ Header config loaded from CMS API`
- ⚠️ Warning messages: `⚠ Could not load header config`
- ❌ Error messages: Check network tab for failed requests

### Common Issues

**1. CORS Error**
```
Access to fetch at 'https://dubail-film-maker-website-portfolio.vercel.app/api/public/...' has been blocked by CORS policy
```
**Solution:** CMS APIs already have CORS enabled. Make sure CMS is running.

**2. 404 Not Found**
```
GET https://dubail-film-maker-website-portfolio.vercel.app/api/public/header 404 (Not Found)
```
**Solution:** 
- Check if CMS is running on port 3000
- Verify the endpoint exists
- Check CMS logs for errors

**3. Fallback to Local JSON**
```
⚠ CMS API failed, falling back to local JSON...
```
**Solution:** This is normal if CMS is not running. The website will use local JSON files as backup.

## Data Update Flow

### When you update content in CMS:

1. **Admin updates content** in CMS Settings
2. **Data saved to database** (D1/SQLite)
3. **Public API serves updated data** immediately
4. **Portfolio website fetches** on next page load
5. **Changes appear** on portfolio website

### Cache Clearing

The data-loader caches API responses. To clear cache:
```javascript
// In browser console
window.DataLoader.clearCache();
```

Or reload the page with cache disabled (Ctrl+Shift+R / Cmd+Shift+R)

## Production Deployment

### Step 1: Update API URL
In `data-loader.js`:
```javascript
CMS_BASE_URL: 'https://your-production-cms.com/api/public'
```

### Step 2: Keep Local JSON as Fallback
Keep the `/data/*.json` files as backup in case CMS is temporarily unavailable.

### Step 3: Test Before Deploying
1. Test all pages load correctly
2. Verify images and videos display
3. Check header logo appears
4. Test on mobile devices

## File Structure

```
final_portfolio_website/
├── assets/js/
│   ├── data-loader.js      ← Fetches from CMS API
│   ├── site-config.js      ← Applies header config
│   ├── page-renderer.js    ← Renders page content
│   └── api-config.js       ← (Legacy, can be removed)
├── data/
│   ├── project.json        ← Fallback data
│   ├── about.json          ← Fallback data
│   ├── contact.json        ← Fallback data
│   └── header.json         ← Fallback data
└── index.html              ← Main page
```

## Benefits of CMS Integration

✅ **Real-time updates** - Changes in CMS appear immediately
✅ **No manual JSON editing** - Update content through UI
✅ **Image/video management** - Upload files through CMS
✅ **Automatic fallback** - Uses local JSON if CMS is down
✅ **CORS enabled** - Works across different domains
✅ **No authentication needed** - Public APIs are open

## Next Steps

1. ✅ CMS APIs are ready
2. ✅ Portfolio website is configured
3. 🔄 Run database migration for header settings
4. 🎨 Upload logos in CMS Settings
5. 🚀 Test the integration
6. 📝 Update content in CMS
7. 🌐 Deploy to production

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify CMS is running
3. Test API endpoints directly
4. Check CORS headers
5. Review this guide
