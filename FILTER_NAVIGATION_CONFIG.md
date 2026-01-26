# Filter Navigation Visibility Configuration

## Overview
The projects filter navigation (category filters like "all", "TVC / Brand Films", etc.) can now be configured to either:
- **Always visible** - Stays visible at all times on all pages
- **Scroll-based** - Uses default behavior (shows/hides based on scroll position)

## Configuration

Edit `config.json` to control the visibility behavior:

```json
{
  "features": {
    "projectsNav": {
      "enabled": true,
      "description": "Enable/disable projects category navigation",
      "alwaysVisible": true,
      "alwaysVisibleDescription": "When true, filter navigation stays visible at all times. When false, uses default scroll-based visibility behavior"
    }
  }
}
```

### Settings

#### `projectsNav.enabled`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Master switch to enable/disable the entire filter navigation
- **Values:**
  - `true` - Filter navigation is enabled
  - `false` - Filter navigation is completely hidden

#### `projectsNav.alwaysVisible`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Controls whether filter navigation is always visible or uses scroll-based visibility
- **Values:**
  - `true` - Filter navigation stays visible at all times (recommended for important filters)
  - `false` - Filter navigation uses default scroll-based behavior (shows/hides based on page scroll)

## Behavior

### When `alwaysVisible: true`
- Filter navigation is **always visible** on both desktop and mobile
- Overrides any scroll-based hiding behavior
- Labels like "TVC / Brand Films" are never truncated or hidden
- Works on all screen sizes and breakpoints
- Useful when filters are a primary navigation element

### When `alwaysVisible: false`
- Filter navigation uses **default scroll-based behavior**
- On homepage: Shows when scrolled to works section
- On works page: May show/hide based on scroll position
- Follows the original design intent from build.min.css
- Useful for cleaner UI when filters are secondary

## Technical Implementation

### How It Works

1. **Config Loading:** On page load, a synchronous script reads `config.json`
2. **Class Application:** If `alwaysVisible: true`, adds `projects-nav-always-visible` class to `<html>` element
3. **CSS Activation:** CSS rules scoped to `.projects-nav-always-visible` override default hiding behavior

### CSS Selectors

When `alwaysVisible: true`, these CSS rules are activated:

```css
body.projects-nav-always-visible .projects-nav {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}
```

### Files Modified

- `config.json` - Added `alwaysVisible` setting
- `index.html` - Added conditional CSS and config loader script
- `works.html` - Added conditional CSS and config loader script

## Use Cases

### Always Visible (Recommended)
Use when:
- Filters are a primary navigation method
- You have few categories (2-3 filters)
- Users need constant access to filtering
- Brand/category distinction is important

### Scroll-Based
Use when:
- You want a cleaner, minimal UI
- Filters are secondary to content
- You have many categories (might clutter UI)
- Following original posterco.tv design

## Examples

### Example 1: Always Visible (Current Setup)
```json
{
  "features": {
    "projectsNav": {
      "enabled": true,
      "alwaysVisible": true
    }
  }
}
```
**Result:** "TVC / Brand Films" filter is always visible on all pages

### Example 2: Scroll-Based Visibility
```json
{
  "features": {
    "projectsNav": {
      "enabled": true,
      "alwaysVisible": false
    }
  }
}
```
**Result:** Filter navigation shows/hides based on scroll position (original behavior)

### Example 3: Completely Hidden
```json
{
  "features": {
    "projectsNav": {
      "enabled": false,
      "alwaysVisible": false
    }
  }
}
```
**Result:** Filter navigation is completely hidden (not recommended if you have categories)

## Browser Support

- Works in all modern browsers
- Uses synchronous XHR for immediate config loading (before page render)
- Fallback: If config fails to load, uses default scroll-based behavior

## Testing

To test the configuration:

1. **Test Always Visible:**
   - Set `alwaysVisible: true` in config.json
   - Reload homepage and works page
   - Verify filter navigation is visible at all scroll positions
   - Check on mobile and desktop

2. **Test Scroll-Based:**
   - Set `alwaysVisible: false` in config.json
   - Reload homepage
   - Scroll down - filter should appear when reaching works section
   - Scroll up - filter may hide (depending on build.min.css behavior)

3. **Test Disabled:**
   - Set `enabled: false` in config.json
   - Reload pages
   - Verify filter navigation is completely hidden

## Console Logging

Check browser console for confirmation:
- `✓ Projects navigation set to always visible` - When `alwaysVisible: true`
- `✓ Projects navigation using default scroll-based visibility` - When `alwaysVisible: false`

## Troubleshooting

### Filter navigation not showing
1. Check `config.json` - ensure `enabled: true`
2. Check browser console for errors
3. Verify `config.json` is valid JSON (no syntax errors)
4. Clear browser cache and reload

### Filter navigation still hiding on scroll
1. Verify `alwaysVisible: true` in config.json
2. Check browser console - should see "always visible" message
3. Inspect `<html>` element - should have `projects-nav-always-visible` class
4. Check for CSS conflicts in browser DevTools

### Text truncation issues
- The `alwaysVisible: true` setting includes `white-space: nowrap !important`
- This prevents text from being cut off
- If still truncated, check for conflicting CSS in build.min.css

## Recommendations

**For DubaiFilmMaker site:**
- Use `alwaysVisible: true` (current setting)
- Ensures "TVC / Brand Films" is always accessible
- Provides clear category distinction
- Better UX for sites with important category filtering

**For minimal/clean design:**
- Use `alwaysVisible: false`
- Reduces visual clutter
- Follows original posterco.tv design philosophy
- Better for content-first approach
