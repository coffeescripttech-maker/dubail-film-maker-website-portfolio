# 🎨 PRELOADER CUSTOMIZATION GUIDE

## 🎯 QUICK CUSTOMIZATIONS (No Code Knowledge Needed)

### 1️⃣ Change Which Letters Show First

**Location:** `index.html` line 680

**Current Setup:**
```javascript
initialLetters: [0, 9, 10, 11, 12, 13]  // Shows: D and MAKER
```

**Examples:**

**Show only "D":**
```javascript
initialLetters: [0]
```
Result: `D` → `DUBAIFILMMAKER`

**Show "DUBAI":**
```javascript
initialLetters: [0, 1, 2, 3, 4]
```
Result: `DUBAI` → `DUBAIFILMMAKER`

**Show "D" and "M":**
```javascript
initialLetters: [0, 8]
```
Result: `D       M` → `DUBAIFILMMAKER`

**Show first and last letter:**
```javascript
initialLetters: [0, 13]
```
Result: `D           R` → `DUBAIFILMMAKER`

---

### 2️⃣ Change Animation Speed

**Location:** `index.html` line 681-682

**Current Setup:**
```javascript
holdDuration: 3000,      // Hold initial letters for 3 seconds
revealStartTime: 3480    // Start revealing at 3.48 seconds
```

**Make it faster:**
```javascript
holdDuration: 1500,      // Hold for 1.5 seconds
revealStartTime: 1800    // Start revealing at 1.8 seconds
```
Total time: ~3.5 seconds

**Make it slower:**
```javascript
holdDuration: 4000,      // Hold for 4 seconds
revealStartTime: 4500    // Start revealing at 4.5 seconds
```
Total time: ~6.5 seconds

**Make it instant (no hold):**
```javascript
holdDuration: 0,         // No hold
revealStartTime: 0       // Start immediately
```
Total time: ~2 seconds

---

### 3️⃣ Change Letter Reveal Speed

**Location:** `assets/js/intro-text-animation.js` line 130

**Current Setup:**
```javascript
const staggerDelay = 80;  // 80ms between each letter
```

**Faster reveal:**
```javascript
const staggerDelay = 40;  // 40ms between letters (2x faster)
```

**Slower reveal:**
```javascript
const staggerDelay = 150; // 150ms between letters (slower)
```

**All at once:**
```javascript
const staggerDelay = 0;   // All letters appear together
```

---

### 4️⃣ Disable Preloader Completely

**Option A: Via Config (Recommended)**

**Location:** `config.json` or `site-config.js`
```javascript
features: {
  introAnimation: {
    enabled: false  // Turn off preloader
  }
}
```

**Option B: Via HTML**

**Location:** `index.html` line 678
```javascript
if (false) {  // Change true to false
  // Animation code won't run
}
```

**Option C: Hide with CSS**

**Location:** Add to `<style>` in `index.html`
```css
.bloc-intro {
  display: none !important;
}
```

---

## 🎨 ADVANCED CUSTOMIZATIONS

### 5️⃣ Change Text Content

**Location:** `index.html` line 679

**Current:**
```javascript
text: 'DUBAIFILMMAKER'
```

**Change to your company name:**
```javascript
text: 'YOUR COMPANY'
```

**Important:** Update `initialLetters` indices to match new text!

Example for "POSTER":
```javascript
text: 'POSTER',
initialLetters: [0, 5]  // P and R
```

---

### 6️⃣ Change Font Size

**Location:** `assets/css/intro-text-animation.css` line 23

**Current:**
```css
font-size: 5.5vw;  /* Responsive */
```

**Larger:**
```css
font-size: 7vw;    /* Bigger text */
```

**Smaller:**
```css
font-size: 4vw;    /* Smaller text */
```

**Fixed size (not responsive):**
```css
font-size: 100px;  /* Always 100px */
```

---

### 7️⃣ Change Text Color

**Location:** `assets/css/intro-text-animation.css` line 19

**Current:**
```css
color: #ffffff;  /* White */
```

**Examples:**
```css
color: #000000;  /* Black */
color: #ff0000;  /* Red */
color: #00ff00;  /* Green */
color: #0066cc;  /* Blue */
```

---

### 8️⃣ Change Background

**Location:** `assets/dist/build.min.css` (search for `.bloc-intro`)

**Current:** Black background

**To change:** Add to `<style>` in `index.html`:
```css
.bloc-intro {
  background: #1a1a1a !important;  /* Dark gray */
}

/* Or gradient: */
.bloc-intro {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

/* Or image: */
.bloc-intro {
  background: url('assets/img/your-bg.jpg') center/cover !important;
}
```

---

### 9️⃣ Change Letter Spacing

**Location:** `assets/css/intro-text-animation.css` line 20

**Current:**
```css
letter-spacing: 0.02em;
```

**Tighter:**
```css
letter-spacing: 0;      /* No spacing */
```

**Wider:**
```css
letter-spacing: 0.1em;  /* More spacing */
```

---

### 🔟 Change Animation Easing

**Location:** `assets/css/intro-text-animation.css` line 37

**Current:**
```css
animation: letterReveal 0.8s cubic-bezier(0.2, 0, 0.8, 1) forwards;
```

**Smoother:**
```css
animation: letterReveal 0.8s ease-in-out forwards;
```

**Bouncy:**
```css
animation: letterReveal 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
```

**Linear:**
```css
animation: letterReveal 0.8s linear forwards;
```

