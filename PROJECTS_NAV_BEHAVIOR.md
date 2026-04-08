# Projects Navigation (.projects-nav) Behavior

## Overview
The `.projects-nav` contains the `.list--cat` filter links (all, TVC, narrative, etc.) and has different behaviors on desktop vs mobile, and on homepage vs works page.

## CSS Behavior from build.min.css

### Base Styles (.list--cat)
```css
.list--cat {
  bottom: 0;
  font-size: 0;
  left: 20px;
  position: fixed;
  right: 20px;
  text-align: center;
  transition: opacity .3s var(--main-bezier);
  z-index: 8;
}
```

### Homepage Behavior
**On Homepage (template-homepage):**
- **Hidden by default** until user scrolls to works section
- When NOT on works section: `opacity: 0; pointer-events: none`
- When ON works section (`.on-works-section` class added): Visible

```css
.template-homepage header:not(.on-works-section) .list--cat {
  opacity: 0;
  pointer-events: none;
}
```

### Works Page Behavior
**On Works Page (template-projects):**
- **Always visible** - no conditional hiding
- Fixed at bottom of viewport
- Allows filtering of projects

### Mobile vs Desktop

**Mobile (< 768px):**
- Fixed position at bottom
- Full width (left: 20px, right: 20px)
- Centered text
- Same visibility rules apply

**Desktop (≥ 768px):**
- Fixed position at bottom
- Full width (left: 20px, right: 20px)
- Centered text
- Same visibility rules apply

## Scroll-Based Visibility (Homepage Only)

The visibility is controlled by JavaScript that adds/removes the `.on-works-section` class to the header when:
- User scrolls down to the projects listing section
- The `.bloc-projects-listing` enters the viewport

## Override Options

### Always Visible (via config.json)
If `projectsNavAlwaysVisible: true` in config.json:
```css
html.projects-nav-always-visible .projects-nav,
html.projects-nav-always-visible .projects-nav .list--cat {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}
```

### Filter Active State
When a filter is active (user clicked a category):
```css
header.filter-active .projects-nav {
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
}
```

## Summary

| Page | Mobile | Desktop | Visibility |
|------|--------|---------|------------|
| **Homepage** | Fixed bottom, hidden until scroll to works section | Fixed bottom, hidden until scroll to works section | Scroll-based |
| **Works Page** | Fixed bottom, always visible | Fixed bottom, always visible | Always visible |
| **About/Contact** | Hidden | Hidden | Not applicable |

## Key Points
1. **Position**: Always `fixed` at `bottom: 0`
2. **Width**: Full width with 20px margins on left/right
3. **Z-index**: 8 (above most content)
4. **Transition**: Smooth 0.3s opacity fade
5. **Homepage**: Only visible when scrolled to works section
6. **Works Page**: Always visible for filtering
