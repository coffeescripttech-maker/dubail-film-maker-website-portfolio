# Preloader Workflow Based on header.json Settings

## Overview
The preloader/intro animation behavior is controlled by the `introAnimation` settings in `data/header.json`. Different presets can have different animation types and configurations.

## Current Active Preset: "reversed"

```json
"activePreset": "reversed"
```

## Animation Types

### 1. SVG Logo Animation (Current: "reversed" preset)

**Configuration in header.json:**
```json
"introAnimation": {
  "type": "svg",
  "logoSrc": "assets/img/logo/dubaifilmmaker-light.svg",
  "holdDuration": 2000,
  "fadeInDuration": 1000
}
```

**Workflow:**

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Page Load (0ms)                                     │
├─────────────────────────────────────────────────────────────┤
│ • Body gets class: template-homepage                        │
│ • Intro wrapper visible (full screen)                       │
│ • Background: black                                         │
│ • Scroll: locked                                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: SVG Logo Creation (100ms)                          │
├─────────────────────────────────────────────────────────────┤
│ • Creates <img> with logoSrc                                │
│ • Applies preset logo dimensions from header.json:         │
│   - Mobile: maxHeight from preset.mobile.logo               │
│   - Desktop: maxHeight from preset.desktop.logo             │
│   - XL: maxHeight from preset.extraLarge.logo               │
│ • Initial opacity: 0                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Fade In Logo (100ms + fadeInDuration)              │
├─────────────────────────────────────────────────────────────┤
│ • Logo fades in over fadeInDuration (1000ms)               │
│ • Transition: opacity 1000ms ease                          │
│ • Logo centered on screen                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Hold Logo (holdDuration = 2000ms)                  │
├─────────────────────────────────────────────────────────────┤
│ • Logo stays visible and centered                          │
│ • Duration: 2000ms                                         │
│ • Background remains black                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Animation End (~3100ms total)                      │
├─────────────────────────────────────────────────────────────┤
│ • Adds class: lottie-ended                                 │
│ • Logo fades out (opacity: 0)                              │
│ • Header logo becomes visible                              │
│ • Scroll unlocked                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: Cleanup (800ms later)                              │
├─────────────────────────────────────────────────────────────┤
│ • Adds class: intro-ended to body                          │
│ • Intro wrapper: display: none                             │
│ • Header logo fully visible at top                         │
│ • Page ready for interaction                               │
└─────────────────────────────────────────────────────────────┘
```

**Total Duration:** ~3.9 seconds
- Fade in: 1s
- Hold: 2s
- Fade out: 0.5s
- Cleanup: 0.4s

---

### 2. Text Animation (Alternative: "default" preset)

**Configuration in header.json:**
```json
"introAnimation": {
  "type": "text",
  "text": "DUBAIFILMMAKER",
  "initialPattern": "DUBAIFILMMAKER",
  "holdDuration": 3000,
  "revealStartTime": 3480
}
```

**Workflow:**

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Page Load (0ms)                                     │
├─────────────────────────────────────────────────────────────┤
│ • Creates text: "DUBAIFILMMAKER"                            │
│ • Each letter in <span class="letter">                     │
│ • Initial letters visible (based on initialPattern)        │
│ • Other letters: opacity 0                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Hold Initial Letters (holdDuration = 3000ms)       │
├─────────────────────────────────────────────────────────────┤
│ • Shows only letters from initialPattern                   │
│ • Example: "DMAKER" or "DR" visible                        │
│ • Other letters hidden                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Reveal Animation (revealStartTime = 3480ms)        │
├─────────────────────────────────────────────────────────────┤
│ • Hidden letters fade in one by one                        │
│ • Stagger delay: 80ms between each letter                  │
│ • CSS animation: letter-reveal                             │
│ • Final result: "DUBAIFILMMAKER" fully visible             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Move Up to Header (5000ms)                         │
├─────────────────────────────────────────────────────────────┤
│ • Text moves from center to header position                │
│ • CSS transform: translateY                                │
│ • Text fades out                                           │
│ • Header logo fades in                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Complete (5800ms)                                  │
├─────────────────────────────────────────────────────────────┤
│ • Intro wrapper hidden                                     │
│ • Header logo visible                                      │
│ • Page interactive                                         │
└─────────────────────────────────────────────────────────────┘
```

**Total Duration:** ~5.8 seconds
- Hold initial: 3s
- Reveal letters: 1.5s
- Move up: 0.8s
- Cleanup: 0.5s

---

## How Settings Control Behavior

