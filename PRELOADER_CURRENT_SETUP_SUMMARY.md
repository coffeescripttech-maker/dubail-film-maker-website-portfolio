# Preloader Current Setup Summary

## Overview
Your preloader shows a logo during page load, then seamlessly transitions to become the header logo.

---

## Files Involved

### 1. **index.html** (Main HTML Structure)
**Location:** `final_portfolio_website/index.html`

**Preloader Section (lines ~507-520):**
```html
<div class="bloc-intro">
  <div class="intro-anim-surwrapper">
    <div class="intro-anim-wrapper">
      <div class="intro-anim" data-animation="assets/img/intro-animation.json">
        <img
          class="intro-logo-svg"
          src="assets/img/final_logo.svg"
          alt="DubaiFilmMaker"
        />
      </div>
    </div>
  </div>
  <div class="intro-timeline"><div class="inner"></div></div>
</div>
```

**Header Logo (lines ~443-448):**
```html
<a href="index.htm" data-navigo="" class="logo-link">
  <img
    class="header__logo"
    src="assets/img/final_logo.svg"
    alt="Poster"
  />
</a>
```

---

### 2. **Logo Files Used**

#### Preloader Logo:
- **File:** `assets/img/final_logo.svg`
- **Element:** `.intro-logo-svg`
- **Format:** SVG (Scalable Vector Graphics)
- **Purpose:** Shows during intro animation

#### Header Logo:
- **File:** `assets/img/final_logo.svg` (SAME FILE!)
- **Element:** `.header__logo`
- **Format:** SVG
- **Purpose:** Permanent header logo after intro

**Why the same file?** Using the same SVG ensures perfect visual consistency during the transition.

---

### 3. **intro-logo-size-sync.js**
**Location:** `final_portfolio_website/assets/js/intro-logo-size-sync.js`

**Purpose:** Copies the exact size from `.header__logo` to `.intro-logo-svg` for seamless transition

**Key Functions:**
```javascript
function syncLogoSizes() {
  const headerLogo = document.querySelector('.header__logo');
  const introLogo = document.querySelector('.intro-logo-svg');
  
  // Get computed dimensions from header logo
  const headerLogoRect = headerLogo.getBoundingClientRect();
  const computedWidth = headerLogoRect.width;
  const computedHeight = headerLogoRect.height;
  
  // Apply to intro logo
  introLogo.style.width = computedWidth + 'px';
  introLogo.style.height = computedHeight + 'px';
}
```

**When it runs:**
- Immediately on page load
- After 100ms, 300ms, 500ms delays
- On window resize
- When `.intro-anim` gets `.is-visible` class
- When `.bloc-intro` gets `.lottie-ended` class

**Console logs you see:**
```
Logo size synced (#1): {width: '1128px', height: '112.3125px'}
Logo size synced (#2): {width: '1128px', height: '112.3125px'}
Logo size synced (#3): {width: '1128px', height: '112.3125px'}
```
This is NORMAL - it's ensuring perfect alignment at different moments.

---

### 4. **CSS Files**

#### intro-text-animation.css
**Location:** `final_portfolio_website/assets/css/intro-text-animation.css`

Controls the intro animation appearance and transitions.

#### build.min.css
**Location:** `final_portfolio_website/assets/dist/build.min.css`

Contains the main preloader styles and animations.

---

### 5. **Configuration (data/header.json)**
**Location:** `final_portfolio_website/data/header.json`

**Active Preset:** `"reversed"`

```json
{
  "activePreset": "reversed",
  "presets": {
    "reversed": {
      "logo": {
        "src": "assets/img/logo/dubaifilmmaker-original-light.svg",
        "srcDark": "assets/img/logo/dubaifilmmaker-original-dark.svg",
        "alt": "DubaiFilmMaker"
      },
      "introAnimation": {
        "type": "svg",
        "logoSrc": "assets/img/logo/dubaifilmmaker-light.svg",
        "holdDuration": 2000,
        "fadeInDuration": 1000
      }
    }
  }
}
```

**Note:** The HTML currently uses `assets/img/final_logo.svg` directly, not the paths from header.json.

---

## Logo Image Details

### Current Logo in Use:
**File:** `assets/img/final_logo.svg`

**Properties:**
- Format: SVG (Scalable Vector Graphics)
- Used for: Both preloader AND header
- Dimensions: Responsive (scales based on CSS)
- Computed size: ~1128px × 112px (on desktop)

### Why SVG?
✅ Scales perfectly at any resolution (retina, 4K, etc.)
✅ Small file size
✅ Crisp edges at any zoom level
✅ Easy to style with CSS
✅ No pixelation

---

## How The Transition Works

### Step-by-Step Flow:

1. **Page Loads**
   - `.intro-logo-svg` is visible (preloader logo)
   - `.header__logo` is hidden (opacity: 0)

2. **Size Sync Runs**
   - `intro-logo-size-sync.js` copies dimensions from header logo to preloader logo
   - Ensures both logos are exactly the same size

3. **Intro Animation Plays**
   - Logo fades in
   - Timeline bar fills
   - Video buffers in background

4. **Animation Ends**
   - `.bloc-intro` gets `.lottie-ended` class
   - Preloader fades out
   - `.header__logo` fades in (opacity: 1)

5. **Seamless Transition**
   - Because both logos are the same size and position, the transition is invisible
   - User sees one continuous logo

---

## Key CSS Classes

### Preloader States:
- `.intro-anim` - Main animation container
- `.intro-anim.is-visible` - Animation is visible
- `.bloc-intro.lottie-ended` - Animation has completed
- `.intro-logo-svg` - The preloader logo image

### Header States:
- `.header__logo` - Header logo image
- `.header__logo.loaded` - Logo has loaded
- `body.intro-ended .header__logo` - Show header logo after intro

---

## Configuration Options

### To Change Logo:
1. Replace `assets/img/final_logo.svg` with your new logo
2. Keep the same filename, or update both references in `index.html`:
   - Line ~516: `.intro-logo-svg` src
   - Line ~445: `.header__logo` src

### To Adjust Timing:
Edit `data/header.json`:
```json
"introAnimation": {
  "holdDuration": 2000,  // How long logo stays visible (ms)
  "fadeInDuration": 1000 // Fade in duration (ms)
}
```

### To Disable Size Sync Logs:
Edit `intro-logo-size-sync.js` line 42:
```javascript
// Change from:
console.log('Logo size synced (#' + syncCount + '):', {...});

// To:
if (syncCount === 1) {
  console.log('✓ Logo size sync initialized');
}
```

---

## Summary

**Preloader Logo:** `assets/img/final_logo.svg` (SVG)
**Header Logo:** `assets/img/final_logo.svg` (SAME FILE!)
**Size Sync:** `intro-logo-size-sync.js` (runs 3+ times for perfect alignment)
**Transition:** Seamless fade from preloader to header
**Format:** SVG for crisp scaling at any resolution

The multiple "Logo size synced" logs are NORMAL and ensure perfect alignment regardless of when CSS/fonts load.
