# Script Loading Explanation: app-init.js & site-config.js

## Overview

Both `app-init.js` and `site-config.js` are included in `about.html`, `contact.html`, and `works.html` to support **two different loading scenarios**:

1. **Direct page load** (user visits `/about` directly)
2. **SPA navigation** (user clicks "About" link from another page)

## Why Both Scripts?

### Scenario 1: Direct Page Load (e.g., user types `/about` in browser)
- Browser loads `about.html` completely
- All scripts execute in order
- `site-config.js` detects it's the initial page and loads content
- `app-init.js` sees the flag and skips initialization (to avoid duplicate loading)

### Scenario 2: SPA Navigation (e.g., user clicks "About" from homepage)
- Only the page content is swapped (not the entire HTML)
- Scripts are already loaded from the previous page
- `site-config.js` handles the navigation and loads new content
- `app-init.js` acts as a fallback/safety net

## Script Purposes

### 1. `app-init.js` - Fallback Content Loader

**Primary Role:** Safety net for direct page loads

**What it does:**
```javascript
// Checks if content needs to be loaded
function checkAndLoadAboutContent() {
  const aboutBox = document.querySelector('.box--about');
  if (aboutBox && aboutBox.textContent.includes('Loading')) {
    loadAboutContent(); // Load from API
  }
}

// Monitors route changes
function handleRouteChange() {
  if (currentPath !== lastPath) {
    // Trigger content loading for new page
  }
}
```

**Key Features:**
- ✅ Detects "Loading..." placeholder text
- ✅ Loads content from API if needed
- ✅ Monitors route changes via polling (every 100ms)
- ✅ Skips if `site-config.js` already loaded content
- ✅ Handles browser back/forward buttons

**When it runs:**
- Direct page loads (as fallback)
- Browser visibility changes
- Window focus events
- Route changes detected by polling

---

### 2. `site-config.js` - Main Configuration & Navigation Handler

**Primary Role:** Central configuration and SPA navigation controller

**What it does:**
```javascript
// 1. Load site configuration
async function loadConfig() {
  const config = await fetch('/config.json');
  // Apply feature toggles, settings, etc.
}

// 2. Handle navigation clicks
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-navigo]')) {
    // Intercept navigation
    // Load new page content
    // Update URL
  }
});

// 3. Load page-specific content
window.loadAboutContent = async function() {
  await loadPageCSS('about'); // Load CSS
  const data = await window.fetchAbout();
  window.PageRenderer.renderAboutContent(data.page);
}

// 4. Update body classes and styles
function updateBodyClass(slug) {
  document.body.className = `template-${slug}`;
}
```

**Key Features:**
- ✅ Loads `config.json` for feature toggles
- ✅ Handles SPA navigation (intercepts link clicks)
- ✅ Dynamically loads page-specific CSS
- ✅ Updates body classes for styling
- ✅ Manages header logo switching (black/white)
- ✅ Applies header configuration from `data/header.json`
- ✅ Sets `window.__initialPageLoaded` flag to prevent duplicate loading

**When it runs:**
- On every page (initial load and SPA navigation)
- When user clicks navigation links
- When browser history changes (back/forward)

---

## Loading Flow Examples

### Example 1: User visits `/about` directly

```
1. Browser loads about.html
2. Scripts load in order:
   - data-loader.js (API functions)
   - page-renderer.js (rendering functions)
   - spa-router.js (routing logic)
   - build.min.js (animations, interactions)
   - dynamic-content-reinit.js (re-init helpers)
   - app-init.js (fallback loader)
   - site-config.js (main controller)

3. site-config.js runs:
   ✓ Loads config.json
   ✓ Detects initial page is "about"
   ✓ Calls loadAboutContent()
   ✓ Loads about.css
   ✓ Fetches about data from API
   ✓ Renders content
   ✓ Sets window.__initialPageLoaded = true

4. app-init.js runs:
   ✓ Checks window.__initialPageLoaded
   ✓ Sees it's true
   ✓ Skips initialization (avoids duplicate)
   ✓ Sets up route monitoring for future changes
```

### Example 2: User clicks "About" from homepage

```
1. User clicks <a data-navigo href="/about">

2. site-config.js intercepts click:
   ✓ Prevents default navigation
   ✓ Updates URL to /about
   ✓ Calls loadAboutContent()
   ✓ Loads about.css (if not already loaded)
   ✓ Fetches about data from API
   ✓ Renders content in existing page
   ✓ Updates body class to "template-about"
   ✓ Switches header logo to black version

3. app-init.js detects route change:
   ✓ Polling detects pathname changed
   ✓ Checks if content needs loading
   ✓ Sees content already loaded
   ✓ Does nothing (site-config.js handled it)
```

---

## Why Include Both in HTML Files?

### Reason 1: Redundancy & Reliability
- If one script fails, the other can still load content
- Ensures content always loads, regardless of timing issues

### Reason 2: Different Responsibilities
- `site-config.js` = Primary controller (SPA navigation, config)
- `app-init.js` = Fallback loader (direct loads, safety net)

### Reason 3: Direct Load Support
- When user visits `/about` directly, both scripts are needed
- `site-config.js` handles initial load
- `app-init.js` monitors for future changes

### Reason 4: SPA Navigation Support
- Scripts persist across page changes
- Both continue working after navigation
- Provide seamless experience

---

## Script Load Order (in HTML)

```html
<!-- Core functionality -->
<script src="assets/js/data-loader.js"></script>        <!-- API functions -->
<script src="assets/js/page-renderer.js"></script>     <!-- Rendering -->
<script src="assets/js/spa-router.js"></script>        <!-- Routing -->

<!-- Build.min.js (animations, interactions) -->
<script src="assets/dist/build.min.js"></script>

<!-- Helpers -->
<script src="assets/js/dynamic-content-reinit.js"></script>

<!-- Initialization (order matters!) -->
<script src="assets/js/app-init.js"></script>          <!-- Fallback loader -->
<script src="assets/js/site-config.js"></script>       <!-- Main controller -->
```

**Why this order?**
1. Core functions must load first (data-loader, page-renderer)
2. build.min.js needs DOM to be ready
3. app-init.js loads before site-config.js so site-config can set the flag
4. site-config.js runs last to take control

---

## Can We Remove One?

### Option 1: Remove app-init.js?
**❌ Not recommended**
- Loses fallback for direct page loads
- Loses route change monitoring
- Less reliable if site-config.js fails

### Option 2: Remove site-config.js?
**❌ Definitely not**
- Loses SPA navigation
- Loses config.json loading
- Loses CSS dynamic loading
- Loses header configuration
- Site would break

### Option 3: Merge them?
**✅ Possible but not necessary**
- Current separation is clean
- Each has distinct responsibility
- Easier to maintain separately

---

## Summary

| Script | Primary Role | When Active | Can Remove? |
|--------|-------------|-------------|-------------|
| `app-init.js` | Fallback content loader | Direct loads, route monitoring | ❌ Not recommended |
| `site-config.js` | Main controller & SPA handler | All scenarios | ❌ No, essential |

**Bottom line:** Both scripts work together to ensure content loads reliably in all scenarios. They're complementary, not redundant.
