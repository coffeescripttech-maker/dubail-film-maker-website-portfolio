# SPA Router Implementation

## Overview
Implemented a centralized Single Page Application (SPA) router that handles navigation between pages without full page reloads.

## How It Works

### 1. Router Initialization
The `spa-router.js` script automatically initializes when the page loads and:
- Sets up click event listeners on all links with `data-navigo` attribute
- Handles browser back/forward buttons (popstate events)
- Loads the initial route based on current URL

### 2. Navigation Flow
When you click a navigation link (e.g., from Homepage to Contact):

```
User clicks "Contact" link
    ↓
Router intercepts the click
    ↓
Updates browser URL (pushState)
    ↓
Fetches contact.html structure
    ↓
Extracts page content
    ↓
Loads contact data from API
    ↓
Renders contact page with correct data
    ↓
Updates body classes and active nav states
```

### 3. Page Loading Strategy

Each page type has its own loader:

**Homepage (`loadHomepage`)**
- Fetches index.html structure
- Loads projects from API
- Renders homepage slider (6 projects)
- Renders projects listing grid

**Works Page (`loadWorksPage`)**
- Fetches works.html structure
- Loads projects from API
- Renders works grid with all projects

**About Page (`loadAboutPage`)**
- Fetches about.html structure
- Loads about data from API
- Renders founder info, bio, images

**Contact Page (`loadContactPage`)**
- Fetches contact.html structure
- Loads contact data from API
- Renders staff list and address info

### 4. Smart Caching
The router checks if content is already loaded:
- If the page structure exists in DOM, it just refreshes the data
- If not, it fetches the HTML structure and then loads data
- This makes subsequent navigations faster

## Files Modified

1. **Created: `assets/js/spa-router.js`**
   - Main router logic
   - Route definitions
   - Page loaders
   - Navigation interceptor

2. **Updated: `index.html`**
   - Added spa-router.js script

3. **Updated: `contact.html`**
   - Added spa-router.js script
   - Cleaned up duplicate build.min.js

4. **Updated: `about.html`**
   - Added spa-router.js script
   - Cleaned up duplicate build.min.js

5. **Updated: `works.html`**
   - Added spa-router.js script

## Usage

### Navigation Links
All navigation links should have the `data-navigo` attribute:

```html
<a href="/contact" data-navigo>Contact</a>
<a href="/about" data-navigo>About</a>
<a href="/works" data-navigo>Works</a>
<a href="/" data-navigo>Homepage</a>
```

### Programmatic Navigation
You can also navigate programmatically:

```javascript
// Navigate to a route
window.SPARouter.navigateTo('/contact');

// Get current route
const currentRoute = window.SPARouter.getCurrentRoute();
console.log(currentRoute); // 'contact', 'about', 'homepage', etc.
```

## Route Definitions

The router recognizes these routes:

| Path | Route Name | Page |
|------|-----------|------|
| `/` | homepage | Homepage with slider |
| `/index` | homepage | Homepage with slider |
| `/index.html` | homepage | Homepage with slider |
| `/works` | works | Works grid page |
| `/works.html` | works | Works grid page |
| `/about` | about | About page |
| `/about.html` | about | About page |
| `/contact` | contact | Contact page |
| `/contact.html` | contact | Contact page |

## Body Classes

The router automatically updates body classes based on the current route:

- **Homepage**: `template-homepage`
- **Works**: `template-works`
- **About**: `template-about body-light`
- **Contact**: `template-contact body-light`

This ensures correct styling for each page type.

## Integration with Existing Code

The router works seamlessly with:
- **DataLoader**: Fetches data from CMS API
- **PageRenderer**: Renders content for each page type
- **build.min.js**: Handles animations and interactions
- **LazyLoad**: Loads images/videos on demand

## Benefits

1. **No Full Page Reloads**: Faster navigation, smoother UX
2. **Preserves State**: Keeps scroll position, loaded data
3. **SEO Friendly**: Uses real URLs with pushState
4. **Browser History**: Back/forward buttons work correctly
5. **Centralized Logic**: Single source of truth for routing
6. **Easy to Extend**: Add new routes easily

## Testing

To test the router:

1. Start from homepage
2. Click "Contact" - should load contact page without reload
3. Click "About" - should load about page
4. Click "Works" - should load works page
5. Use browser back button - should navigate back
6. Use browser forward button - should navigate forward
7. Refresh page - should load current route correctly

## Debugging

Enable console logs to see router activity:
- Navigation events: `🧭 Navigating to: /contact`
- Content loading: `📄 Loading content for route: contact`
- Page loaded: `✓ Contact page loaded`

## Future Enhancements

Possible improvements:
- Add loading indicators during page transitions
- Implement page transition animations
- Add route guards for authentication
- Cache fetched HTML structures
- Preload next likely page
