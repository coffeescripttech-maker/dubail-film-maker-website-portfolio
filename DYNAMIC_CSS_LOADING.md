# Dynamic CSS Loading for SPA Navigation

## Problem
When navigating between pages using the SPA router (e.g., from Contact to About), the page-specific CSS files (like `about.css`) were not being loaded. This caused layout issues because only the HTML content was being injected, not the `<link>` tags from the `<head>` section.

## Solution
Added dynamic CSS loading functionality to `site-config.js` that:

1. **Tracks loaded stylesheets** - Prevents duplicate loading
2. **Loads page-specific CSS** - Automatically loads the correct CSS file based on page slug
3. **Integrates with content loaders** - CSS is loaded before page content is rendered

## Implementation

### 1. CSS Loader Utility (site-config.js)
```javascript
// Track loaded stylesheets to avoid duplicates
const loadedStylesheets = new Set();

function loadStylesheet(href, id) {
  // Check if already loaded
  if (loadedStylesheets.has(id)) {
    return Promise.resolve();
  }
  
  // Create and append link element
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
  
  return new Promise((resolve, reject) => {
    link.onload = () => {
      loadedStylesheets.add(id);
      resolve();
    };
    link.onerror = reject;
  });
}

async function loadPageCSS(slug) {
  const cssMap = {
    'about': 'assets/css/templates/about.css',
    'contact': 'assets/css/templates/contact.css',
    'works': 'assets/css/templates/works.css'
  };
  
  if (cssMap[slug]) {
    await loadStylesheet(cssMap[slug], `${slug}-page-css`);
  }
}
```

### 2. Integration with Content Loaders
Updated all content loading functions to load CSS first:

```javascript
window.loadAboutContent = async function() {
  await loadPageCSS('about');  // Load CSS first
  const data = await window.fetchAbout();
  window.PageRenderer.renderAboutContent(data.page);
}

window.loadContactContent = async function() {
  await loadPageCSS('contact');  // Load CSS first
  const data = await window.fetchContact();
  window.PageRenderer.renderContactContent(data.page);
}

window.loadProjects = async function() {
  await loadPageCSS('works');  // Load CSS first
  const projects = await window.fetchProjects();
  window.PageRenderer.renderWorksProjects(projects);
}
```

## CSS Files Loaded

| Page | CSS File | ID |
|------|----------|-----|
| About | `assets/css/templates/about.css` | `about-page-css` |
| Contact | `assets/css/templates/contact.css` | `contact-page-css` |
| Works | `assets/css/templates/works.css` | `works-page-css` |

## Benefits

1. **Consistent Styling** - Page-specific styles are always applied, whether loading directly or via SPA navigation
2. **No Duplicates** - Stylesheet tracking prevents loading the same CSS multiple times
3. **Performance** - CSS is loaded asynchronously and only when needed
4. **Maintainable** - Easy to add new page-specific CSS files by updating the `cssMap`

## Testing

To verify CSS is loading correctly:

1. Navigate to homepage
2. Click "About" link
3. Check browser DevTools > Network tab - you should see `about.css` loaded
4. Check Elements tab > `<head>` - you should see `<link id="about-page-css" ...>`
5. Verify layout looks correct (images-button-wrapper grid layout, etc.)

## Console Logs

When CSS loads successfully, you'll see:
```
✓ Loaded stylesheet: assets/css/templates/about.css
✓ Page CSS loaded for: about
```

If already loaded:
```
✓ Stylesheet already loaded: about-page-css
```

## Future Enhancements

- Add CSS unloading for pages no longer needed (memory optimization)
- Preload CSS for likely next pages
- Add critical CSS inlining for faster initial render
