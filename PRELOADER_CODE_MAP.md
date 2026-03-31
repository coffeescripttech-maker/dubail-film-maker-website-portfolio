# 🗺️ PRELOADER CODE MAP - Exact Locations

## 📍 QUICK REFERENCE: Where Everything Is

---

## 1️⃣ HTML STRUCTURE

### File: `index.html`

**Line 540-548: Preloader Container**
```html
<div class="bloc-intro">
  <div class="intro-anim-surwrapper">
    <div class="intro-anim-wrapper">
      <div class="intro-anim"></div>  ← Text inserted here by JS
    </div>
  </div>
  <div class="intro-timeline">
    <div class="inner"></div>  ← Progress bar
  </div>
</div>
```

**Line 674-700: Initialization Script**
```javascript
// This is where the animation starts
const introWrapper = document.querySelector('.bloc-intro');
if (introWrapper && window.IntroTextAnimation) {
  const animConfig = {
    text: 'DUBAIFILMMAKER',
    initialLetters: [0, 9, 10, 11, 12, 13],
    holdDuration: 3000,
    revealStartTime: 3480
  };
  new IntroTextAnimation(introWrapper, animConfig);
}
```

---

## 2️⃣ JAVASCRIPT LOGIC

### File: `assets/js/intro-text-animation.js`

**Line 1-7: Class Definition**
```javascript
class IntroTextAnimation {
  constructor(wrapper, config = {}) {
    this.$introWrapper = wrapper;
    this.animationDuration = 2000;
    this.config = { ... };
  }
}
```

**Line 9-27: Configuration**
```javascript
this.config = {
  text: config.text || 'DUBAIFILMMAKER',
  initialLetters: config.initialLetters || [0, 9, 10, 11, 12, 13],
  holdDuration: config.holdDuration || 3000,
  revealStartTime: config.revealStartTime || 3480,
  letterDelays: config.letterDelays || null
};
```

**Line 29-32: Initialization**
```javascript
init() {
  this.initParams();
  this.bind();
}
```

**Line 34-44: Setup**
```javascript
initParams() {
  // Lock scroll
  window.c.lockScroll.dispatch();
  
  // Get DOM elements
  this.$intro = this.$introWrapper.querySelector('.intro-anim');
  
  // Create animation
  this.createTextAnimation();
}
```

**Line 46-88: Create Text Animation**
```javascript
createTextAnimation() {
  // Clear existing content
  this.$intro.innerHTML = '';
  
  // Create container
  const textContainer = document.createElement('div');
  textContainer.className = 'intro-text-animation';
  
  // Split text into letters
  text.split('').forEach((letter, index) => {
    const span = document.createElement('span');
    span.className = 'letter';
    
    // Mark initial letters
    if (initialIndices.includes(index)) {
      span.classList.add('letter-initial');
    }
    
    span.textContent = letter;
    textContainer.appendChild(span);
  });
  
  // Apply animation delays
  this.applyAnimationDelays(initialIndices);
}
```

**Line 90-110: Calculate Delays**
```javascript
applyAnimationDelays(initialIndices) {
  letters.forEach((letter, index) => {
    if (initialIndices.includes(index)) {
      // Initial letters: animate at holdDuration
      letter.style.animationDelay = `${holdDuration}ms`;
    } else {
      // Other letters: staggered
      const revealDelay = this.calculateRevealDelay(index, initialIndices);
      letter.style.animationDelay = `${revealDelay}ms`;
    }
  });
}
```

**Line 112-130: Reveal Delay Calculation**
```javascript
calculateRevealDelay(index, initialIndices) {
  const nonInitialIndex = index - initialIndices.filter(i => i < index).length;
  const baseDelay = this.config.revealStartTime;  // 3480ms
  const staggerDelay = 80;  // 80ms between letters ← CHANGE THIS FOR SPEED
  
  return baseDelay + (nonInitialIndex * staggerDelay);
}
```

**Line 132-145: Buffer Monitoring**
```javascript
bind() {
  // Listen for video buffer progress
  if (window.a && window.a.mainPlayerBuffer) {
    window.a.mainPlayerBuffer.listen(this.onBuffer);
  } else {
    // Fallback: wait 2 seconds
    setTimeout(() => this.launchAnimation(), 2000);
  }
}
```

**Line 155-170: Buffer Progress Handler**
```javascript
onBuffer = (progress) => {
  // Update progress bar
  inner.style.width = `${progress * 100}%`;
  
  // When complete, launch
  if (progress >= 1) {
    this.launchAnimation();
  }
};
```

**Line 172-183: Launch Animation**
```javascript
launchAnimation() {
  // Add class for background transition
  this.$introWrapper.classList.add('lottie-started');
  
  // Start CSS animation
  this.$intro.classList.add('animating');
  
  // Wait 5 seconds then complete
  setTimeout(() => {
    this.onAnimationEnded();
  }, 5000);
}
```

**Line 185-207: Animation Complete**
```javascript
onAnimationEnded() {
  // Add completion class
  this.$introWrapper.classList.add('lottie-ended');
  
  // Unlock scroll
  window.c.unlockScroll.dispatch();
  
  // Add exit class after 800ms
  setTimeout(() => {
    document.body.classList.add('intro-ended');
  }, 800);
}
```

---

## 3️⃣ CSS STYLES

### File: `assets/css/intro-text-animation.css`

