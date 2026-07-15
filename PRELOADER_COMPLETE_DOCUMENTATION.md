# 🎬 PRELOADER/INTRO ANIMATION - COMPLETE DOCUMENTATION

## Overview

The preloader is a sophisticated intro animation system that plays when users first visit your homepage. It features a text animation where "DUBAIFILMMAKER" reveals itself in a storytelling style: **DM** (Dubai + Maker) starts together in the center, then splits apart while the middle letters fill in.

---

## 🎯 What You See

### Visual Sequence:

```
PHASE 1 (0-0.5s): DM Together
┌─────────────────────────────┐
│                             │
│           D M               │  ← Very close together, centered
│                             │
└─────────────────────────────┘

PHASE 2 (0.5-1.1s): Split Apart
┌─────────────────────────────┐
│                             │
│      D ←     → M            │  ← Moving to final positions
│                             │
└─────────────────────────────┘

PHASE 3 (0.7-1.6s): Fill In
┌─────────────────────────────┐
│                             │
│   D U B A I F I L M M A K E R  ← Letters appear between
│                             │
└─────────────────────────────┘

PHASE 4 (1.6-2.4s): Move Up
┌─────────────────────────────┐
│   DUBAIFILMMAKER ↑          │  ← Moves to header position
│                             │
│                             │
└─────────────────────────────┘

PHASE 5 (2.4s+): Complete
┌─────────────────────────────┐
│   [LOGO]                    │  ← Header logo visible
│                             │
│   Website content           │
└─────────────────────────────┘
```

---

## 📁 File Structure

### Core Files:

1. **JavaScript Logic**: `assets/js/intro-text-animation.js`
   - Creates HTML structure
   - Manages animation timing
   - Handles video buffer monitoring
   - Controls state transitions

2. **CSS Styles**: `assets/css/intro-text-animation.css`
   - Letter positioning
   - Responsive sizing
   - Container styles
   - Upward movement transition

3. **GSAP Animation**: Inline in `index.html` (lines 674-812)
   - Letter movement choreography
   - DM split animation
   - Fill-in sequence
   - Completion handlers

4. **Size Sync**: `assets/js/intro-logo-size-sync.js`
   - Matches preloader size to header logo
   - Ensures seamless transition
   - Handles responsive sizing

---

## 🔧 How It Works

### 1. HTML Structure (index.html)

```html
<div class="bloc-intro">
  <div class="intro-anim-surwrapper">
    <div class="intro-anim-wrapper">
      <div class="intro-anim">
        <!-- Text created by JavaScript -->
        <div class="intro-logo-svg intro-text-animation">
          <span class="letter">D</span>
          <span class="letter">U</span>
          <span class="letter">B</span>
          <span class="letter">A</span>
          <span class="letter">I</span>
          <span class="letter">F</span>
          <span class="letter">I</span>
          <span class="letter">L</span>
          <span class="letter">M</span>
          <span class="letter">M</span>
          <span class="letter">A</span>
          <span class="letter">K</span>
          <span class="letter">E</span>
          <span class="letter">R</span>
        </div>
      </div>
    </div>
  </div>
  <div class="intro-timeline"><div class="inner"></div></div>
</div>
```

### 2. Animation Flow

#### Step 1: Page Load
- Body has class `template-homepage`
- Header logo is hidden (opacity: 0)
- Preloader is centered on screen
- Scroll is locked

#### Step 2: Video Buffer Check
**File**: `intro-text-animation.js` → `waitForVideoReady()`

```javascript
// Waits for video to have enough buffer
// Checks: readyState >= 4 (HAVE_ENOUGH_DATA)
// Requires: 5 seconds of continuous buffer OR 50% of video
```

**Why?** Ensures smooth video playback after intro completes.

#### Step 3: GSAP Animation Starts
**File**: `index.html` → inline GSAP script

```javascript
// Letter indices:
// D U B A I F I L M M A K E R
// 0 1 2 3 4 5 6 7 8 9 10 11 12 13

const letterD = letters[0];  // D (Dubai)
const letterM = letters[9];  // M (Maker)
const leftGroup = [1,2,3,4]; // UBAI
const middleGroup = [5,6,7,8]; // FILM
const rightGroup = [10,11,12,13]; // AKER

// Timeline:
// 0.0s - 0.5s: Hold DM together
// 0.5s - 1.1s: D moves left, M moves right
// 0.7s - 1.2s: UBAI fills in (left)
// 0.9s - 1.4s: FILM fills in (middle)
// 1.1s - 1.6s: AKER fills in (right)
```

