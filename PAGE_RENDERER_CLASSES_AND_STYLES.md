# Page Renderer - Classes and Styles Reference

## What page-renderer.js Adds/Modifies

### 1. Slider Container Fade-In
**Element**: `#homepage-slider` (`.list--home`)
**Location**: `renderHomepageSlider()` lines 493-502

```javascript
// Start hidden
sliderContainer.style.opacity = '0';
sliderContainer.style.transition = 'opacity 0.3s ease';

// Render content after 100ms
setTimeout(() => {
  renderSliderContent(...);
  updateMainVideoSection(...);
  updateSliderCounter(...);
  
  // Fade in
  sliderContainer.style.opacity = '1';
}, 100);
```

**Result**: Smooth fade-in effect when slider loads

---

### 2. Video Element Classes
**Element**: First `<video>` element
**Location**: `updateMainVideoSection()` lines 590-595

```javascript
if (index === 0) {
  video.classList.add('visible', 'loaded');
  video.load();
}
```

**Classes Added**:
- `.visible` - Makes video visible (CSS: `opacity: 1`)
- `.loaded` - Indicates video is loaded

**Other Videos**: No classes added initially (build.min.js adds `.visible` when navigating)

---

### 3. Main Link Styles
**Element**: `#homepage-main-link`
**Location**: `updateMainVideoSection()` lines 619-620

```javascript
mainLink.style.pointerEvents = 'auto';
mainLink.style.opacity = '1';
```

**Initial State** (in HTML):
```html
<a id="homepage-main-link" style="pointer-events: none; opacity: 0.5;">
```

**After Rendering**:
```html
<a id="homepage-main-link" style="pointer-events: auto; opacity: 1;">
```

**Result**: Link becomes clickable and fully visible

---

### 4. Mobile Link Styles
**Element**: `#homepage-mobile-link` (if exists)
**Location**: `updateMainVideoSection()` lines 626-627

```javascript
mobileLink.style.pointerEvents = 'auto';
mobileLink.style.opacity = '1';
```

**Result**: Mobile link becomes clickable and visible

---

### 5. Video Wrapper Content
**Element**: `#homepage-main-video-wrapper`
**Location**: `updateMainVideoSection()` lines 520-580

**Initial State** (in HTML):
```html
<div id="homepage-main-video-wrapper">
  <div style="...">Loading video...</div>
</div>
```

**After Rendering**:
```html
<div id="homepage-main-video-wrapper">
  <video class="js-main-video visible loaded" src="..."></video>
  <video class="js-main-video" data-src="..."></video>
  <video class="js-main-video" data-src="..."></video>
  <!-- ... 3 more videos -->
</div>
```

**Result**: Loading state replaced with 6 video elements

---

### 6. List Items Structure
**Element**: `#homepage-slider` (`.list--home`)
**Location**: `renderSliderContent()` lines 642-680

**Generated HTML**:
```html
<ul class="list list--home js-has-cursor-player" id="homepage-slider">
  <!-- Cursor player wrapper -->
  <div class="cursor-player-animated js-cursor-player-animated">
    <div class="mooving-elements players-wrapper is-player" data-friction="7">
      <video class="js-video player-animated-player" data-src="..."></video>
      <!-- ... 5 more cursor player videos -->
    </div>
  </div>
  
  <!-- List items -->
  <li class="is-active" data-project-index="0">
    <a href="..." class="js-change-video">
      <p>Client</p>
      <h2>Title</h2>
      <p>Classification</p>
    </a>
  </li>
  <!-- ... 5 more list items -->
</ul>
```

**Classes Used**:
- `.cursor-player-animated` - Cursor player container
- `.js-cursor-player-animated` - JavaScript hook for build.min.js
- `.mooving-elements` - Animation wrapper
- `.players-wrapper` - Video container
- `.is-player` - Indicates player type
- `.js-video` - JavaScript hook for video
- `.player-animated-player` - Cursor player video
- `.is-active` - Active list item (first one)
- `.js-change-video` - JavaScript hook for navigation

