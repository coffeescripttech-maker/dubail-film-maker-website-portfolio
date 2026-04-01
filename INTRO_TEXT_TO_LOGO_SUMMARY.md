# Intro Text Animation to Header Logo - Complete Implementation

## Overview
The preloader text "DUBAIFILMMAKER" animates at screen center, then moves up to become the actual header logo. The text stays visible throughout and serves as the functional logo.

## Current Implementation

### 1. Text Animation (Center Position)
- Text starts centered on screen
- Initial letters "DMAKER" visible
- After 3 seconds, reveals full "DUBAIFILMMAKER"
- Uses flexbox wrapper for perfect centering
- Font size: `3.8vw` (responsive across devices)

### 2. Movement to Header Position
When animation completes:
- `.lottie-ended` class added to `.bloc-intro`
- `.intro-ended` class added to `<html>` and `<body>`
- CSS transform moves entire container up
- Text transitions from center to header logo position

### 3. Header Structure
```html
<header class="header">  <!-- margin: 20px 20px 0 -->
  <div class="header__nav">  <!-- flex, align-items: flex-end, gap: 24px -->
    <a class="logo-link">
      <img class="header__logo" style="opacity: 0; visibility: hidden;">
    </a>
    <a class="btn btn--menu">menu.</a>
  </div>
</header>
```

### 4. Positioning Logic

**Mobile (≤767px):**
- Header: `margin: 20px 20px 0`
- Transform: `translateY(calc(var(--ivh) / 2 * -1 + 60px))`
- Text wrapper: `padding: 0 20px`, `justify-content: flex-start`
- Result: Text at 60px from top, 20px from left

**Desktop (≥768px):**
- Header: `margin: 0 30px`, `padding-top: 17px`
- Transform: `translateY(calc(var(--ivh) / 2 * -1 + 47px))`
- Text wrapper: `padding: 0 30px`, `justify-content: flex-start`
- Result: Text at 47px from top, 30px from left

### 5. CSS Override Strategy
```css
/* Keep text visible - override build.min.css opacity: 0 */
html.intro-ended .bloc-intro.lottie-ended,
body.intro-ended .bloc-intro.lottie-ended {
  opacity: 1 !important;
  pointer-events: none !important;
}

/* Keep text itself visible */
.intro-ended .bloc-intro .intro-text-animation {
  opacity: 1 !important;
  visibility: visible !important;
}

/* Position at header location */
.bloc-intro.lottie-ended .intro-anim-surwrapper {
  transform: translateY(calc(var(--ivh) / 2 * -1 + 60px)) !important;
}

/* Align left like header logo */
.bloc-intro.lottie-ended .intro-text-wrapper {
  padding: 0 20px !important;
  justify-content: flex-start !important;
}
```

## Current Issues

### Mobile Positioning
- Text may be too high (overlapping status bar)
- Need to match exact vertical alignment with menu button
- Header__nav uses `align-items: flex-end` for bottom alignment

### Adjustment Needed
The text should align with the bottom edge of the menu button, matching the `flex-end` behavior of `.header__nav`.

## Next Steps
1. Fine-tune vertical offset to match menu button baseline
2. Test on various mobile devices
3. Ensure text doesn't overlap with status bar
4. Verify alignment matches reference (POSTER example)
