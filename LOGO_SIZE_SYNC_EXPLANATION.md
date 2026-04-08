# Logo Size Sync Explanation

## What's Happening

The console logs you're seeing:
```
Logo size synced (#1): {width: '1128px', height: '112.3125px'}
Logo size synced (#2): {width: '1128px', height: '112.3125px'}
Logo size synced (#3): {width: '1128px', height: '112.3125px'}
```

These are from `intro-logo-size-sync.js` - a script that ensures the preloader logo matches the exact size of the header logo for a seamless transition.

## Why It Runs Multiple Times

The script syncs the logo size at different moments to catch any dynamic sizing:

1. **Immediately** - First attempt when script loads
2. **On DOMContentLoaded** - When DOM is ready
3. **After 100ms** - Catches early dynamic sizing
4. **After 300ms** - Catches mid-load adjustments
5. **After 500ms** - Final safety check
6. **On resize** - When window is resized
7. **When intro animation becomes visible** - When `.is-visible` class is added
8. **When animation ends** - When `.lottie-ended` class is added

This ensures perfect alignment regardless of when CSS loads or when fonts render.

## Image Formats Used

### 1. Preloader Logo (During Intro Animation)
**Location:** `index.html` line 516
```html
<img
  class="intro-logo-svg"
  src="assets/img/final_logo.svg"
  alt="DubaiFilmMaker"
/>
```
- **Format:** SVG (Scalable Vector Graphics)
- **File:** `assets/img/final_logo.svg`
- **Purpose:** Shows during the intro animation
- **Why SVG:** Scales perfectly at any size, crisp at all resolutions

### 2. Header Logo (After Intro)
**Location:** `index.html` line 443
```html
<img
  class="header__logo"
  src="assets/img/final_logo.svg"
  alt="Poster"
/>
```
- **Format:** SVG
- **File:** Same file - `assets/img/final_logo.svg`
- **Purpose:** Permanent header logo after intro completes

### 3. Configuration (data/header.json)
The active preset is "reversed" which specifies:
```json
"logo": {
  "src": "assets/img/logo/dubaifilmmaker-original-light.svg",
  "srcDark": "assets/img/logo/dubaifilmmaker-original-dark.svg",
  "alt": "DubaiFilmMaker"
}
```

However, the HTML is currently using `assets/img/final_logo.svg` directly.

## How The Transition Works

1. **Page loads** → Preloader logo (`.intro-logo-svg`) is visible
2. **Size sync runs** → Copies exact dimensions from `.header__logo` to `.intro-logo-svg`
3. **Intro animation plays** → Logo animates in place
4. **Animation ends** → Preloader fades out, header logo fades in
5. **Seamless transition** → Because both logos are the same size and position

## Is This Normal?

**Yes!** The multiple sync logs are expected behavior. The script is being thorough to ensure perfect alignment. You can reduce the console noise by:

1. Setting `DEBUG = false` in the inline script (already done)
2. Removing the console.log from `intro-logo-size-sync.js` (optional)

## Should You Use SVG?

**Yes, SVG is the best choice for logos because:**
- Scales perfectly at any resolution (retina displays, 4K, etc.)
- Small file size
- Crisp edges at any zoom level
- Easy to style with CSS (colors, filters, etc.)
- No pixelation

## Current Setup Summary

✅ **Preloader:** SVG (`assets/img/final_logo.svg`)
✅ **Header:** SVG (same file)
✅ **Size sync:** Working correctly (3 syncs is normal)
✅ **Transition:** Seamless because sizes match perfectly

## Optional: Reduce Console Logs

If you want to silence the size sync logs, edit `intro-logo-size-sync.js` line 42:

**Current:**
```javascript
console.log('Logo size synced (#' + syncCount + '):', {
  width: computedWidth + 'px',
  height: computedHeight + 'px'
});
```

**Change to:**
```javascript
// Silent mode - only log if there's an issue
if (syncCount === 1) {
  console.log('✓ Logo size sync initialized');
}
```

This will only show one confirmation message instead of multiple logs.