### Type: "svg"
```json
"introAnimation": {
  "type": "svg",
  "logoSrc": "assets/img/logo/dubaifilmmaker-light.svg",
  "holdDuration": 2000,      // How long logo stays visible
  "fadeInDuration": 1000     // How long fade-in takes
}
```

**What Happens:**
1. Loads SVG from `logoSrc`
2. Applies logo dimensions from preset (mobile/desktop/extraLarge)
3. Fades in over `fadeInDuration`
4. Holds for `holdDuration`
5. Fades out and shows header logo

**Logo Dimensions Come From:**
```json
"mobile": {
  "logo": {
    "maxHeight": "80px",
    "maxWidth": "100%",
    "width": "auto"
  }
},
"desktop": {
  "logo": {
    "maxHeight": "80px",
    "width": "auto"
  }
},
"extraLarge": {
  "logo": {
    "maxHeight": "100px"
  }
}
```

### Type: "text"
```json
"introAnimation": {
  "type": "text",
  "text": "DUBAIFILMMAKER",           // Text to display
  "initialPattern": "DMAKER",      // Letters visible initially
  "holdDuration": 3000,            // Hold initial letters
  "revealStartTime": 3480,         // When to start revealing
  "letterDelays": null             // Custom delays (optional)
}
```

**What Happens:**
1. Creates text with individual letter spans
2. Shows only `initialPattern` letters
3. Waits `holdDuration`
4. Reveals remaining letters starting at `revealStartTime`
5. Moves text up to header position
6. Fades out text, shows header logo

---

## Switching Between Presets

### Change Active Preset
Edit `data/header.json`:
```json
{
  "activePreset": "reversed",  // Change to "default" or "stackedLogo"
  ...
}
```

### Each Preset Can Have Different Animation
- **"reversed"**: SVG logo animation (current)
- **"default"**: Text animation with letter reveal
- **"stackedLogo"**: Can use either type

---

## CSS Classes Timeline

```
Page Load
  ↓
body.template-homepage
  ↓
.intro-wrapper (visible, full screen)
  ↓
.lottie-started (background transition)
  ↓
.intro-anim.animating (animation running)
  ↓
.lottie-ended (animation complete, moving up)
  ↓
body.intro-ended (header logo visible, intro hidden)
  ↓
.intro-wrapper { display: none } (cleanup)
```

---

## Key Files

### Configuration
- `data/header.json` - Animation settings
- `config.json` - Feature toggles

### JavaScript
- `assets/js/intro-text-animation.js` - Main animation logic
- `assets/js/text-logo-handler.js` - Logo loading
- `assets/js/site-config.js` - Config loader

### CSS
- `assets/css/intro-text-animation.css` - Animation styles
- `assets/css/header-logo-match.css` - Logo positioning

### HTML
- `index.html` - Intro wrapper structure

---

## Customization Examples

### Make SVG Animation Faster
```json
"introAnimation": {
  "type": "svg",
  "logoSrc": "assets/img/logo/dubaifilmmaker-light.svg",
  "holdDuration": 1000,      // Reduced from 2000
  "fadeInDuration": 500      // Reduced from 1000
}
```
**Result:** Animation completes in ~2 seconds instead of ~4

### Change Text Pattern
```json
"introAnimation": {
  "type": "text",
  "text": "DUBAIFILMMAKER",
  "initialPattern": "DR",    // Show only D and R initially
  "holdDuration": 2000,      // Shorter hold
  "revealStartTime": 2500    // Start revealing sooner
}
```
**Result:** Faster text reveal animation

### Use Different Logo
```json
"introAnimation": {
  "type": "svg",
  "logoSrc": "assets/img/logo/custom-intro-logo.svg",
  "holdDuration": 2000,
  "fadeInDuration": 1000
}
```
**Result:** Shows custom logo during intro

---

## Debugging

### Check Current Settings
```javascript
// In browser console
console.log(window.__headerConfig);
console.log(window.__headerPresetName);
console.log(window.__headerPreset);
```

### Force Skip Animation
```javascript
// Add to index.html temporarily
document.body.classList.add('intro-ended');
document.querySelector('.intro-wrapper').style.display = 'none';
```

### Test Different Preset
```json
// Change in header.json
"activePreset": "default"  // Test text animation
```

---

## Summary

The preloader workflow is fully controlled by `header.json`:

1. **Type** determines animation style (svg or text)
2. **Durations** control timing
3. **Logo dimensions** come from preset mobile/desktop/extraLarge settings
4. **Pattern** (for text) controls which letters show initially

Current "reversed" preset uses SVG animation with 2-second hold and 1-second fade, totaling ~4 seconds before the page becomes interactive.