---

## 🎬 PRESET CONFIGURATIONS

### Preset 1: Fast & Minimal
```javascript
{
  text: 'DUBAIFILMMAKER',
  initialLetters: [0],           // Only D
  holdDuration: 1000,            // 1 second hold
  revealStartTime: 1200          // Quick reveal
}
```
Total: ~3 seconds

### Preset 2: Slow & Dramatic
```javascript
{
  text: 'DUBAIFILMMAKER',
  initialLetters: [0, 13],       // D and R
  holdDuration: 4000,            // 4 second hold
  revealStartTime: 4500          // Slow reveal
}
```
Total: ~7 seconds

### Preset 3: Current (Balanced)
```javascript
{
  text: 'DUBAIFILMMAKER',
  initialLetters: [0, 9, 10, 11, 12, 13],  // D and MAKER
  holdDuration: 3000,            // 3 second hold
  revealStartTime: 3480          // Balanced reveal
}
```
Total: ~5 seconds

### Preset 4: No Hold (Immediate)
```javascript
{
  text: 'DUBAIFILMMAKER',
  initialLetters: [0, 9, 10, 11, 12, 13],
  holdDuration: 0,               // No hold
  revealStartTime: 0             // Start immediately
}
```
Total: ~2 seconds

---

## 🔍 TESTING YOUR CHANGES

### After Making Changes:

1. **Save the file**
2. **Clear browser cache** (Ctrl + Shift + R)
3. **Reload homepage**
4. **Watch the animation**

### Quick Test Checklist:
- [ ] Animation starts automatically
- [ ] Initial letters visible immediately
- [ ] Other letters reveal in sequence
- [ ] Animation completes and fades out
- [ ] Scrolling unlocks after animation
- [ ] No console errors
- [ ] Works on mobile (test with DevTools)

---

## 🐛 COMMON ISSUES & FIXES

### Issue: Animation doesn't start
**Fix:** Check if files are loaded
```javascript
// Open browser console (F12)
console.log(window.IntroTextAnimation);  // Should show function
```

### Issue: Wrong letters showing initially
**Fix:** Check indices match your text
```javascript
// For "DUBAIFILMMAKER":
// D=0, U=1, B=2, A=3, I=4, F=5, I=6, L=7, M=8, A=9, K=10, E=11, R=12
```

### Issue: Animation too fast/slow
**Fix:** Adjust timing values
```javascript
holdDuration: 3000,      // Increase/decrease
revealStartTime: 3480    // Adjust accordingly
```

### Issue: Letters overlap or spacing wrong
**Fix:** Check letter-spacing in CSS
```css
letter-spacing: 0.02em;  /* Adjust this value */
```

### Issue: Text too big/small on mobile
**Fix:** Adjust responsive font sizes
```css
@media (max-width: 768px) {
  .intro-text-animation {
    font-size: 5.5vw;  /* Adjust this */
  }
}
```

---

## 📚 REFERENCE: Letter Indices

For "DUBAIFILMMAKER":
```
Letter:  D  U  B  A  I  F  I  L  M  A  K  E  R
Index:   0  1  2  3  4  5  6  7  8  9  10 11 12 13
```

Use these indices in `initialLetters` array to choose which letters show first.

---

## 🎓 UNDERSTANDING THE CODE

### Why Three Wrappers?
```html
<div class="intro-anim-surwrapper">   ← Outer: Controls overflow
  <div class="intro-anim-wrapper">    ← Middle: Positioning
    <div class="intro-anim">          ← Inner: Animation container
```

**Reason:** Allows complex animations without breaking layout

### Why Two Letter Classes?
```css
.letter              /* Hidden letters */
.letter-initial      /* Visible letters */
```

**Reason:** Different animation behavior for initial vs revealed letters

### Why Animation Delay?
```javascript
letter.style.animationDelay = '3480ms';
```

**Reason:** Creates staggered effect - each letter starts at different time

---

## 💡 PRO TIPS

### Tip 1: Test Timing
Use browser DevTools to slow down animations:
```javascript
// In browser console:
document.querySelector('.intro-text-animation').style.animationDuration = '10s';
```

### Tip 2: Debug Letter Positions
Add borders to see letter boundaries:
```css
.letter {
  border: 1px solid red !important;
}
```

### Tip 3: Skip Animation During Development
```javascript
// In browser console:
document.querySelector('.bloc-intro').style.display = 'none';
document.body.classList.add('intro-ended');
```

### Tip 4: Preview Different Configs
Change values in browser console:
```javascript
// Reload with different config
location.reload();
```

---

## 📞 NEED HELP?

### Common Questions:

**Q: How do I make it like Poster.tv?**
A: Requires custom timing for each letter, complex easing curves, and micro-interactions. Estimated 6-8 hours of refinement.

**Q: Can I use a different font?**
A: Yes! Change `font-family` in CSS line 18. Make sure font is loaded in HTML.

**Q: Can I add images/logo?**
A: Yes! Add `<img>` inside `.intro-anim` container. Adjust CSS accordingly.

**Q: How do I remove the progress bar?**
A: Hide it with CSS:
```css
.intro-timeline { display: none !important; }
```

**Q: Can I change the animation type?**
A: Yes! Modify `@keyframes letterReveal` in CSS. Try different transforms, rotations, etc.

---

**Last Updated**: March 31, 2026  
**Version**: 1.0 (CSS-based implementation)
