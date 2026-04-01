# Preloader Text as Permanent Logo - Implementation Plan

## Current Problem
- Preloader text animates and becomes logo on homepage
- When navigating to other pages (Works, About, Contact), system loads SVG logo dynamically
- Logo is inconsistent between pages
- Preloader text is lost when navigating away

## Solution: Use Preloader Text as Permanent Logo

### Approach
1. **Homepage**: Preloader text animates and stays as logo
2. **Other Pages**: Clone the preloader text HTML and use it as logo
3. **Persistence**: Store text configuration in sessionStorage
4. **Consistency**: All pages use the same text-based logo

### Implementation Steps

#### Step 1: Store Text Logo Configuration
When preloader animation completes, store the text in sessionStorage:
```javascript
sessionStorage.setItem('logoText', 'DUBAIFILMMAKER');
sessionStorage.setItem('logoType', 'text'); // vs 'svg'
```

#### Step 2: Create Text Logo Component
Create a reusable function to generate text logo HTML:
```javascript
function createTextLogo(text) {
  const wrapper = document.createElement('div');
  wrapper.className = 'header-text-logo';
  wrapper.style.cssText = `
    font-family: 'Monument Extended Bold', sans-serif;
    font-weight: 700;
    color: #ffffff;
    font-size: 3.8vw;
    letter-spacing: 0.02em;
    white-space: nowrap;
  `;
  wrapper.textContent = text;
  return wrapper;
}
```

#### Step 3: Replace Logo on All Pages
On page load, check if text logo should be used:
```javascript
window.addEventListener('DOMContentLoaded', function() {
  const logoType = sessionStorage.getItem('logoType');
  const logoText = sessionStorage.getItem('logoText');
  
  if (logoType === 'text' && logoText) {
    // Replace <img> with text logo
    const logoImg = document.querySelector('.header__logo');
    const textLogo = createTextLogo(logoText);
    logoImg.parentNode.replaceChild(textLogo, logoImg);
  }
});
```

#### Step 4: Handle Navigation
When clicking menu links, ensure text logo persists:
```javascript
document.querySelectorAll('.header__subnav a').forEach(link => {
  link.addEventListener('click', function() {
    // Text logo already in sessionStorage, will load on next page
  });
});
```

### Benefits
- ✅ Consistent logo across all pages
- ✅ No SVG loading/flashing
- ✅ Seamless transition from preloader to logo
- ✅ Text stays as logo permanently
- ✅ Works with browser back/forward

### Files to Modify
1. `intro-text-animation.js` - Store text in sessionStorage when animation ends
2. `site-config.js` - Check sessionStorage and create text logo on all pages
3. `index.html` - Update logo initialization logic

### Fallback
If sessionStorage is empty (first visit), use default:
- Homepage: Show preloader animation
- Other pages: Load SVG logo from header.json as fallback
