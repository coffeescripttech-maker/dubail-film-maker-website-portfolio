# 🎬 Intro Animation Troubleshooting Guide

## Current Status
✅ **Intro animation is ENABLED** in `config.json`

## Why You Might Not See It

### 1. **Browser Cache Issue** (Most Common)
The browser might be serving cached versions of files.

**Solution:**
- Do a **hard refresh**: 
  - Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
  - Mac: `Cmd + Shift + R`
- Or clear browser cache completely:
  - Chrome: Settings → Privacy → Clear browsing data → Cached images and files
  - Firefox: Settings → Privacy → Clear Data → Cached Web Content

### 2. **Not on Homepage**
The intro animation only shows on the homepage (`index.html`), not on other pages.

**Solution:**
- Make sure you're visiting: `http://localhost:3000/` or `http://localhost:3000/index.html`
- NOT on `/about`, `/works`, or `/contact`

### 3. **Video Not Loading**
The intro animation waits for the main homepage video to buffer before playing.

**Solution:**
- Check browser console (F12) for video loading errors
- Look for messages like: `loadedPercentage`, `readyState`
- If video fails to load, the intro might timeout

### 4. **Script Loading Order**
Scripts must load in the correct order for intro to work.

**Current Order (Correct):**
1. `data-loader.js`
2. `page-renderer.js`
3. `app-init.js`
4. `site-config.js`
5. `build.min.js` ← Initializes intro animation

### 5. **DOM Element Missing**
The intro animation requires the `.bloc-intro` element to exist in the HTML.

**Check:**
```html
<div class="bloc-intro">
  <div class="intro-anim-surwrapper">
    <div class="intro-anim-wrapper">
      <div class="intro-anim" data-animation="assets/img/intro-animation.json"></div>
    </div>
  </div>
  <div class="intro-timeline"><div class="inner"></div></div>
</div>
```

## How the Intro Animation Works

### Flow:
1. **Page loads** → `build.min.js` checks for `.bloc-intro` element
2. **Element found** → Locks scroll, loads Lottie animation from `intro-animation.json`
3. **Waits for video** → Monitors main video buffering progress
4. **Video ready** → Timeline fills up, animation starts playing
5. **Animation complete** → Unlocks scroll, fades out intro, shows homepage

### Key Files:
- **Config**: `config.json` → `features.introAnimation.enabled: true`
- **HTML**: `index.html` → Contains `.bloc-intro` element
- **Animation**: `assets/img/intro-animation.json` → Lottie animation data
- **Logic**: `assets/dist/build.min.js` → Lines 25107-25171 (Intro class)
- **Styling**: `index.html` → Inline styles for `.bloc-intro`

## Diagnostic Tool

We've created a test page to help diagnose issues:

**Visit:** `http://localhost:3000/test-intro.html`

This page will:
- ✅ Check if `config.json` has intro enabled
- ✅ Verify animation file exists
- ✅ Provide troubleshooting steps
- 🧪 Test configuration

## Manual Testing Steps

### Step 1: Verify Config
```bash
# Check config.json
cat config.json | grep -A 2 "introAnimation"
```

Should show:
```json
"introAnimation": {
  "enabled": true
}
```

### Step 2: Check Browser Console
1. Open homepage: `http://localhost:3000/`
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Look for these messages:
   - `✓ Intro animation enabled` (from site-config.js)
   - `loadedPercentage` (from build.min.js)
   - `lottie-started` (when animation begins)

### Step 3: Check Network Tab
1. In DevTools, go to **Network** tab
2. Reload page (Ctrl+R)
3. Look for these files:
   - `config.json` → Status 200
   - `intro-animation.json` → Status 200
   - `build.min.js` → Status 200

### Step 4: Check Elements
1. In DevTools, go to **Elements** tab
2. Search for: `.bloc-intro`
3. Should see:
   ```html
   <div class="bloc-intro" style="">
   ```
   - If `style="display: none;"` → Config is disabled
   - If `style=""` → Config is enabled ✅

## Common Console Messages

### ✅ Good Messages:
```
✓ Intro animation enabled
loadedPercentage 0.5
loadedPercentage 1
lottie-started
intro-ended
```

### ❌ Problem Messages:
```
✓ Intro animation hidden  ← Config disabled
Failed to load intro-animation.json  ← File missing
Cannot read property 'loadAnimation'  ← Lottie library issue
```

## Quick Fix Checklist

- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Verify on homepage, not other pages
- [ ] Check `config.json` has `"enabled": true`
- [ ] Check browser console for errors
- [ ] Clear browser cache completely
- [ ] Try different browser (Chrome/Firefox)
- [ ] Check if video is loading (Network tab)
- [ ] Verify `intro-animation.json` exists

## Still Not Working?

### Debug Mode:
Add this to browser console on homepage:
```javascript
// Check if intro element exists
console.log('Intro element:', document.querySelector('.bloc-intro'));

// Check if Lottie is loaded
console.log('Lottie available:', typeof lottie !== 'undefined');

// Check config
fetch('/config.json').then(r => r.json()).then(c => 
  console.log('Intro enabled:', c.features.introAnimation.enabled)
);
```

### Force Intro to Show:
If you want to force the intro to show for testing, add this to browser console:
```javascript
// Remove any display:none
const intro = document.querySelector('.bloc-intro');
if (intro) {
  intro.style.display = '';
  console.log('Intro display reset');
}
```

## Need More Help?

1. Run the diagnostic tool: `/test-intro.html`
2. Check browser console for errors
3. Verify all files exist and load correctly
4. Try incognito/private browsing mode (no cache)

---

**Last Updated:** Based on conversation summary
**Status:** Intro animation is enabled and should work after hard refresh