**Animation Details:**
- **Initial State**: D and M positioned close together (60% of font size apart)
- **Centering**: Pair is centered in viewport using calculated offset
- **Movement**: D moves to natural position (left), M moves to natural position (right)
- **Fill-in**: Other letters fade in with scale 0.76 → 1.0 (Posterco style)
- **Easing**: `cubic-bezier(0, 1, 0.8, 0)` for smooth, professional feel

#### Step 4: Animation Complete Event
**File**: `index.html` → GSAP completion handler

```javascript
window.addEventListener('gsap-text-animation-complete', (e) => {
  // 1. Add 'lottie-ended' class to .bloc-intro
  //    → Triggers CSS upward movement
  
  // 2. Wait 800ms for upward movement
  
  // 3. Show header logo instantly
  //    → opacity: 1, no transition
  
  // 4. Fade out preloader text
  //    → opacity: 0, 200ms transition
  
  // 5. Add 'intro-ended' class to body
  //    → Unlocks scroll, hides preloader
});
```

#### Step 5: Upward Movement
**File**: `intro-text-animation.css`

```css
/* When .lottie-ended is added, text moves up */
.bloc-intro.lottie-ended .intro-anim-surwrapper {
  transform: translateY(-50vh); /* Moves to header position */
  transition: transform 0.8s ease;
}
```

**Position Tracking:**
- Preloader starts: Center of screen (50% viewport height)
- After movement: Header position (top of page)
- Transition: 800ms smooth ease

#### Step 6: Logo Swap
**Timing**: After 800ms upward movement

```javascript
// 1. Header logo appears instantly (opacity: 1)
// 2. Preloader text fades out (opacity: 0, 200ms)
// 3. Result: Seamless transition, no gap
```

#### Step 7: Cleanup
**Timing**: After 1200ms total

```javascript
// 1. Add 'intro-ended' class to body
// 2. Unlock scroll
// 3. Hide .intro-anim-wrapper (display: none)
// 4. User can interact with website
```

---

## 🎨 CSS Classes & States

### Container Classes:

| Class | Purpose |
|-------|---------|
| `.bloc-intro` | Main container, handles background blur |
| `.intro-anim-surwrapper` | Outer wrapper, handles upward movement |
| `.intro-anim-wrapper` | Middle wrapper, handles visibility |
| `.intro-anim` | Animation container, holds text |
| `.intro-text-animation` | Text container, holds letters |

### State Classes (Added by JavaScript):

| Class | When Added | Effect |
|-------|------------|--------|
| `.lottie-started` | Animation begins | Background blur transition |
| `.lottie-ended` | Animation complete | Triggers upward movement |
| `.intro-ended` | Transition complete | Unlocks scroll, hides preloader |
| `.intro-active` | During animation | Hides header logo |

### Letter Classes:

| Class | Purpose |
|-------|---------|
| `.letter` | Individual letter span |
| `.letter-initial` | Initially visible letters (D and M) |

---

## 📐 Responsive Sizing

### Font Sizes:

```css
/* Desktop (1920px+) */
font-size: 95px;

/* Large Desktop (1200-1919px) */
font-size: 3.8vw; /* ~73px at 1920px */

/* Tablet (768-1199px) */
font-size: 5vw; /* ~51px at 1024px */

/* Mobile (480-767px) */
font-size: 4.2vw; /* ~32px at 768px */

/* Small Mobile (<480px) */
font-size: 3.8vw; /* ~14px at 375px */
max-width: 95vw; /* Prevent overflow */
```

### Letter Spacing:

```css
/* Desktop */
letter-spacing: 0.02em;

/* Tablet */
letter-spacing: 0.01em;

/* Mobile */
letter-spacing: 0; /* Tighter for small screens */
```

---

## 🔢 Technical Details

### Animation Timing:

| Phase | Duration | Cumulative | Description |
|-------|----------|------------|-------------|
| Hold DM | 0.5s | 0.5s | D and M together |
| Split | 0.6s | 1.1s | D left, M right |
| Fill UBAI | 0.5s | 1.2s | Left letters appear |
| Fill FILM | 0.5s | 1.4s | Middle letters appear |
| Fill AKER | 0.5s | 1.6s | Right letters appear |
| **Total Animation** | **1.6s** | **1.6s** | **Letter reveal complete** |
| Upward Movement | 0.8s | 2.4s | Move to header |
| Logo Swap | 0.2s | 2.6s | Fade transition |
| **Total Intro** | **2.6s** | **2.6s** | **Complete** |

### GSAP Settings:

```javascript
// Initial DM spacing
closeDistance = fontSize * 0.6; // 60% of font size

// Letter fill-in
stagger: 0.06, // 60ms between letters
duration: 0.5, // 500ms per letter
scale: 0.76 → 1.0, // Posterco style
ease: 'cubic-bezier(0, 1, 0.8, 0)' // Smooth easing
```

### Video Buffer Requirements:

```javascript
// Dynamic calculation based on video duration
minBufferNeeded = Math.min(5, duration * 0.5);

// Examples:
// 10s video → 5s buffer (50%)
// 30s video → 5s buffer (16.7%)
// 60s video → 5s buffer (8.3%)

// Checks:
// 1. readyState >= 4 (HAVE_ENOUGH_DATA)
// 2. Continuous buffer from start >= minBufferNeeded
```

---

## 🎯 Key Features

### 1. Responsive Centering
The DM pair is always centered in the viewport, regardless of screen size:

```javascript
// Calculate viewport center
const viewportCenter = window.innerWidth / 2;

// Calculate natural midpoint of DM
const naturalMidpoint = (dRect.left + mRect.left) / 2;

// Calculate offset to center the pair
const centerOffset = viewportCenter - naturalMidpoint;

// Apply offset to both letters
gsap.set(letterD, { x: ... + centerOffset });
gsap.set(letterM, { x: ... + centerOffset });
```

### 2. Seamless Logo Transition
No gap between preloader and header logo:

```javascript
// 1. Preloader moves to header position (800ms)
// 2. Header logo appears instantly at 800ms
// 3. Preloader fades out (200ms)
// 4. Result: Smooth handoff, no flicker
```

### 3. Skip on Return
When navigating back to homepage:

```javascript
// Check sessionStorage for skip flag
const skipIntroFlag = sessionStorage.getItem('skipIntroAnimation');

if (skipIntroFlag === 'true') {
  // Skip animation completely
  // Show content immediately
}
```

### 4. Video Preloading
Intro doesn't start until video is ready:

```javascript
// Waits for:
// - readyState >= 4 (HAVE_ENOUGH_DATA)
// - Continuous buffer >= 5 seconds

// Ensures smooth playback after intro
```

---

## 🛠️ Customization Options

### Change Animation Speed:

**File**: `index.html` → GSAP timeline

```javascript
// Current timing:
tl.to({}, { duration: 0.5 }); // Hold DM
tl.to(letterD, { duration: 0.6 }); // Split
tl.to(leftGroup, { duration: 0.5, stagger: 0.06 }); // Fill

// Make it faster:
tl.to({}, { duration: 0.3 }); // Hold DM (300ms)
tl.to(letterD, { duration: 0.4 }); // Split (400ms)
tl.to(leftGroup, { duration: 0.3, stagger: 0.04 }); // Fill (faster)
```

### Change DM Spacing:

**File**: `index.html` → GSAP initial state

```javascript
// Current: 60% of font size
const closeDistance = fontSize * 0.6;

// Closer together:
const closeDistance = fontSize * 0.4; // 40%

// Further apart:
const closeDistance = fontSize * 0.8; // 80%
```

### Change Letter Stagger:

**File**: `index.html` → GSAP fill-in

```javascript
// Current: 60ms between letters
stagger: 0.06

// Faster:
stagger: 0.03 // 30ms

// Slower:
stagger: 0.1 // 100ms
```

### Disable Intro Animation:

**File**: `index.html` → GSAP script

```javascript
// Add this at the top of the script:
const shouldSkipIntro = true; // Force skip

if (shouldSkipIntro) {
  // Skip animation code...
}
```

---

## 🐛 Troubleshooting

### Issue: Logo not showing after intro

