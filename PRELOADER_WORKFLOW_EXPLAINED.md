# Homepage Preloader Workflow

## Overview
The homepage has a special intro animation that plays on first load, then the text/logo moves up to become the header logo.

## Step-by-Step Workflow

### 1. Initial State (Page Load)
```html
<div class="bloc-intro">
  <div class="intro-anim-surwrapper">
    <div class="intro-anim-wrapper">
      <div class="intro-anim"></div>
    </div>
  </div>
  <div class="intro-timeline"><div class="inner"></div></div>
</div>
```

**CSS State:**
- `body.template-homepage:not(.intro-ended) .header__logo` → opacity: 0 (header logo hidden)
- `.bloc-intro` → visible, centered on screen
- Background blur active

### 2. Animation Initialization
**File:** `intro-text-animation.js`

```javascript
const introWrapper = document.querySelector('.bloc-intro');
if (introWrapper && window.IntroTextAnimation) {
  const intro = new IntroTextAnimation(introWrapper, {
    type: 'text', // or 'svg' for logo
    text: 'DUBAIFILMMAKER',
    initialLetters: [0, 9, 10, 11, 12, 13], // D and MAKER visible first
    holdDuration: 3000, // Show D MAKER for 3 seconds
    revealStartTime: 3480 // Start revealing other letters
  });
}
```

### 3. Text Animation Sequence

**Phase 1: Initial Letters (0-3000ms)**
- Shows: `D______MAKER`
- Letters at indices [0, 9, 10, 11, 12, 13] visible
- Other letters hidden (opacity: 0, width: 0)

**Phase 2: Full Reveal (3000-5000ms)**
- Reveals: `DUBAIFILMMAKER`
- Letters animate in with stagger delay (80ms between each)
- All letters become visible

**Phase 3: Movement (5000-5800ms)**
- Text stays visible
- Moves upward to header position
- Background blur fades out
- Class added: `.lottie-ended` on `.bloc-intro`

### 4. Completion
**After 5800ms:**

```javascript
// Add intro-ended class to body
document.body.classList.add('intro-ended');
```

**CSS Changes:**
- `body.template-homepage.intro-ended .header__logo` → opacity: 1 (header logo visible)
- `.bloc-intro` → pointer-events: none (allows clicks through)
- Scroll unlocked

### 5. Navigation Away & Return

**When navigating to another page:**
- Body keeps `intro-ended` class
- Intro animation doesn't replay

**When returning to homepage:**
- Body still has `intro-ended` class
- Header logo shows immediately (opacity: 1)
- No animation replay
- Works like other pages

## Key Files

### HTML Structure
**File:** `index.html`
```html
<!-- Preloader container -->
<div class="bloc-intro">
  <!-- Animation happens here -->
</div>

<!-- Header (hidden during intro) -->
<header class="header">
  <img class="header__logo" src="..." />
</header>
```

### CSS Rules
**File:** `index.html` (inline styles)
```css
/* Hide logo during intro */
body.template-homepage:not(.intro-ended) .header__logo {
  opacity: 0 !important;
}

/* Show logo after intro */
body.template-homepage.intro-ended .header__logo {
  opacity: 1 !important;
}
```

**File:** `intro-text-animation.css`
```css
/* Keep intro visible during movement */
.intro-ended .bloc-intro.lottie-ended {
  opacity: 1 !important;
  pointer-events: none !important;
  z-index: 1 !important;
}

/* Position text at header location */
.bloc-intro.lottie-ended .intro-text-animation {
  padding-top: 17px !important;
}
```

### JavaScript Logic
**File:** `intro-text-animation.js`

```javascript
class IntroTextAnimation {
  constructor(wrapper, config) {
    this.animationDuration = 2000;
    this.config = {
      holdDuration: 3000,
      revealStartTime: 3480
    };
  }
  
  launchAnimation() {
    // Start animation
    this.$intro.classList.add('animating');
    
    // After 5000ms, complete
    setTimeout(() => {
      this.onAnimationEnded();
    }, 5000);
  }
  
  onAnimationEnded() {
    // Add completion class
    this.$introWrapper.classList.add('lottie-ended');
    
    // After 800ms, add intro-ended to body
    setTimeout(() => {
      document.body.classList.add('intro-ended');
    }, 800);
  }
}
```

## Timeline Summary

```
0ms     - Page loads, D MAKER visible
3000ms  - Start revealing other letters
5000ms  - All letters visible, start upward movement
5800ms  - Text at header position, add intro-ended class
5800ms+ - Header logo visible, scroll enabled
```

## Configuration Options

You can customize the animation in `index.html`:

```javascript
const intro = new IntroTextAnimation(introWrapper, {
  type: 'text',              // 'text' or 'svg'
  text: 'DUBAIFILMMAKER',    // Text to animate
  initialLetters: [0, 9, 10, 11, 12, 13], // Which letters show first
  holdDuration: 3000,        // How long to hold initial letters
  revealStartTime: 3480,     // When to start revealing others
  fadeInDuration: 1000       // For SVG logos
});
```

## Disabling the Animation

To disable and show logo immediately, set in `config.json`:

```json
{
  "features": {
    "introAnimation": {
      "enabled": false
    }
  }
}
```

## Troubleshooting

**Logo not showing after intro:**
- Check if `intro-ended` class is on body
- Check if logo has correct src attribute
- Check CSS rules in index.html

**Animation not playing:**
- Check if `IntroTextAnimation` class is loaded
- Check console for errors
- Verify `.bloc-intro` element exists

**Text not moving to header:**
- Check CSS in `intro-text-animation.css`
- Verify `.lottie-ended` class is added
- Check padding-top values
