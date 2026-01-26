# API Configuration Guide

## Overview
The portfolio website can fetch data from either:
1. **CMS API** (dynamic, real-time data from admin panel)
2. **Local JSON files** (static fallback)

## Auto-Detection

The API configuration automatically detects your environment:

### Local Development
- **Portfolio**: `http://localhost:3001`
- **CMS API**: `http://localhost:3000/api/public`
- Automatically uses local CMS when running on localhost

### Production
- **Portfolio**: `https://your-portfolio-domain.com`
- **CMS API**: `https://dubail-film-maker-website-portfolio.vercel.app/api/public`
- Automatically uses production CMS URL

## Configuration File

Location: `assets/js/api-config.js`

```javascript
const API_CONFIG = {
  USE_CMS_API: true,  // Set to false to use local JSON only
  
  get CMS_BASE_URL() {
    // Auto-detects localhost vs production
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:3000/api/public';
    }
    return 'https://dubail-film-maker-website-portfolio.vercel.app/api/public';
  },
  
  LOCAL_PATHS: {
    projects: 'data/project.json',
    about: 'data/about.json',
    contact: 'data/contact.json',
    header: 'data/header.json'
  }
};
```

## API Endpoints

### Projects
- **Endpoint**: `/api/public/projects`
- **Returns**: List of published projects
- **Fallback**: `data/project.json`

### About
- **Endpoint**: `/api/public/about`
- **Returns**: About page content and images
- **Fallback**: `data/about.json`

### Contact
- **Endpoint**: `/api/public/contact`
- **Returns**: Contact information
- **Fallback**: `data/contact.json`

### Header
- **Endpoint**: `/api/public/header`
- **Returns**: Header configuration and active preset
- **Fallback**: `data/header.json`

## CORS Configuration

All public API endpoints include CORS headers:

```javascript
{
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}
```

This allows the portfolio website to fetch data from the CMS regardless of domain.

## Testing Locally

### 1. Start CMS (Terminal 1)
```bash
cd final_cms
npm run dev
# Runs on http://localhost:3000
```

### 2. Start Portfolio (Terminal 2)
```bash
cd final_portfolio_website
# Use your preferred local server
python -m http.server 3001
# Or
npx serve -p 3001
```

### 3. Test API Connection
Open browser console on `http://localhost:3001` and check:
```javascript
console.log('CMS URL:', API_CONFIG.CMS_BASE_URL);
// Should show: http://localhost:3000/api/public
```

## Switching Between CMS and Local JSON

### Use CMS API (Default)
```javascript
API_CONFIG.USE_CMS_API = true;
```

### Use Local JSON Only
```javascript
API_CONFIG.USE_CMS_API = false;
```

## Fallback Behavior

If CMS API fails, automatically falls back to local JSON:

```
1. Try CMS API
   ↓ (fails)
2. Log error
   ↓
3. Try local JSON
   ↓ (success)
4. Return data
```

## Error Handling

### CMS API Unavailable
```
✗ CMS API failed for about, falling back to local JSON...
✓ Loaded from data/about.json
```

### Both Sources Fail
```
✗ CMS API failed for about
✗ Fallback to local JSON also failed
⚠️ Error displayed to user
```

## Production Deployment

### Update CMS URL
If your CMS is deployed to a different URL, update:

```javascript
get CMS_BASE_URL() {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:3000/api/public';
  }
  return 'https://YOUR-CMS-DOMAIN.com/api/public';  // Update this
}
```

### Environment Variables (Optional)
For more flexibility, you can use environment variables:

```javascript
get CMS_BASE_URL() {
  if (window.location.hostname === 'localhost') {
    return process.env.LOCAL_CMS_URL || 'http://localhost:3000/api/public';
  }
  return process.env.PROD_CMS_URL || 'https://your-cms.com/api/public';
}
```

## Troubleshooting

### CORS Errors
**Problem**: "Access-Control-Allow-Origin" error

**Solutions**:
1. Ensure CMS is running on correct port
2. Check CMS public API routes have CORS headers
3. Verify no typos in CMS URL
4. Try using local JSON as fallback

### 404 Errors
**Problem**: API endpoint not found

**Solutions**:
1. Check CMS is running: `http://localhost:3000/api/public/about`
2. Verify endpoint exists in CMS
3. Check database has data
4. Review CMS logs for errors

### Data Not Updating
**Problem**: Changes in CMS don't appear on portfolio

**Solutions**:
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Check browser console for errors
4. Verify CMS API returns updated data
5. Check if using cached local JSON

## API Response Formats

### Projects Response
```json
{
  "projects": [
    {
      "id": "uuid",
      "title": "Project Title",
      "category": "Commercial",
      "video_url": "https://...",
      "poster_image": "https://...",
      "is_published": true,
      "order_index": 1
    }
  ],
  "total": 10
}
```

### About Response
```json
{
  "page": {
    "title": "About",
    "founder": {
      "name": "Ahmed Al Mutawa",
      "title": "FILM DIRECTOR",
      "bio": "..."
    },
    "content": {
      "main_text": "...",
      "video_button": {
        "text": "view reel",
        "video_url": "https://..."
      }
    },
    "images": [
      { "url": "https://...", "alt": "..." }
    ]
  }
}
```

### Contact Response
```json
{
  "page": {
    "title": "Contact",
    "address": {
      "street": "...",
      "city": "Dubai, UAE",
      "phone": "+971...",
      "email": "info@..."
    },
    "social": {
      "vimeo": "https://...",
      "instagram": "https://..."
    }
  }
}
```

### Header Response
```json
{
  "activePreset": "default",
  "presets": {
    "default": {
      "name": "Default Layout",
      "logo": {
        "src": "assets/img/logo.svg",
        "alt": "Logo"
      },
      "mobile": { ... },
      "desktop": { ... }
    }
  }
}
```

## Best Practices

1. **Always test locally** before deploying
2. **Keep local JSON updated** as fallback
3. **Monitor CMS API** performance
4. **Use browser DevTools** to debug API calls
5. **Check CORS headers** if cross-origin issues occur
6. **Update CMS URL** when deploying to production
7. **Test fallback behavior** by stopping CMS

## Related Files

- `assets/js/api-config.js` - Main configuration
- `assets/js/data-loader.js` - Data fetching functions
- `data/*.json` - Local JSON fallbacks
- CMS: `src/app/api/public/*` - Public API routes
