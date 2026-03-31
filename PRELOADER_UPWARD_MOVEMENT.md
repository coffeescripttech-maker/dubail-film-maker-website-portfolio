# 🎬 PRELOADER UPWARD MOVEMENT - EXPLAINED

## ✅ YES, IT MOVES UP!

The preloader text **DOES move upward** when the animation completes. Here's exactly how:

---

## 📍 WHERE IT HAPPENS

### File: `assets/dist/build.min.css`

**The Key CSS Rule:**
```css
.bloc-intro.lottie-ended .intro-anim-surwrapper {
  transform: translateY(calc(var(--ivh)/2*-1 + var(--logo-h)/2 + 20px));
}

/* Desktop version: */
@media(min-width:768px) {
  .bloc-intro.lottie-ended .intro-anim-surwrapper {
    transform: translateY(calc(var(--ivh)/2*-1 + var(--logo-h)/2 + 17px));
  }
}
```

---

## 🎯 WHAT THIS MEANS

### Initial Position (During Animation):
```
┌─────────────────────────────┐
│                             │
│                             │
│    DUBAIFILMMAKER           │  ← Center of screen
│                             │
│                             │
└─────────────────────────────┘
```

### Final Position (After Animation):
```
┌─────────────────────────────┐
│    DUBAIFILMMAKER           │  ← Moved UP to header position
├─────────────────────────────┤
│                             │
│                             │
│    Main Content             │
│                             │
└─────────────────────────────┘
```

---

## 🔢 THE MATH EXPLAINED

### The Transform Calculation:
```css
translateY(calc(var(--ivh)/2*-1 + var(--logo-h)/2 + 20px))
```

**Breaking it down:**

1. `var(--ivh)/2*-1` 
   - Takes half the viewport height
   - Makes it negative (moves UP)
   - Example: If viewport is 800px → -400px

2. `+ var(--logo-h)/2`
   - Adds half the logo height back
   - Centers the logo vertically in header area
   - Example: If logo is 40px → +20px

3. `+ 20px` (mobile) or `+ 17px` (desktop)
   - Additional spacing from top
   - Fine-tunes the final position

**Result:** Text moves from center to header position

---

## ⏱️ WHEN IT HAPPENS

### Timeline:
```
0s - 5s:    Text animates in center of screen
            (D → DUBAIFILMMAKER)

5s:         Animation complete
            Class "lottie-ended" added to .bloc-intro

5s - 5.8s:  Text slides UP to header position
            (0.8 second transition)

5.8s+:      Text in final position
            Main content visible
```

---

## 🎨 THE TRANSITION

### CSS Transition:
```css
.intro-anim-surwrapper {
  transition: transform 0.8s var(--main-bezier);
}
```

**What this does:**
- **Duration**: 0.8 seconds (800ms)
- **Property**: transform (the translateY)
- **Easing**: cubic-bezier(0.63, 0.01, 0, 0.83) - smooth curve
- **Effect**: Smooth upward slide

---

## 📱 DEVICE DIFFERENCES

### Mobile (< 768px):
```css
transform: translateY(calc(var(--ivh)/2*-1 + var(--logo-h)/2 + 20px));
```
- Moves up with 20px spacing from top

### Desktop (≥ 768px):
```css
transform: translateY(calc(var(--ivh)/2*-1 + var(--logo-h)/2 + 17px));
```
- Moves up with 17px spacing from top (slightly tighter)

---

## 🎬 VISUAL SEQUENCE

### Step 1: Animation Playing (0-5s)
```
┌─────────────────────────────┐
│                             │
│         D MAKER             │  ← Center
│                             │
└─────────────────────────────┘
```

### Step 2: Animation Complete (5s)
```
┌─────────────────────────────┐
│                             │
│    DUBAIFILMMAKER           │  ← Still center
│                             │
└─────────────────────────────┘
Class added: .lottie-ended
```

### Step 3: Moving Up (5s - 5.8s)
```
┌─────────────────────────────┐
│    DUBAIFILMMAKER           │  ← Sliding up
│         ↑                   │
│         ↑                   │
└─────────────────────────────┘
Transform applied: translateY(-400px + 20px + 20px)
```

### Step 4: Final Position (5.8s+)
```
┌─────────────────────────────┐
│    DUBAIFILMMAKER           │  ← Header position
├─────────────────────────────┤
│                             │
│    [Main Content]           │
│                             │
└─────────────────────────────┘
```

