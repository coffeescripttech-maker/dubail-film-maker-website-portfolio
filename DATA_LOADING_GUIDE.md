# Portfolio Website Data Loading Guide

## 📋 Overview

The portfolio website uses a **modular data loading system** with three main JavaScript files that work together to fetch, render, and manage content dynamically.

---

## 🏗️ Architecture

### Three Core Modules:

1. **`data-loader.js`** - Data fetching with API/JSON fallback
2. **`page-renderer.js`** - Content rendering for all pages
3. **`app-init.js`** - Page initialization and routing

---

## 📦 Data Structure

### Project Data Format (`project.json`)

```json
{
  "projects": [
    {
      "id": 1,
      "title": "The Abu Dhabi Plan",
      "client": "Abu Dhabi Executive Council",
      "category": "Government / Strategic Communication",
      "data_cat": "government",
      "languages": "Arabic & English",
      "classification": "TVC",
      "vimeo_id": "414307456",
      "video_url": "https://video.wixstatic.com/video/...",
      "poster_image": "https://res.cloudinary.com/...",
      "poster_image_srcset": "... 300w, ... 800w",
      "link": "works/project-detail#id=1",
      "credits": [
        {"role": "Client", "name": "Abu Dhabi Executive Council"},
        {"role": "Production Company", "name": "DubaiFilmMaker"}
      ]
    }
  ],
  "categories": ["corporate", "business", "tourism", "government"],
  "classifications": ["TVC", "BRAND FILM"],
  "total_projects": 16
}
```

### Key Fields Explained:

| Field | Type | Purpose |
|-------|------|---------|
| `id` | number | Unique project identifier |
| `title` | string | Project name |
| `client` | string | Client name |
| `category` | string | Display category (e.g., "Government / Strategic Communication") |
| `data_cat` | string | Filter category (e.g., "government") |
| `classification` | string | Project type: "TVC" or "BRAND FILM" |
| `vimeo_id` | string | Vimeo video ID (legacy) |
| `video_url` | string | Direct MP4 video URL for playback |
| `poster_image` | string | Thumbnail image URL |
| `poster_image_srcset` | string | Responsive image sources |
| `link` | string | Project detail page URL |
| `credits` | array | Array of {role, name} objects |

---

## 🔄 Data Loading Flow

### 1. Configuration (`api-config.js`)

```javascript
const API_CONFIG = {
  USE_CMS_API: true,  // Switch between CMS API and local JSON
  CMS_BASE_URL: 'http://localhost:3001/api',
  LOCAL_PATHS: {
    projects: 'data/project.json',
    about: 'data/about.json',
    contact: 'data/contact.json',
    header: 'data/header.json'
  }
};
```

**How it works:**
- If `USE_CMS_API = true`: Fetches from CMS API
- If API fails: Falls back to local JSON files
- If `USE_CMS_API = false`: Uses local JSON directly

### 2. Data Fetching (`data-loader.js`)

```javascript
// Fetch projects
const projects = await window.fetchProjects();

// Fetch about page
const aboutData = await window.fetchAbout();

// Fetch contact page
const contactData = await window.fetchContact();

// Fetch header config
const headerData = await window.fetchHeader();
```

**Features:**
- ✅ Automatic caching (prevents duplicate requests)
- ✅ API/JSON fallback
- ✅ Error handling
- ✅ Console logging for debugging

### 3. Page Rendering (`page-renderer.js`)

#### Homepage (`index.html`)

**Two rendering functions:**

1. **`renderHomepageSlider(projects)`**
   - Uses first 6 projects
   - Creates slider with pagination
   - Renders cursor player videos
   - Updates main video section

2. **`renderIndexProjects(projects)`**
   - Renders all projects in grid
   - Handles progressive loading
   - Updates existing projects with fresh data
   - Appends new projects

#### Works Page (`works.html`)

**`renderWorksProjects(projects)`**
- Renders all projects in grid
- Adds hover video playback
- Supports category filtering

#### About Page (`about.html`)

**`renderAboutContent(pageData)`**
- Renders founder bio
- Renders main content
- Updates video button

#### Contact Page (`contact.html`)

**`renderContactContent(pageData)`**
- Renders staff list by department
- Renders address and contact info
- Renders social media links

#### Project Detail Page (`project-detail.html`)

**`renderProjectDetail(project)`**
- Updates page title and meta
- Loads high-quality video
- Renders credits list

---

## 🎯 How Data Flows

### Example: Homepage Loading

```
1. User visits index.html
   ↓
2. app-init.js detects homepage
   ↓
3. Calls window.fetchProjects()
   ↓
4. data-loader.js fetches from:
   - CMS API: http://localhost:3001/api/projects
   - OR Fallback: data/project.json
   ↓
5. Returns array of project objects
   ↓
6. page-renderer.js renders:
   - Homepage slider (first 6 projects)
   - Projects grid (all projects)
   ↓
7. Dispatches events:
   - 'slider-rendered'
   - 'projects-rendered'
   ↓
8. index.html event listeners:
   - Re-initialize video hover
   - Re-initialize cursor player
   - Setup category filtering
```