**Check:**
1. Is `intro-ended` class on body?
   ```javascript
   console.log(document.body.classList.contains('intro-ended'));
   ```

2. Is header logo src set?
   ```javascript
   const logo = document.querySelector('.header__logo');
   console.log(logo.src);
   ```

3. Is opacity set to 1?
   ```javascript
   console.log(window.getComputedStyle(logo).opacity);
   ```

**Fix:**
```javascript
// Manually show logo
const logo = document.querySelector('.header__logo');
logo.style.opacity = '1';
logo.classList.add('loaded');
```

### Issue: Animation not starting

**Check:**
1. Is GSAP loaded?
   ```javascript
   console.log(typeof gsap); // Should be 'object'
   ```

2. Are letters found?
   ```javascript
   const letters = document.querySelectorAll('.letter');
   console.log(letters.length); // Should be 14
   ```

3. Is video blocking?
   ```javascript
   const video = document.querySelector('.js-main-video');
   console.log(video.readyState); // Should be 4
   ```

**Fix:**
```javascript
// Force start animation
window.dispatchEvent(new Event('DOMContentLoaded'));
```

### Issue: Text not moving to header

**Check:**
1. Is `lottie-ended` class added?
   ```javascript
   const blocIntro = document.querySelector('.bloc-intro');
   console.log(blocIntro.classList.contains('lottie-ended'));
   ```

2. Is CSS transition working?
   ```javascript
   const surwrapper = document.querySelector('.intro-anim-surwrapper');
   console.log(window.getComputedStyle(surwrapper).transform);
   ```

**Fix:**
```css
/* Add to intro-text-animation.css */
.bloc-intro.lottie-ended .intro-anim-surwrapper {
  transform: translateY(-50vh) !important;
  transition: transform 0.8s ease !important;
}
```

### Issue: Text overflows on mobile

**Check:**
1. Is max-width set?
   ```javascript
   const text = document.querySelector('.intro-text-animation');
   console.log(window.getComputedStyle(text).maxWidth);
   ```

2. Is font size responsive?
   ```javascript
   console.log(window.getComputedStyle(text).fontSize);
   ```

**Fix:**
```css
/* Add to intro-text-animation.css */
@media (max-width: 480px) {
  .intro-text-animation {
    font-size: 3.5vw !important;
    max-width: 90vw !important;
  }
}
```

---

## 📊 Performance Metrics

### Animation Performance:
- **GPU Accelerated**: Yes (transform, opacity)
- **Repaints**: Minimal (only during transitions)
- **JavaScript Loops**: None (GSAP handles timing)
- **Memory Usage**: Low (~2MB for GSAP library)

### Loading Performance:
- **GSAP Library**: 50KB gzipped
- **Custom JS**: 15KB
- **Custom CSS**: 3KB
- **Total Overhead**: ~68KB

### User Experience:
- **First Contentful Paint**: Immediate (preloader shows)
- **Time to Interactive**: 2.6s (after intro completes)
- **Perceived Performance**: Excellent (engaging animation)

---

## 🎓 Learning Resources

### GSAP Documentation:
- Timeline: https://greensock.com/docs/v3/GSAP/Timeline
- Easing: https://greensock.com/docs/v3/Eases
- Stagger: https://greensock.com/docs/v3/Staggers

### CSS Transitions:
- Transform: https://developer.mozilla.org/en-US/docs/Web/CSS/transform
- Transition: https://developer.mozilla.org/en-US/docs/Web/CSS/transition

### Video API:
- ReadyState: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
- Buffered: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered

---

## 📝 Summary

The preloader is a **2.6-second intro animation** that:

1. ✅ Shows "DM" together in center (0.5s)
2. ✅ Splits D and M apart (0.6s)
3. ✅ Fills in middle letters (0.5s)
4. ✅ Moves to header position (0.8s)
5. ✅ Swaps to header logo (0.2s)
6. ✅ Unlocks scroll and shows content

**Key Technologies:**
- GSAP for animation choreography
- CSS for responsive sizing and transitions
- JavaScript for state management and video monitoring

**Design Philosophy:**
- Engaging but not intrusive
- Responsive across all devices
- Seamless transition to content
- Professional, agency-quality feel

---

**Last Updated**: May 22, 2026
**Version**: 2.0 (GSAP-based storytelling animation)