---

## 🔍 HOW TO SEE IT

### In Browser DevTools:

1. **Open DevTools** (F12)
2. **Go to Elements tab**
3. **Find** `.intro-anim-surwrapper`
4. **Watch** the `transform` property change when animation completes

**Before (during animation):**
```css
.intro-anim-surwrapper {
  transform: translateY(-50%);  /* Centered */
}
```

**After (animation complete):**
```css
.intro-anim-surwrapper {
  transform: translateY(-380px);  /* Moved up */
}
```

---

## 🎯 WHY IT MOVES UP

### Purpose:
1. **Smooth Transition**: Text doesn't just disappear
2. **Becomes Header**: Transforms into the site logo/header
3. **Professional Feel**: Mimics high-end agency websites
4. **Continuity**: Maintains visual connection

### The Effect:
- User sees "DUBAIFILMMAKER" animate in center
- Text smoothly slides up to become the header logo
- Main content fades in below
- Creates seamless transition from preloader to site

---

## 🔧 HOW TO CUSTOMIZE

### Change the Final Position:

**File:** `assets/dist/build.min.css` (search for `.lottie-ended`)

**Make it move higher:**
```css
.bloc-intro.lottie-ended .intro-anim-surwrapper {
  transform: translateY(calc(var(--ivh)/2*-1 + var(--logo-h)/2 + 10px));
  /* Changed from 20px to 10px - moves 10px higher */
}
```

**Make it move lower:**
```css
.bloc-intro.lottie-ended .intro-anim-surwrapper {
  transform: translateY(calc(var(--ivh)/2*-1 + var(--logo-h)/2 + 30px));
  /* Changed from 20px to 30px - moves 10px lower */
}
```

### Change the Speed:

**File:** `assets/dist/build.min.css` (search for `.intro-anim-surwrapper`)

**Make it faster:**
```css
.intro-anim-surwrapper {
  transition: transform 0.4s var(--main-bezier);
  /* Changed from 0.8s to 0.4s - 2x faster */
}
```

**Make it slower:**
```css
.intro-anim-surwrapper {
  transition: transform 1.5s var(--main-bezier);
  /* Changed from 0.8s to 1.5s - slower */
}
```

### Disable the Upward Movement:

**Option 1: Keep it centered**
```css
.bloc-intro.lottie-ended .intro-anim-surwrapper {
  transform: translateY(-50%) !important;
  /* Stays centered, doesn't move up */
}
```

**Option 2: Just fade out**
```css
.bloc-intro.lottie-ended .intro-anim-surwrapper {
  transform: translateY(-50%) !important;
  opacity: 0 !important;
  /* Fades out in center instead of moving up */
}
```

---

## 📊 COMPLETE ANIMATION SEQUENCE

```
Time:     0s      3s      5s      5.8s    6s
          │       │       │       │       │
Position: │       │       │       │       │
          │       │       │       │       │
Center ───┼───────┼───────┤       │       │
          │       │       │       │       │
          │       │       │       │       │
          │       │       └───────┤       │
          │       │         Moving│       │
          │       │         Up    │       │
          │       │               │       │
Header ───┼───────┼───────────────┴───────┴───
          │       │                       │
          │       │                       │
          D MAKER │                       │
          (hold)  │                       │
                  │                       │
                  DUBAIFILMMAKER          │
                  (complete)              │
                                          │
                                    In Header
                                    Position
```

---

## 💡 KEY POINTS

1. ✅ **YES, it moves up** - from center to header position
2. ⏱️ **Takes 0.8 seconds** - smooth transition
3. 📐 **Calculated position** - based on viewport and logo height
4. 🎨 **Smooth easing** - cubic-bezier curve
5. 📱 **Responsive** - different spacing on mobile vs desktop
6. 🔧 **Customizable** - can change speed, position, or disable

---

## 🎓 TECHNICAL SUMMARY

**What:** Text moves from center of screen to header position

**When:** After animation completes (at 5 seconds)

**How:** CSS transform translateY with calculated value

**Duration:** 0.8 seconds

**Effect:** Smooth upward slide with easing

**Purpose:** Creates seamless transition from preloader to main site

---

**Last Updated**: March 31, 2026
