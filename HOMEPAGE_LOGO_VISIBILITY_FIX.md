# Homepage Logo Visibility Fix

## Problem
When navigating away from the homepage and then back, the header logo was hidden even though it was present in the DOM.

## Root Cause
The CSS rule in `index.html` required BOTH the `intro-ended` class AND the `loaded` class for the logo to be visible:

```css
/* OLD - Required both classes */
body.template-homepage.intro-ended .header__logo.loaded {
  opacity: 1 !important;
}
```

When navigating back to the homepage:
- The `intro-ended` class was present on the body
- But the `loaded` class was not being added to the logo
- Result: Logo remained hidden (opacity: 0)

## Solution
Simplified the CSS rule to only require the `intro-ended` class:

```css
/* NEW - Only requires intro-ended class */
body.template-homepage.intro-ended .header__logo {
  opacity: 1 !important;
}
```

Now when you navigate back to the homepage:
- The `intro-ended` class is already on the body
- The logo shows immediately without needing the `loaded` class
- Works consistently like other pages (Contact, About, Works)

## Files Changed
- `final_portfolio_website/index.html` - Updated CSS rule (line 107-109)

## Testing
1. Load homepage - intro animation plays, logo appears after intro
2. Navigate to Contact page - logo visible
3. Navigate back to homepage - logo now visible immediately ✓

## Poster Image Verification
Verified that poster images are correctly rendered in works page:
- `src` attribute uses `project.poster_image`
- `srcset` attribute uses `project.poster_image_srcset`
- Both fields are properly populated from API response
- Images display correctly with responsive srcset support