---

### 7. Counter Update
**Element**: `#slider-total`
**Location**: `updateSliderCounter()` lines 509-512

```javascript
sliderTotal.textContent = total; // e.g., "6"
```

**Result**: Counter shows "1/6" format

---

## CSS Classes Reference

### Classes Added by page-renderer.js
| Class | Element | Purpose |
|-------|---------|---------|
| `.visible` | First `<video>` | Makes video visible |
| `.loaded` | First `<video>` | Indicates loaded state |

### Classes in Generated HTML
| Class | Element | Purpose |
|-------|---------|---------|
| `.cursor-player-animated` | `<div>` | Cursor player container |
| `.js-cursor-player-animated` | `<div>` | JS hook for build.min.js |
| `.mooving-elements` | `<div>` | Animation wrapper |
| `.players-wrapper` | `<div>` | Video container |
| `.is-player` | `<div>` | Player type indicator |
| `.js-video` | `<video>` | JS hook for video |
| `.player-animated-player` | `<video>` | Cursor player video |
| `.is-active` | `<li>` | Active list item |
| `.js-change-video` | `<a>` | JS hook for navigation |

### Classes Expected by build.min.js
| Class | Purpose |
|-------|---------|
| `.js-main-video` | Main video elements |
| `.js-change-video` | Navigation links |
| `.js-cursor-player-animated` | Cursor player initialization |
| `.visible` | Currently visible video |

---

## Inline Styles Reference

### Styles Added by page-renderer.js
| Element | Property | Value | Purpose |
|---------|----------|-------|---------|
| `#homepage-slider` | `opacity` | `0` → `1` | Fade-in effect |
| `#homepage-slider` | `transition` | `opacity 0.3s ease` | Smooth transition |
| `#homepage-main-link` | `pointerEvents` | `auto` | Enable clicking |
| `#homepage-main-link` | `opacity` | `1` | Full visibility |
| `#homepage-mobile-link` | `pointerEvents` | `auto` | Enable clicking |
| `#homepage-mobile-link` | `opacity` | `1` | Full visibility |

### Initial Styles in HTML
| Element | Property | Value | Purpose |
|---------|----------|-------|---------|
| `#homepage-main-link` | `pointerEvents` | `none` | Disabled until loaded |
| `#homepage-main-link` | `opacity` | `0.5` | Dimmed until loaded |

---

## Timeline

```
1. page-renderer.js called
   ↓
2. Set slider opacity: 0
   ↓
3. Wait 100ms
   ↓
4. Generate cursor player HTML
   ↓
5. Generate list items HTML
   ↓
6. Clear video wrapper loading state
   ↓
7. Add first video with .visible .loaded
   ↓
8. Add remaining 5 videos
   ↓
9. Update counter
   ↓
10. Enable main link (pointerEvents: auto, opacity: 1)
    ↓
11. Set slider opacity: 1 (fade in)
    ↓
12. Dispatch 'slider-rendered' event
    ↓
13. build.min.js initializes cursor player
```

---

## Verification Checklist

After page-renderer.js runs, check:

- [ ] `#homepage-slider` has `opacity: 1`
- [ ] First video has classes `.visible .loaded`
- [ ] `#homepage-main-link` has `pointerEvents: auto` and `opacity: 1`
- [ ] Video wrapper contains 6 `<video>` elements
- [ ] List container has cursor player div + 6 list items
- [ ] First list item has `.is-active` class
- [ ] All links have `.js-change-video` class
- [ ] Counter shows correct total (e.g., "1/6")

---

## Related Files

- `assets/js/page-renderer.js` - Main rendering logic
- `assets/dist/build.min.css` - CSS for classes
- `assets/dist/build.min.js` - Navigation and cursor player initialization
- `index.html` - Initial HTML structure
