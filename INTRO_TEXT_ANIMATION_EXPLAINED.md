# intro-text-animation.js - Complete Breakdown

## What This File Does

This file controls the **preloader/intro animation** on your homepage. It's the orchestrator that:
1. Waits for the video to be ready
2. Shows the logo during loading
3. Animates the logo
4. Transitions the logo to the header position
5. Hides the preloader and shows the main content

---

## Main Class: `IntroTextAnimation`

### Constructor (Initialization)
```javascript
constructor(wrapper, config = {})
```

**What it receives:**
- `wrapper` - The `.bloc-intro` element from HTML
- `config` - Configuration from `data/header.json`

**What it sets up:**
- Animation duration (2000ms = 2 seconds)
- Configuration for text or SVG mode
- Initial state tracking

---

## Key Methods Explained

### 1. `init()` and `initParams()`
**Purpose:** Set up the animation environment

**What it does:**
- Locks page scroll (prevents user from scrolling during intro)
- Finds the `.intro-anim` and `.intro-timeline` elements
- Calls `createTextAnimation()` or `createSVGAnimation()`

---

### 2. `createSVGAnimation()` ⭐ (Currently Active)
**Purpose:** Create the SVG logo preloader (what you're using now)

**What it does:**
```javascript
// 1. Clears existing content
this.$intro.innerHTML = '';

// 2. Creates wrapper
const wrapper = document.createElement('div');
wrapper.className = 'intro-logo-wrapper';

// 3. Creates IMG element with your logo
const logo = document.createElement('img');
logo.className = 'intro-logo-svg';
logo.src = this.config.logoSrc; // 'assets/img/final_logo.svg'

// 4. Injects CSS from header.json preset
// Applies mobile, desktop, and extra-large styles

// 5. Fades in the logo
setTimeout(() => {
  logo.style.opacity = '1';
}, 100);
```

**Result:** Your SVG logo appears in the center of the screen

---

### 3. `createTextAnimation()`
**Purpose:** Alternative text-based animation (not currently used)

**What it does:**
- Creates animated text like "DUBAIFILMMAKER"
- Each letter can appear at different times
- Supports patterns like showing "D" and "MAKER" first

**Note:** You're using SVG mode, so this doesn't run

---

### 4. `waitForVideoReady()` ⭐ (Critical Function)
**Purpose:** Wait for the main video to buffer before starting animation

**The Smart Part - Dynamic Buffer Calculation:**
```javascript
// Calculate minimum buffer needed based on video duration
const duration = video.duration || 0;

if (duration > 0) {
  // Need at least 5 seconds (intro duration)
  // But cap at 50% of video to avoid waiting forever
  minBufferNeeded = Math.min(5, duration * 0.5);
} else {
  minBufferNeeded = 3; // Fallback
}
```

**What it checks:**
1. **Video exists** - Is the video element created?
2. **ReadyState 4** - Browser says "I can play this without stalling" (HAVE_ENOUGH_DATA)
3. **Continuous buffer** - Has enough data from the start (no gaps)

**Console logs you see:**
```
⏳ Video not ready yet - waiting for HAVE_ENOUGH_DATA
   Duration: 45.2s
   ReadyState: 2 (need 4 for HAVE_ENOUGH_DATA)
   Continuous buffer: 2.3s (5.1%)
   Required buffer: 5.0s
```

**When ready:**
```
✅ Video ready! Starting intro animation
   Duration: 45.2s
   ReadyState: 4 (HAVE_ENOUGH_DATA)
   Continuous buffer: 8.7s (19.2%)
   Required buffer: 5.0s
```

**Then calls:** `this.launchAnimation()`

---

### 5. `launchAnimation()` ⭐ (Starts the Show)
**Purpose:** Begin the intro animation sequence

**What it does:**

**Step 1: Check if homepage**
```javascript
const isHomepage = document.body.classList.contains('template-homepage');
```
- Only runs full animation on homepage
- Other pages skip animation

**Step 2: Hide header logo during animation**
```javascript
document.body.classList.add('intro-active');
// CSS hides .header__logo when .intro-active exists
```

**Step 3: Start animation**
```javascript
this.$introWrapper.classList.add('lottie-started');
this.$intro.classList.add('animating');
```

**Step 4: Schedule completion**
```javascript
setTimeout(() => {
  this.onAnimationEnded();
}, 5000); // 5 seconds total
```

---

### 6. `onAnimationEnded()` ⭐ (The Grand Finale)
**Purpose:** Transition from preloader to header logo

**The Sequence (with detailed logging):**

**Phase 1: Log Initial Positions**
```javascript
console.log('📍 PRELOADER POSITION (before upward movement):');
console.log('   Top:', preloaderRect.top + 'px');
console.log('   Left:', preloaderRect.left + 'px');

console.log('📍 HEADER LOGO POSITION (target):');
console.log('   Top:', headerRect.top + 'px');
console.log('   Left:', headerRect.left + 'px');
```

**Phase 2: Start Upward Movement (0.8s)**
```javascript
this.$introWrapper.classList.add('lottie-ended');
// CSS moves logo upward to header position
```

**Phase 3: Track Movement (samples every 100ms)**
```javascript
const sampleInterval = setInterval(() => {
  console.log(`📊 UPWARD MOVEMENT [${progress}%]: Top=${rect.top}px`);
}, 100);
```

**Phase 4: Swap Logos (after 800ms)**
```javascript
setTimeout(() => {
  // Show header logo INSTANTLY
  headerLogo.style.opacity = '1';
  headerLogo.style.transition = 'none';
  
  // Fade out preloader logo
  preloaderLogo.style.opacity = '0';
}, 800);
```

**Phase 5: Cleanup (after 1000ms)**
```javascript
setTimeout(() => {
  document.body.classList.add('intro-ended');
  
  setTimeout(() => {
    this.$introWrapper.style.display = 'none';
  }, 500);
}, 1000);
```

---

## Configuration Options

### From `data/header.json`:
```json
{
  "introAnimation": {
    "type": "svg",  // ← You're using this
    "logoSrc": "assets/img/logo/dubaifilmmaker-light.svg",
    "holdDuration": 2000,
    "fadeInDuration": 1000
  }
}
```

**OR for text animation:**
```json
{
  "introAnimation": {
    "type": "text",  // ← Alternative
    "text": "DUBAIFILMMAKER",
    "initialPattern": "DMAKER",
    "holdDuration": 3000,
    "revealStartTime": 3480
  }
}
```

---

## Timeline Breakdown

```
0ms     - Page loads, video starts buffering
???ms   - Video reaches HAVE_ENOUGH_DATA (readyState 4)
        - launchAnimation() called
0ms     - Logo visible, intro-active class added (header logo hidden)
5000ms  - Animation ends, onAnimationEnded() called
5000ms  - Upward movement starts (0.8s CSS transition)
5800ms  - Header logo appears INSTANTLY, preloader fades out
6000ms  - intro-ended class added
6500ms  - Preloader wrapper hidden completely
```

---

## CSS Classes Applied

### During Animation:
- `intro-active` - Hides header logo
- `lottie-started` - Background transition
- `animating` - Triggers CSS animations

### After Animation:
- `lottie-ended` - Triggers upward movement
- `intro-ended` - Shows header logo, hides preloader
- `loaded` - Added to header logo

---

## Key Features

### 1. Smart Video Buffering
- Waits for video to be ready (no fixed timeout)
- Calculates buffer needed based on video duration
- Prevents stuttering during intro

### 2. Seamless Transition
- Preloader logo moves to exact header position
- Header logo appears instantly when preloader reaches target
- No visible "jump" or "flash"

### 3. Detailed Logging
- Tracks every step of the animation
- Shows positions, timing, and progress
- Helps debug issues

### 4. Flexible Configuration
- Supports both SVG and text animations
- Configurable timing and behavior
- Preset-based styling from header.json

---

## Why It's Complex

This file handles:
1. **Async video loading** - Can't start until video is ready
2. **Precise positioning** - Logo must move to exact header position
3. **Timing coordination** - Multiple animations must sync perfectly
4. **Cross-browser compatibility** - Different browsers buffer differently
5. **Responsive design** - Works on mobile and desktop
6. **State management** - Tracks animation progress and prevents duplicates

---

## Current Setup Summary

**You're using:**
- **Type:** SVG animation
- **Logo:** `assets/img/final_logo.svg`
- **Duration:** 5 seconds total
- **Transition:** 0.8 seconds upward movement
- **Buffer wait:** Dynamic (5 seconds or 50% of video, whichever is less)

**The flow:**
1. Video buffers → Logo appears
2. 5 seconds animation → Logo visible
3. 0.8 seconds movement → Logo moves up
4. Instant swap → Header logo appears, preloader fades
5. Cleanup → Preloader hidden

---

## Common Console Logs Explained

```
🚀 intro-text-animation.js loaded - VERSION 2
```
File loaded successfully

```
⏳ Video not ready yet - waiting for HAVE_ENOUGH_DATA
```
Still buffering video

```
✅ Video ready! Starting intro animation
```
Video buffered enough, starting animation

```
🎬 INTRO ANIMATION: Starting at [time]
```
Animation sequence beginning

```
📊 UPWARD MOVEMENT [50%]: Top=300px
```
Logo moving upward (sampled during transition)

```
✅ INTRO ANIMATION: Intro wrapper hidden completely
```
Animation finished, preloader removed

---

## To Modify

**Change logo:**
- Update `logoSrc` in `data/header.json`
- Or change `src` in `index.html` line ~516

**Change timing:**
- Edit `holdDuration` in `data/header.json`
- Or modify `setTimeout(..., 5000)` in `launchAnimation()`

**Disable animation:**
- Set `type: 'none'` in config
- Or remove the script from `index.html`

**Change buffer requirement:**
- Edit `minBufferNeeded` calculation in `waitForVideoReady()`
- Currently: `Math.min(5, duration * 0.5)`
