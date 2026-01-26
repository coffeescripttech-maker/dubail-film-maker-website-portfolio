# About Page Images - Dynamic Loading

## Overview
The about page images are now loaded dynamically from `data/about.json` instead of being hardcoded in the HTML. This allows easy management of images through the JSON file.

## How It Works

### 1. Data Flow

```
about.html loads → app-init.js → data-loader.js → about.json → page-renderer.js → DOM update
```

**Step-by-step:**
1. User visits `/about` page
2. `app-init.js` detects the page and calls `loadAboutPage()`
3. `data-loader.js` fetches data from `data/about.json`
4. `page-renderer.js` receives the data and calls `renderAboutContent()`
5. Images are dynamically inserted into `.list--about-images`

### 2. File Structure

```
final_portfolio_website/
├── about.html                          # HTML template with empty container
├── data/
│   └── about.json                      # Data source (includes images array)
└── assets/js/
    ├── data-loader.js                  # Fetches JSON data
    ├── page-renderer.js                # Renders content to DOM
    └── app-init.js                     # Initializes page loading
```

## Implementation Details

### about.json Structure

```json
{
  "page": {
    "title": "About",
    "founder": { ... },
    "content": { ... },
    "images": [
      {
        "url": "media/pages/about/image-1.jpg",
        "alt": "Description"
      },
      {
        "url": "media/pages/about/image-2.jpg",
        "alt": "Description"
      }
    ]
  }
}
```

**Images Array:**
- `url` (required) - Path to the image file
- `alt` (optional) - Alt text for accessibility

### page-renderer.js Logic

```javascript
function renderAboutContent(pageData) {
  // ... render founder and content ...
  
  // Render images dynamically
  const aboutImagesList = document.querySelector('.list--about-images');
  
  if (aboutImagesList && pageData.images && pageData.images.length > 0) {
    let imagesHTML = '';
    pageData.images.forEach(image => {
      imagesHTML += `
        <li>
          <img class="pic" src="${image.url}" alt="${image.alt || ''}" />
        </li>
      `;
    });
    aboutImagesList.innerHTML = imagesHTML;
    console.log(`✓ Rendered ${pageData.images.length} about images`);
  }
}
```

### about.html Template

```html
<ul class="list list--about-images">
  <!-- Images will be loaded dynamically from about.json -->
</ul>
```

## How to Add/Update Images

### Option 1: Edit JSON File Directly

1. Open `data/about.json`
2. Add/modify images in the `images` array:

```json
{
  "page": {
    "images": [
      {
        "url": "path/to/new-image.jpg",
        "alt": "Image description"
      }
    ]
  }
}
```

3. Save and reload the page

### Option 2: Fetch from CMS API (Future Enhancement)

To fetch images from the CMS database:

1. **Create API endpoint** in `final_cms`:
```typescript
// final_cms/src/app/api/public/about/route.ts
export async function GET() {
  const aboutData = await getAboutContent(); // from database
  return NextResponse.json(aboutData);
}
```

2. **Update data-loader.js**:
```javascript
async function fetchAbout() {
  // Try CMS API first
  try {
    const response = await fetch(`${API_CONFIG.CMS_BASE_URL}/api/public/about`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn('CMS API not available, using local data');
  }
  
  // Fallback to local JSON
  return await fetchData('about', API_CONFIG.LOCAL_PATHS.about);
}
```

3. **Store images in database**:
```sql
CREATE TABLE about_images (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  alt TEXT,
  order_index INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Benefits

### Current Implementation (JSON-based)
✅ Simple and fast  
✅ No database queries needed  
✅ Easy to edit manually  
✅ Version control friendly  
✅ Works offline

### Future CMS Integration
✅ Manage images through admin UI  
✅ Upload images directly to R2  
✅ Reorder images with drag-and-drop  
✅ Add/remove images without code changes  
✅ Preview changes before publishing

## Testing

To verify the dynamic loading:

1. **Check console logs:**
   - Open browser DevTools (F12)
   - Navigate to `/about`
   - Look for: `✓ Rendered X about images`

2. **Test with different images:**
   - Edit `data/about.json`
   - Change image URLs or add new images
   - Reload page to see changes

3. **Test error handling:**
   - Remove `images` array from JSON
   - Page should still load without errors
   - Images section will be empty

## Troubleshooting

### Images not showing
1. Check browser console for errors
2. Verify `data/about.json` has valid JSON syntax
3. Ensure image URLs are correct and accessible
4. Check that `.list--about-images` element exists in HTML

### Images showing old content
1. Clear browser cache (Ctrl+Shift+R)
2. Check if JSON file was saved correctly
3. Verify no caching headers on JSON file

### Console shows "0 images rendered"
1. Check JSON structure - `images` should be array under `page`
2. Verify `pageData.images` is not empty
3. Check for JavaScript errors in console

## Next Steps

To integrate with CMS:

1. Create `about_images` table in database
2. Add image upload UI in CMS admin
3. Create public API endpoint `/api/public/about`
4. Update `data-loader.js` to fetch from API
5. Keep `about.json` as fallback

This allows content managers to update images through the CMS while maintaining the JSON fallback for development/offline use.