**Line 1-8: Overflow Fix**
```css
/* Allow MAKER to slide off-screen during animation */
.bloc-intro:not(.lottie-ended) .intro-anim-surwrapper,
.bloc-intro:not(.lottie-ended) .intro-anim-wrapper,
.bloc-intro:not(.lottie-ended) .intro-anim {
  overflow: visible !important;
}
```

**Line 10-32: Text Container**
```css
.intro-text-animation {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Monument Extended Bold', sans-serif;
  font-size: 5.5vw;  ← BASE SIZE
  color: #ffffff;    ← TEXT COLOR
  letter-spacing: 0.02em;  ← LETTER SPACING
}
```

**Line 34-38: Letter Base Style**
```css
.intro-text-animation .letter {
  display: inline-block;
  opacity: 0;  ← Hidden by default
  animation: letterReveal 0.8s cubic-bezier(0.2, 0, 0.8, 1) forwards;
}
```

**Line 40-48: Hidden Letters**
```css
.intro-text-animation .letter:not(.letter-initial) {
  position: absolute;  ← Takes no space
  width: 0;
  height: 0;
  overflow: hidden;
}
```

**Line 50-58: Initial Letters**
```css
.intro-text-animation .letter-initial {
  opacity: 1;          ← Visible
  position: relative;  ← Takes space
  width: auto;
  height: auto;
}
```

**Line 60-82: Reveal Animation**
```css
@keyframes letterReveal {
  0% {
    opacity: 0;
    position: absolute;
    width: 0;
    height: 0;
    transform: scale(0.76492);  ← Starts smaller
  }
  1% {
    position: relative;  ← Switch to take space
    width: auto;
    height: auto;
  }
  100% {
    opacity: 1;
    transform: scale(1);  ← Full size
  }
}
```

**Line 84-94: Stay Visible Animation**
```css
@keyframes letterStayVisible {
  0% { opacity: 1; }
  100% { opacity: 1; }
}
```

**Line 106-144: Responsive Sizes**
```css
/* Tablet */
@media (max-width: 1024px) {
  font-size: 6vw;
}

/* Mobile */
@media (max-width: 768px) {
  font-size: 5.5vw;
}

/* Small Mobile */
@media (max-width: 480px) {
  font-size: 5.5vw;
  max-width: 95vw;
}

/* Large Desktop */
@media (min-width: 1920px) {
  font-size: 115px;  ← Fixed size
}

/* Extra Large */
@media (min-width: 2560px) {
  font-size: 154px;
}
```

---

## 🎯 MOST COMMON EDITS

### Change Speed (EASIEST):
**File:** `index.html` line 681
```javascript
holdDuration: 3000,  ← Change to 2000 for faster
```

### Change Which Letters Show First:
**File:** `index.html` line 680
```javascript
initialLetters: [0, 9, 10, 11, 12, 13]  ← Change these numbers
```

### Change Letter Reveal Speed:
**File:** `assets/js/intro-text-animation.js` line 130
```javascript
const staggerDelay = 80;  ← Change to 50 for faster
```

### Change Text Color:
**File:** `assets/css/intro-text-animation.css` line 19
```css
color: #ffffff;  ← Change to any color
```

### Change Font Size:
**File:** `assets/css/intro-text-animation.css` line 23
```css
font-size: 5.5vw;  ← Change to 7vw for bigger
```

---

## 🔢 LETTER INDEX REFERENCE

```
Text:  D  U  B  A  I  F  I  L  M  A  K  E  R
Index: 0  1  2  3  4  5  6  7  8  9  10 11 12 13
       ↑                          ↑  ↑  ↑  ↑  ↑
       D                          A  K  E  R
       
Currently showing: [0, 9, 10, 11, 12, 13]
```

---

## 🎬 ANIMATION SEQUENCE

```
Time:     0ms    3000ms   3480ms   3560ms   3640ms   3720ms   3800ms   5000ms
          │       │        │        │        │        │        │        │
Screen:   D MAKER │        │        │        │        │        │        │
                  │        │        │        │        │        │        │
          D MAKER │        │        │        │        │        │        │
          (hold)  │        │        │        │        │        │        │
                  │        │        │        │        │        │        │
                  ↓        │        │        │        │        │        │
          D MAKER │        │        │        │        │        │        │
          (bg change)      │        │        │        │        │        │
                           │        │        │        │        │        │
                           ↓        │        │        │        │        │
                  D U      MAKER    │        │        │        │        │
                                    │        │        │        │        │
                                    ↓        │        │        │        │
                           D U B    MAKER    │        │        │        │
                                             │        │        │        │
                                             ↓        │        │        │
                           D U B A  MAKER    │        │        │        │
                                                      │        │        │
                                                      ↓        │        │
                           D U B A I MAKER   │        │        │        │
                                                               │        │
                                                               ↓        │
                           D U B A I F I L M MAKER             │        │
                                                                        │
                                                                        ↓
                           DUBAIFILMMAKER (complete, fade out)
```

---

## 🎯 SUMMARY

**3 Files Control Everything:**
1. `index.html` (line 674) - Configuration
2. `intro-text-animation.js` - Logic
3. `intro-text-animation.css` - Styles

**5 Second Animation:**
- 0-3s: Hold "D MAKER"
- 3-5s: Reveal other letters
- 5s+: Fade out

**Status:** 70% complete (works great, needs polish)

---

**Last Updated**: March 31, 2026
