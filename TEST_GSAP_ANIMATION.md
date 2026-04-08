# Test GSAP Animation - Quick Guide

## Test File Created

📄 **File**: `test-gsap-animation.html`

This is a standalone HTML file to test the GSAP animation in isolation.

## How to Test

1. Open `test-gsap-animation.html` in your browser
2. Watch the animation:
   - **D** and **R** appear first (0.5s)
   - **Middle letters** cascade in with stagger (0.6s)
3. Click "Restart Animation" button to replay

## What You'll See

```
Timeline:
0.0s - 0.5s:  D and R appear (simultaneously)
0.5s - 0.75s: Hold (250ms delay)
0.75s - 1.35s: U B A I F I L M M A K E appear with stagger
1.35s: Complete - DUBAIFILMMAKER
```

## Console Output

Open browser DevTools (F12) to see:
```
🎬 GSAP Animation Test Starting...
Found 14 letters
✓ DOM loaded, starting animation in 500ms...
🚀 Starting animation...
→ D appearing
→ R appearing
→ Middle letters appearing with stagger
✅ Animation complete!
```

## Animation Code (Inline)

```javascript
// Show D (first letter)
tl.to(letters[0], {
  opacity: 1,
  y: 0,
  duration: 0.5
});

// Show R (last letter) - simultaneously
tl.to(letters[letters.length - 1], {
  opacity: 1,
  y: 0,
  duration: 0.5
}, '<'); // '<' = same time as previous

// Show middle letters with stagger
tl.to(Array.from(letters).slice(1, -1), {
  opacity: 1,
  y: 0,
  stagger: 0.04,
  delay: 0.25,
  duration: 0.6
});
```

## Customization

### Change Speed

```javascript
// Faster
duration: 0.3  // was 0.5

// Slower
duration: 0.8  // was 0.5
```

### Change Stagger

```javascript
// Faster cascade
stagger: 0.02  // was 0.04

// Slower cascade
stagger: 0.08  // was 0.04
```

### Change Delay

```javascript
// Start middle letters sooner
delay: 0.1  // was 0.25

// Start middle letters later
delay: 0.5  // was 0.25
```

## Troubleshooting

### Animation not working?

1. Check console for errors
2. Verify GSAP loaded: `console.log(typeof gsap)`
3. Check letters found: Should show "Found 14 letters"

### Animation too fast/slow?

Adjust the `duration` and `stagger` values in the code.

### Want to add effects?

```javascript
// Add scale effect
tl.to(letters[0], {
  opacity: 1,
  y: 0,
  scale: 1,  // Add this
  duration: 0.5
});

// Add rotation
tl.to(letters[0], {
  opacity: 1,
  y: 0,
  rotation: 0,  // Add this
  duration: 0.5
});
```

## Next Steps

Once you're happy with the animation in the test file:

1. Copy the animation code
2. Paste into `index.html` inline script
3. Or integrate into `intro-text-animation.js`

---

**Status**: ✅ Test file ready
**File**: `test-gsap-animation.html`
**Action**: Open in browser to see animation
