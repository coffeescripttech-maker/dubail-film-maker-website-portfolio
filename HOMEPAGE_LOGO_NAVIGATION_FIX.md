# Homepage Logo Navigation Fix

## Problem
When navigating from homepage → about page → back to homepage, the header logo was not visible.

## Root Cause
The issue was a CSS specificity and timing problem:

1. When you first visit homepage, intro animation runs and adds `intro-ended` class
2. When you navigate to about page, `template-homepage` class is removed
3. When you navigate back to homepage, `template-homepage` class is re-added
4. However, the CSS rule `body.template-homepage.intro-ended .header__logo` requires BOTH classes
5. There was a potential race condition or conflicting CSS rules hiding the logo

## Solution

### 1. Enhanced CSS Rules (index.html)
Added multiple fallback rules to ensure logo is always visible when `intro-ended` is present:

```css
/* Primary rule: Homepage with intro ended */
body.template-homepage.intro-ended .header__logo {
  opacity: 1 !important;
  visibility: visible !important;
}

/* Fallback: If intro-ended exists, always show logo */
body.intro-ended .header__logo {
  opacity: 1 !important;
  visibility: visible !important;
}

/* Override any lottie-started hiding when intro-ended is present */
body.intro-ended.lottie-started .header__logo {
  opacity: 1 !important;
  visibility: visible !important;
}
```

### 2. Enhanced JavaScript Logic (site-config.js)
Improved the `updateBodyClass()` function to force logo visibility when navigating back to homepage:

```javascript
if (slug === 'homepage') {
  newClass = 'template-homepage';
  
  const hasIntroEnded = body.classList.contains('intro-ended');
  
  if (hasIntroEnded || !blocIntro) {
    // Ensure intro-ended class is present
    if (!hasIntroEnded) {
      body.classList.add('intro-ended');
    }
    
    // Force logo visibility immediately
    const headerLogo = document.querySelector('.header__logo');
    if (headerLogo) {
      headerLogo.classList.add('loaded');
      headerLogo.style.opacity = '1';
      headerLogo.style.visibility = 'visible';
      headerLogo.style.display = 'block';
    }
    
    // Hide intro wrapper
    const introWrapper = document.querySelector('.intro-wrapper');
    if (introWrapper) {
      introWrapper.style.display = 'none';
    }
  }
}
```

## How It Works Now

### First Visit to Homepage
1. Page loads with `template-homepage` class
2. Intro animation runs
3. After animation completes, `intro-ended` class is added
4. Logo becomes visible via CSS rules

### Navigation Away
1. `template-homepage` class is removed
2. `intro-ended` class STAYS (never removed)
3. New template class is added (e.g., `template-about`)

### Navigation Back to Homepage
1. `template-homepage` class is re-added
2. JavaScript checks if `intro-ended` class exists
3. If yes, immediately:
   - Ensures `intro-ended` class is present
   - Forces logo visibility via inline styles
   - Hides intro wrapper
4. CSS rules ensure logo stays visible

## CSS Specificity Hierarchy

```
Highest Priority (Most Specific)
↓
body.intro-ended.lottie-started .header__logo { opacity: 1 !important; }
↓
body.intro-ended .header__logo { opacity: 1 !important; }
↓
body.template-homepage.intro-ended .header__logo { opacity: 1 !important; }
↓
body.template-homepage:not(.intro-ended) .header__logo { opacity: 0 !important; }
↓
Lowest Priority
```

## Testing Checklist

- [x] First visit to homepage → Logo appears after intro
- [x] Navigate to about page → Logo visible
- [x] Navigate back to homepage → Logo visible immediately
- [x] Navigate to works page → Logo visible
- [x] Navigate back to homepage → Logo visible immediately
- [x] Direct URL to homepage (after intro has run once) → Logo visible
- [x] Refresh homepage → Intro runs, then logo appears

## Files Modified

1. `index.html` - Enhanced CSS rules for logo visibility
2. `assets/js/site-config.js` - Enhanced navigation logic with forced visibility

## Key Principles

1. **Never remove `intro-ended` class** - Once added, it stays forever
2. **Multiple CSS fallbacks** - Ensure logo is visible via multiple rules
3. **Force inline styles** - When navigating back, set inline styles as backup
4. **Hide intro wrapper** - Ensure intro doesn't interfere on return visits

## Debug Commands

Check current state in browser console:
```javascript
// Check body classes
console.log(document.body.className);

// Check if intro-ended is present
console.log(document.body.classList.contains('intro-ended'));

// Check logo visibility
const logo = document.querySelector('.header__logo');
console.log('Logo opacity:', window.getComputedStyle(logo).opacity);
console.log('Logo visibility:', window.getComputedStyle(logo).visibility);
console.log('Logo display:', window.getComputedStyle(logo).display);
```

## Summary

The fix ensures the header logo is always visible when returning to the homepage by:
1. Adding multiple CSS fallback rules with `!important`
2. Forcing inline styles via JavaScript
3. Maintaining the `intro-ended` class permanently
4. Hiding the intro wrapper on return visits

The logo now appears immediately when navigating back to the homepage, providing a seamless user experience.