---

## 🔌 CMS API Integration

### API Endpoints Expected:

```
GET /api/projects
Response: { projects: [...] }

GET /api/about
Response: { page: {...} }

GET /api/contact
Response: { page: {...} }

GET /api/header
Response: { activePreset: "...", presets: {...} }
```

### CMS API URL Configuration:

**Development:**
```javascript
CMS_BASE_URL: 'http://localhost:3001/api'
```

**Production:**
```javascript
CMS_BASE_URL: 'https://your-cms-domain.com/api'
```

---

## 📂 File Structure

```
final_portfolio_website/
├── assets/
│   └── js/
│       ├── api-config.js       # API configuration
│       ├── data-loader.js      # Data fetching module
│       ├── page-renderer.js    # Rendering module
│       ├── app-init.js         # Initialization module
│       └── site-config.js      # Site-wide config
├── data/
│   ├── project.json            # Projects data (fallback)
│   ├── about.json              # About page data
│   ├── contact.json            # Contact page data
│   └── header.json             # Header config
└── index.html                  # Homepage
```

---

## 🎨 Rendering Details

### Homepage Slider

**HTML Structure Generated:**
```html
<ul class="list list--home" id="homepage-slider">
  <!-- Cursor player videos -->
  <div class="cursor-player-animated">
    <div class="players-wrapper">
      <video class="player-animated-player" data-src="..."></video>
      <!-- More videos -->
    </div>
  </div>
  
  <!-- Slider items -->
  <li class="is-active">
    <a href="..." class="js-change-video">
      <h2>Project Title</h2>
      <p>Client Name</p>
      <p>Classification</p>
    </a>
  </li>
  <!-- More items -->
</ul>
```

### Projects Grid

**HTML Structure Generated:**
```html
<li class="box box--work" data-cat="TVC">
  <a href="..." class="box--work__link js-has-cursor-text">
    <div class="box--work__info">
      <h2>Project Title</h2>
      <p>Client Name</p>
      <p>Category</p>
    </div>
    <div class="box--work__video video-wrapper has-poster">
      <img class="video-img-poster" src="..." srcset="...">
      <video class="js-video" src="..." playsinline loop muted></video>
    </div>
    <div class="cursor-text-animated">
      <!-- Cursor animation elements -->
    </div>
  </a>
</li>
```

---

## 🔧 Key Features

### 1. Caching System
```javascript
const cache = {};

if (cache[cacheKey]) {
  return cache[cacheKey];  // Return cached data
}

// Fetch and cache
cache[cacheKey] = data;
```

### 2. Progressive Loading
- Initial projects loaded from HTML (fast initial render)
- Fresh data fetched from API/JSON
- Existing projects updated with fresh data
- New projects appended

### 3. Category Filtering
```javascript
// Filter by classification
const filterLinks = document.querySelectorAll('.js-filter-cat');
filterLinks.forEach(link => {
  link.addEventListener('click', function() {
    const category = this.getAttribute('data-cat');
    // Show/hide projects based on data-cat attribute
  });
});
```

### 4. Video Management
- Hover to play (projects grid)
- Auto-play main video (homepage)
- Cursor player videos (homepage slider)
- Lazy loading for performance

---

## 🐛 Debugging

### Enable Debug Mode:
```javascript
// In page-renderer.js
const DEBUG_HOVER = true;  // Shows detailed hover logs
```

### Check Data Loading:
```javascript
// In browser console
console.log(window.DataLoader.config);
console.log(await window.fetchProjects());
```

### Clear Cache:
```javascript
window.DataLoader.clearCache();
```

---

## 🚀 Switching Between CMS and JSON

### Use CMS API:
```javascript
// In api-config.js or data-loader.js
USE_CMS_API: true
CMS_BASE_URL: 'http://localhost:3001/api'
```

### Use Local JSON:
```javascript
USE_CMS_API: false
// Will use files in data/ folder
```

---

## ✅ Summary

**Data Flow:**
1. `api-config.js` - Configures data source
2. `data-loader.js` - Fetches data with fallback
3. `page-renderer.js` - Renders content
4. `app-init.js` - Initializes pages
5. `index.html` - Re-initializes interactions

**Key Benefits:**
- ✅ Modular and maintainable
- ✅ API/JSON fallback for reliability
- ✅ Caching for performance
- ✅ Progressive loading for speed
- ✅ Event-driven architecture
- ✅ Easy to switch between CMS and static data

**Data Structure:**
- Projects: Array of project objects
- Each project: 15+ fields including video, images, credits
- Categories and classifications for filtering
- Responsive images with srcset
